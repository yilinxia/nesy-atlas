#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchWithRetry } from './fetch-with-retry.mjs';

export const PAPER_KEYWORDS = [
  'neurosymbolic',
  'neuro-symbolic',
  'neuro symbolic',
  'neural-symbolic',
  'neural symbolic',
  'NeSy'
];

export const INCREMENTAL_LOOKBACK_DAYS = 7;

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

function arxivDateTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid arXiv query date: ${value}`);
  return date.toISOString().replace(/[-:T]/g, '').slice(0, 12);
}

export function buildSearchQuery(submittedAfter, submittedBefore) {
  if (!submittedAfter && !submittedBefore) return query;
  if (!submittedAfter || !submittedBefore) {
    throw new Error('Incremental arXiv queries require both submittedAfter and submittedBefore.');
  }
  return `(${query}) AND submittedDate:[${arxivDateTime(submittedAfter)} TO ${arxivDateTime(submittedBefore)}]`;
}

export function mergePaperSnapshots(existingPapers, freshPapers) {
  const merged = new Map(existingPapers.map((paper) => [paper.id, paper]));
  freshPapers.forEach((paper) => merged.set(paper.id, paper));
  return [...merged.values()].sort((left, right) => (
    right.published.localeCompare(left.published)
    || right.updated.localeCompare(left.updated)
    || right.id.localeCompare(left.id)
  ));
}

export function parseDataScript(source) {
  const match = String(source).match(
    /globalThis\.ARXIV_PAPERS_META\s*=\s*([\s\S]*?);\s*globalThis\.ARXIV_PAPERS\s*=\s*([\s\S]*);\s*$/
  );
  if (!match) throw new Error('Could not parse the existing arXiv snapshot.');
  const metadata = JSON.parse(match[1]);
  const papers = JSON.parse(match[2]);
  if (!metadata || typeof metadata !== 'object' || !Array.isArray(papers)) {
    throw new Error('The existing arXiv snapshot has an invalid structure.');
  }
  return { metadata, papers };
}

function validateArxivFeed(xml) {
  if (!/<feed(?:\s|>)/i.test(xml) || !/<opensearch:totalResults>\d+<\/opensearch:totalResults>/i.test(xml)) {
    throw new Error('arXiv API returned a malformed feed; the existing snapshot was preserved.');
  }
}

export async function fetchPapers(fetchImpl = fetch, options = {}) {
  const {
    sleepImpl = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms)),
    paginationDelayMs = 3000,
    retryBaseDelayMs = 30000,
    retryMaxDelayMs = 240000,
    retryAttempts = 5,
    randomImpl = Math.random,
    nowImpl = Date.now,
    onRetry,
    submittedAfter,
    submittedBefore
  } = options;
  const pageSize = 500;
  const papers = [];
  let start = 0;
  let total = Infinity;

  while (start < total) {
    const params = new URLSearchParams({
      search_query: buildSearchQuery(submittedAfter, submittedBefore),
      start: String(start),
      max_results: String(pageSize),
      sortBy: 'submittedDate',
      sortOrder: 'descending'
    });
    const response = await fetchWithRetry(`https://export.arxiv.org/api/query?${params}`, {
      fetchImpl,
      fetchOptions: {
        headers: { 'User-Agent': 'NeSy-Atlas/1.0 (https://github.com/yilinxia/nesy-atlas)' }
      },
      timeoutMs: 30000,
      maxAttempts: retryAttempts,
      baseDelayMs: retryBaseDelayMs,
      maxDelayMs: retryMaxDelayMs,
      sleepImpl,
      randomImpl,
      nowImpl,
      label: `arXiv API page starting at ${start}`,
      ...(onRetry ? { onRetry } : {})
    });
    if (!response.ok) throw new Error(`arXiv API returned HTTP ${response.status}`);

    const xml = await response.text();
    validateArxivFeed(xml);
    total = parseTotalResults(xml);
    const page = parseArxivFeed(xml);
    papers.push(...page);
    start += pageSize;

    if (!xml.includes('<entry>') || start >= total) break;
    await sleepImpl(paginationDelayMs);
  }

  return [...new Map(papers.map((paper) => [paper.id, paper])).values()]
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function buildDataScript(papers, generatedAt = new Date().toISOString(), metadataOverrides = {}) {
  const metadata = {
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/',
    generatedAt,
    cursorAt: generatedAt,
    refreshMode: 'full',
    lastFullRefreshAt: generatedAt,
    keywords: PAPER_KEYWORDS,
    inclusion: 'Title or abstract contains at least one keyword.',
    ...metadataOverrides
  };
  return `// Generated by scripts/update-arxiv-papers.mjs. Do not edit manually.\n`
    + `globalThis.ARXIV_PAPERS_META = ${JSON.stringify(metadata, null, 2)};\n`
    + `globalThis.ARXIV_PAPERS = ${JSON.stringify(papers, null, 2)};\n`;
}

async function readExistingSnapshot(outputPath) {
  try {
    return parseDataScript(await readFile(outputPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export function assertSafeFullRefresh(previousPapers, freshPapers) {
  if (freshPapers.length === 0) {
    throw new Error('Full arXiv refresh returned no qualifying papers; the existing snapshot was preserved.');
  }
  if (previousPapers.length > 0 && freshPapers.length < previousPapers.length * 0.8) {
    throw new Error(
      `Full arXiv refresh returned only ${freshPapers.length} of ${previousPapers.length} existing papers; `
      + 'the result looks incomplete, so the existing snapshot was preserved.'
    );
  }
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
  const previous = await readExistingSnapshot(outputPath);
  const queryEnd = new Date();
  let freshPapers;
  let papers;
  let metadataOverrides;

  if (inputPaths.length > 0) {
    freshPapers = [...new Map((await Promise.all(inputPaths.map((inputPath) => readFile(resolve(inputPath), 'utf8'))))
      .flatMap(parseArxivFeed)
      .map((paper) => [paper.id, paper])).values()]
      .sort((a, b) => b.published.localeCompare(a.published));
    papers = freshPapers;
    metadataOverrides = { refreshMode: 'full' };
  } else if (process.argv.includes('--full') || !previous) {
    freshPapers = await fetchPapers();
    assertSafeFullRefresh(previous?.papers || [], freshPapers);
    papers = freshPapers;
    metadataOverrides = { refreshMode: 'full' };
  } else {
    if (previous.papers.length === 0) {
      throw new Error('Incremental refresh requires a non-empty existing snapshot; run again with --full.');
    }
    const previousCursor = new Date(previous.metadata.cursorAt || previous.metadata.generatedAt);
    if (!Number.isFinite(previousCursor.getTime())) {
      throw new Error('The existing arXiv snapshot has no valid cursor; run again with --full.');
    }
    const windowStart = new Date(
      Math.min(previousCursor.getTime(), queryEnd.getTime())
      - INCREMENTAL_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
    );
    freshPapers = await fetchPapers(fetch, {
      submittedAfter: windowStart,
      submittedBefore: queryEnd
    });
    papers = mergePaperSnapshots(previous.papers, freshPapers);
    metadataOverrides = {
      refreshMode: 'incremental',
      lastFullRefreshAt: previous.metadata.lastFullRefreshAt || previous.metadata.generatedAt,
      previousSnapshotAt: previous.metadata.generatedAt,
      windowStart: windowStart.toISOString(),
      lookbackDays: INCREMENTAL_LOOKBACK_DAYS
    };
  }

  const generatedAt = new Date().toISOString();
  if (metadataOverrides.refreshMode === 'full') metadataOverrides.lastFullRefreshAt = generatedAt;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buildDataScript(papers, generatedAt, metadataOverrides), 'utf8');
  console.log(
    `Wrote ${papers.length} qualifying arXiv papers to ${outputPath} `
    + `(${metadataOverrides.refreshMode}; fetched ${freshPapers.length})`
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
