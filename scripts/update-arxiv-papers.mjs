#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PAPER_KEYWORDS = [
  'neurosymbolic',
  'neuro-symbolic',
  'neuro symbolic',
  'neural-symbolic',
  'neural symbolic',
  'NeSy'
];

const keywordPattern = /\b(?:neuro[\s-]?symbolic|neural[\s-]+symbolic|nesy)\b/gi;
const query = [
  'all:neurosymbolic',
  'all:"neuro-symbolic"',
  'all:"neuro symbolic"',
  'all:"neural-symbolic"',
  'all:"neural symbolic"',
  'all:NeSy'
].map((term) => `(${term})`).join(' OR ');

function decodeXml(value) {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

function textContent(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1]).replace(/\s+/g, ' ').trim() : '';
}

function allTextContents(xml, tag) {
  const matches = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi')) || [];
  return matches.map((match) => textContent(match, tag)).filter(Boolean);
}

function attribute(xml, tag, name) {
  const matches = xml.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || [];
  for (const candidate of matches) {
    const match = candidate.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'));
    if (match) return decodeXml(match[1]);
  }
  return '';
}

function allAttributes(xml, tag, name) {
  const matches = xml.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || [];
  return matches.flatMap((candidate) => {
    const match = candidate.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'));
    return match ? [decodeXml(match[1])] : [];
  });
}

export function matchedKeywords(value) {
  const matches = String(value).match(keywordPattern) || [];
  return [...new Set(matches.map((match) => {
    const normalized = match.toLowerCase().replace(/\s+/g, ' ');
    if (normalized === 'nesy') return 'NeSy';
    return normalized;
  }))];
}

export function parseArxivFeed(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];
  return entries.map((entry) => {
    const rawId = textContent(entry, 'id');
    const id = rawId.match(/\/abs\/(.+?)(?:v\d+)?$/i)?.[1] || rawId;
    const title = textContent(entry, 'title');
    const abstract = textContent(entry, 'summary');
    const titleMatches = matchedKeywords(title);
    const abstractMatches = matchedKeywords(abstract);
    const authorEntries = entry.match(/<author>[\s\S]*?<\/author>/gi) || [];
    const authorAffiliations = authorEntries.map((author) => ({
      name: textContent(author, 'name'),
      affiliations: [...new Set(allTextContents(author, 'arxiv:affiliation')
        .filter((affiliation) => affiliation && affiliation.toLowerCase() !== 'steve'))]
    })).filter((author) => author.name);
    const authors = authorAffiliations.map((author) => author.name);
    const affiliations = [...new Set(authorAffiliations.flatMap((author) => author.affiliations))];
    const categories = allAttributes(entry, 'category', 'term');
    const primaryCategory = attribute(entry, 'arxiv:primary_category', 'term') || categories[0] || '';

    return {
      id,
      title,
      abstract,
      authors,
      authorAffiliations,
      affiliations,
      published: textContent(entry, 'published').slice(0, 10),
      updated: textContent(entry, 'updated').slice(0, 10),
      categories,
      primaryCategory,
      url: `https://arxiv.org/abs/${id}`,
      pdfUrl: `https://arxiv.org/pdf/${id}`,
      matches: {
        title: titleMatches,
        abstract: abstractMatches
      }
    };
  }).filter((paper) => paper.matches.title.length > 0 || paper.matches.abstract.length > 0);
}

export function parseTotalResults(xml) {
  return Number(textContent(xml, 'opensearch:totalResults')) || 0;
}

export async function fetchPapers(fetchImpl = fetch) {
  const pageSize = 500;
  const papers = [];
  let start = 0;
  let total = Infinity;

  while (start < total) {
    const params = new URLSearchParams({
      search_query: query,
      start: String(start),
      max_results: String(pageSize),
      sortBy: 'submittedDate',
      sortOrder: 'descending'
    });
    const response = await fetchImpl(`https://export.arxiv.org/api/query?${params}`, {
      headers: { 'User-Agent': 'NeSy-Atlas/1.0 (https://github.com/yilinxia/nesy-comp)' }
    });
    if (!response.ok) throw new Error(`arXiv API returned HTTP ${response.status}`);

    const xml = await response.text();
    total = parseTotalResults(xml);
    const page = parseArxivFeed(xml);
    papers.push(...page);
    start += pageSize;

    if (!xml.includes('<entry>') || start >= total) break;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 3000));
  }

  return [...new Map(papers.map((paper) => [paper.id, paper])).values()]
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function buildDataScript(papers, generatedAt = new Date().toISOString()) {
  const metadata = {
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/',
    generatedAt,
    keywords: PAPER_KEYWORDS,
    inclusion: 'Title or abstract contains at least one keyword.'
  };
  return `// Generated by scripts/update-arxiv-papers.mjs. Do not edit manually.\n`
    + `globalThis.ARXIV_PAPERS_META = ${JSON.stringify(metadata, null, 2)};\n`
    + `globalThis.ARXIV_PAPERS = ${JSON.stringify(papers, null, 2)};\n`;
}

async function main() {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const outputIndex = process.argv.indexOf('--output');
  const inputPaths = process.argv.flatMap((argument, index) => (
    argument === '--input' && process.argv[index + 1] ? [process.argv[index + 1]] : []
  ));
  const outputPath = outputIndex >= 0
    ? resolve(process.argv[outputIndex + 1])
    : resolve(projectRoot, 'data/arxiv-papers.js');
  const papers = inputPaths.length > 0
    ? [...new Map((await Promise.all(inputPaths.map((inputPath) => readFile(resolve(inputPath), 'utf8'))))
      .flatMap(parseArxivFeed)
      .map((paper) => [paper.id, paper])).values()]
      .sort((a, b) => b.published.localeCompare(a.published))
    : await fetchPapers();
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buildDataScript(papers), 'utf8');
  console.log(`Wrote ${papers.length} qualifying arXiv papers to ${outputPath}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
