#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPANIES_PATH = resolve(ROOT, 'data/companies.js');
const O9_PATH = resolve(ROOT, 'data/o9-posts.json');
const JSON_PATH = resolve(ROOT, 'data/blog-keyword-matches.json');
const JS_PATH = resolve(ROOT, 'data/blog-keyword-matches.js');
const KEYWORD_PATTERN = /\b(?:neuro[\s-]?symbolic|neural[\s-]+symbolic|nesy)\b/i;
const DEFAULT_CONCURRENCY = 12;
const FETCH_TIMEOUT_MS = 20000;

function optionNumber(name, fallback) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? Number(process.argv[index + 1]) : fallback;
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&nbsp;', ' ');
}

function plainText(value) {
  return decodeEntities(String(value || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function articleBodyFromJsonLd(html) {
  const scripts = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  const findBody = (value) => {
    if (!value || typeof value !== 'object') return '';
    if (typeof value.articleBody === 'string') return value.articleBody;
    for (const child of Array.isArray(value) ? value : Object.values(value)) {
      const body = findBody(child);
      if (body) return body;
    }
    return '';
  };
  for (const script of scripts) {
    const source = script.replace(/^<script\b[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
    try {
      const body = findBody(JSON.parse(source));
      if (body) return plainText(body);
    } catch {
      // Invalid embedded metadata is common; continue to semantic HTML.
    }
  }
  return '';
}

export function extractArticleText(html) {
  const jsonLdBody = articleBodyFromJsonLd(html);
  if (jsonLdBody) return jsonLdBody;

  const cleaned = String(html || '')
    .replace(/<(script|style|svg|nav|header|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  const article = cleaned.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  const main = cleaned.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const body = cleaned.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  for (const candidate of [article, main, body, cleaned]) {
    const text = plainText(candidate);
    if (text) return text;
  }
  return '';
}

export function classifyPost(title, content) {
  const titleMatch = KEYWORD_PATTERN.test(String(title || ''));
  const contentMatch = KEYWORD_PATTERN.test(String(content || ''));
  return {
    match: titleMatch || contentMatch,
    matchedIn: [titleMatch ? 'title' : '', contentMatch ? 'content' : ''].filter(Boolean)
  };
}

async function loadDisplayedPosts() {
  const [source, o9Snapshot] = await Promise.all([
    readFile(COMPANIES_PATH, 'utf8'),
    readFile(O9_PATH, 'utf8').then(JSON.parse)
  ]);
  const context = { O9_POSTS: o9Snapshot.posts };
  const loadOrganizations = new Function('globalThis', `${source}\nreturn globalThis.COMPANY_DIRECTORY;`);
  const organizations = loadOrganizations(context);
  return organizations.flatMap((organization) => {
    const posts = organization.posts?.length
      ? organization.posts
      : organization.postUrl && organization.postTitle
        ? [{ title: organization.postTitle, date: organization.postDate, url: organization.postUrl }]
        : [];
    return posts.map((post) => ({ ...post, organization: organization.name }));
  });
}

async function fetchArticle(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'NeSyAtlasKeywordAudit/1.0' },
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (/application\/pdf/i.test(contentType) || /\.pdf(?:$|[?#])/i.test(response.url)) {
    return { content: '', status: 'pdf-title-only' };
  }
  return { content: extractArticleText(await response.text()), status: 'fetched' };
}

async function workerPool(items, concurrency, task) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function auditPost(post) {
  const titleOnly = classifyPost(post.title, '');
  if (typeof post.neurosymbolicMatch === 'boolean') {
    const match = post.neurosymbolicMatch || titleOnly.match;
    return {
      organization: post.organization,
      title: post.title,
      url: post.url,
      match,
      matchedIn: titleOnly.match ? ['title'] : match ? ['content'] : [],
      status: 'source-content'
    };
  }

  try {
    const page = await fetchArticle(post.url);
    const classification = classifyPost(post.title, page.content);
    return { organization: post.organization, title: post.title, url: post.url, ...classification, status: page.status };
  } catch (error) {
    return {
      organization: post.organization,
      title: post.title,
      url: post.url,
      ...titleOnly,
      status: `unavailable: ${error.message}`
    };
  }
}

function browserScript(snapshot) {
  const matches = Object.fromEntries(snapshot.records.filter((record) => record.match).map((record) => [record.url, true]));
  return `// Generated by scripts/update-blog-keyword-matches.mjs. Do not edit manually.\n`
    + `globalThis.BLOG_NEUROSYMBOLIC_MATCHES_META = ${JSON.stringify(snapshot.counts, null, 2)};\n`
    + `globalThis.BLOG_NEUROSYMBOLIC_MATCHES = ${JSON.stringify(matches, null, 2)};\n`;
}

async function main() {
  const concurrency = optionNumber('--concurrency', DEFAULT_CONCURRENCY);
  const posts = await loadDisplayedPosts();
  console.log(`Checking ${posts.length} displayed posts with ${concurrency} workers`);
  let completed = 0;
  const records = await workerPool(posts, concurrency, async (post) => {
    const record = await auditPost(post);
    completed += 1;
    if (completed % 50 === 0 || completed === posts.length) console.log(`[${completed}/${posts.length}]`);
    return record;
  });
  const snapshot = {
    generatedAt: new Date().toISOString(),
    keywords: ['neurosymbolic', 'neuro-symbolic', 'neuro symbolic', 'neural-symbolic', 'neural symbolic', 'NeSy'],
    counts: {
      total: records.length,
      matched: records.filter((record) => record.match).length,
      fetched: records.filter((record) => record.status === 'fetched').length,
      sourceContent: records.filter((record) => record.status === 'source-content').length,
      unavailable: records.filter((record) => record.status.startsWith('unavailable:')).length,
      pdfTitleOnly: records.filter((record) => record.status === 'pdf-title-only').length
    },
    records
  };
  await Promise.all([
    writeFile(JSON_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8'),
    writeFile(JS_PATH, browserScript(snapshot), 'utf8')
  ]);
  console.log(JSON.stringify(snapshot.counts));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
