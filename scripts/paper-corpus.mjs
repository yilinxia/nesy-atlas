#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultConfigPath = resolve(projectRoot, 'config/paper-corpus.json');
const userAgent = 'NeSy-Atlas/1.0 (https://github.com/yilinxia/nesy-comp)';
const execFileAsync = promisify(execFile);

function optionValue(name, fallback = '') {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function decodeEntities(value) {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&#039;', "'")
    .replaceAll('&amp;', '&');
}

function stripTags(value) {
  return decodeEntities(String(value).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function absoluteUrl(value, base) {
  try {
    return new URL(decodeEntities(value), base).href;
  } catch {
    return '';
  }
}

function safeKey(value) {
  return createHash('sha256').update(String(value)).digest('hex').slice(0, 24);
}

function normalizedTitle(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export async function runWorkerPool(items, concurrency, handler) {
  const workerCount = Math.max(1, Math.min(Number(concurrency) || 1, items.length || 1));
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      await handler(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
}

function createHostScheduler(hostDelayMs = {}) {
  const scheduled = new Map();
  const lastStartedAt = new Map();
  return async function schedule(url) {
    const hostname = new URL(url).hostname.toLowerCase();
    const delayMs = Number(hostDelayMs[hostname] ?? hostDelayMs.default ?? 250);
    const previous = scheduled.get(hostname) || Promise.resolve();
    const current = previous.catch(() => {}).then(async () => {
      const elapsed = Date.now() - (lastStartedAt.get(hostname) || 0);
      if (elapsed < delayMs) {
        await new Promise((resolvePromise) => setTimeout(resolvePromise, delayMs - elapsed));
      }
      lastStartedAt.set(hostname, Date.now());
    });
    scheduled.set(hostname, current);
    await current;
  };
}

function createSerializedCheckpoint(path, value) {
  let pending = null;
  let requested = false;
  return () => {
    requested = true;
    if (!pending) {
      pending = (async () => {
        while (requested) {
          requested = false;
          await writeJsonAtomic(path, value);
        }
      })().finally(() => { pending = null; });
    }
    return pending;
  };
}

function contentValue(content, key, fallback = '') {
  const value = content?.[key];
  if (value && typeof value === 'object' && 'value' in value) return value.value;
  return value ?? fallback;
}

export function matchedKeywords(value) {
  const matches = String(value).match(/\b(?:neuro[\s-]?symbolic|neural[\s-]+symbolic|nesy)\b/gi) || [];
  return [...new Set(matches.map((match) => match.toLowerCase() === 'nesy'
    ? 'NeSy'
    : match.toLowerCase().replace(/\s+/g, ' ')))];
}

function includeRecord(record, source) {
  if (source.include === 'all') return true;
  return matchedKeywords(`${record.title} ${record.abstract}`).length > 0;
}

export function openReviewNoteToRecord(note, source, venueId) {
  const content = note.content || {};
  const title = String(contentValue(content, 'title')).trim();
  const abstract = String(contentValue(content, 'abstract')).trim();
  const authors = contentValue(content, 'authors', []);
  const authorIds = contentValue(content, 'authorids', []);
  const year = Number(venueId.match(/\/(\d{4})\//)?.[1]) || 0;
  return {
    id: `openreview:${note.id}`,
    sourceId: source.id,
    sourceType: 'openreview',
    title,
    abstract,
    authors: Array.isArray(authors) ? authors : [],
    authorIds: Array.isArray(authorIds) ? authorIds : [],
    affiliations: [],
    keywords: matchedKeywords(`${title} ${abstract}`),
    categories: [],
    venue: source.venue,
    conference: source.venue,
    year,
    published: year ? `${year}-01-01` : '',
    url: `https://openreview.net/forum?id=${note.id}`,
    pdfUrl: `https://openreview.net/pdf?id=${note.id}`,
    doi: '',
    arxivId: '',
    discoveryMetadata: { venueId }
  };
}

function jsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeArxivId(value) {
  return String(value || '')
    .replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, '')
    .replace(/\.pdf$/i, '')
    .replace(/v\d+$/i, '')
    .trim();
}

export function huggingFaceRowToRecord(row, source) {
  const title = String(row.title || '').trim();
  const abstract = String(row.abstract || '').trim();
  const authors = jsonArray(row.authors_json ?? row.authors).map(String).filter(Boolean);
  const datasetKeywords = jsonArray(row.keywords_json ?? row.keywords).map(String).filter(Boolean);
  const arxivId = normalizeArxivId(row.arxiv_id);
  const paperUrl = String(row.paper_url || '').trim();
  const pdfUrl = String(row.pdf_url || '').trim()
    || (arxivId ? `https://arxiv.org/pdf/${arxivId}` : '');
  const year = Number(row.year) || 0;
  const primaryArea = String(row.primary_area || '').trim();
  return {
    id: `huggingface:${source.dataset}:${row.paper_id}`,
    sourceId: source.id,
    sourceType: 'huggingface-dataset',
    sourcePaperId: String(row.source_paper_id || ''),
    title,
    abstract,
    authors,
    authorIds: [],
    affiliations: [],
    keywords: [...new Set([
      ...datasetKeywords,
      ...matchedKeywords(`${title} ${abstract} ${primaryArea} ${datasetKeywords.join(' ')}`)
    ])],
    categories: primaryArea ? [primaryArea] : [],
    venue: String(row.conference || ''),
    conference: String(row.conference || ''),
    year,
    published: year ? `${year}-01-01` : '',
    url: paperUrl || (arxivId ? `https://arxiv.org/abs/${arxivId}` : ''),
    pdfUrl,
    downloadUrl: pdfUrl || paperUrl,
    doi: String(row.doi || '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').trim(),
    arxivId,
    primaryArea,
    paperType: String(row.type || ''),
    tldr: String(row.tldr || ''),
    award: String(row.award || ''),
    discoveryMetadata: {
      dataset: source.dataset,
      revision: source.revision,
      upstreamSource: String(row.upstream_source || ''),
      arxivIdSource: String(row.arxiv_id_source || '')
    }
  };
}

export function parseDblpTocLinks(html, indexUrl, years = []) {
  const links = [...html.matchAll(/<a\b[^>]*class=["'][^"']*toc-link[^"']*["'][^>]*href=["']([^"']+)["']/gi)]
    .map((match) => absoluteUrl(match[1], indexUrl));
  return [...new Set(links)].filter((url) => {
    if (years.length === 0) return true;
    const year = Number(url.match(/(?:19|20)\d{2}/)?.[0]);
    return years.includes(year);
  });
}

export function parseDblpToc(html, source, tocUrl) {
  const entryStarts = [...html.matchAll(/<li\b[^>]*class=["'][^"']*entry\s+inproceedings[^"']*["'][^>]*>/gi)];
  const entries = entryStarts.map((match, index) => html.slice(
    match.index,
    entryStarts[index + 1]?.index ?? html.length
  ));
  return entries.map((entry) => {
    const key = entry.match(/\bid=["']([^"']+)["']/i)?.[1] || safeKey(entry);
    const title = stripTags(entry.match(/<span\b[^>]*class=["']title["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] || '');
    const authors = [...entry.matchAll(/<span\b[^>]*itemprop=["']name["'][^>]*title=["']([^"']+)["'][^>]*>/gi)]
      .map((match) => decodeEntities(match[1]));
    const year = Number(entry.match(/itemprop=["']datePublished["'][^>]*>(\d{4})</i)?.[1])
      || Number(tocUrl.match(/(?:19|20)\d{2}/)?.[0])
      || 0;
    const externalLinks = [...entry.matchAll(/<li\b[^>]*class=["']ee["'][^>]*>[\s\S]*?<a\b[^>]*href=["']([^"']+)["']/gi)]
      .map((match) => absoluteUrl(match[1], tocUrl));
    const pdfUrl = externalLinks.find((url) => /\.pdf(?:$|[?#])/i.test(url)) || '';
    const doi = externalLinks.map((url) => url.match(/doi\.org\/(.+)$/i)?.[1] || '').find(Boolean) || '';
    const record = {
      id: `dblp:${key}`,
      sourceId: source.id,
      sourceType: 'dblp',
      title,
      abstract: '',
      authors,
      authorIds: [],
      affiliations: [],
      keywords: matchedKeywords(title),
      categories: [],
      venue: source.venue,
      conference: source.venue,
      year,
      published: year ? `${year}-01-01` : '',
      url: `https://dblp.org/rec/${key}`,
      pdfUrl,
      doi,
      arxivId: '',
      discoveryMetadata: { tocUrl, externalLinks }
    };
    return record;
  }).filter((record) => record.title && includeRecord(record, source));
}

export function parseIjcaiProceedings(html, source, page) {
  const pattern = /<div\b[^>]*id=["']paper([^"']+)["'][^>]*class=["'][^"']*paper_wrapper[^"']*["'][^>]*>\s*<div\b[^>]*class=["']title["'][^>]*>([\s\S]*?)<\/div>\s*<div\b[^>]*class=["']authors["'][^>]*>([\s\S]*?)<\/div>\s*<div\b[^>]*class=["']details["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  return [...html.matchAll(pattern)].map((match) => {
    const paperNumber = match[1];
    const title = stripTags(match[2]);
    const authors = stripTags(match[3]).split(/\s*,\s*/).filter(Boolean);
    const links = [...match[4].matchAll(/href=["']([^"']+)["']/gi)]
      .map((link) => absoluteUrl(link[1], page.url));
    const pdfUrl = links.find((url) => /\.pdf(?:$|[?#])/i.test(url)) || '';
    const url = links.find((link) => /\/proceedings\/\d{4}\/\d+\/?$/i.test(link)) || page.url;
    return {
      id: `ijcai:${page.year}:${paperNumber}`,
      sourceId: source.id,
      sourceType: 'ijcai-proceedings',
      title,
      abstract: '',
      authors,
      authorIds: [],
      affiliations: [],
      keywords: matchedKeywords(title),
      categories: [],
      venue: source.venue,
      conference: source.venue,
      year: Number(page.year),
      published: `${page.year}-01-01`,
      url,
      pdfUrl,
      downloadUrl: pdfUrl,
      doi: '',
      arxivId: '',
      qualifies: matchedKeywords(title).length > 0,
      discoveryMetadata: {
        proceedingsUrl: page.url,
        officialPaperNumber: paperNumber
      }
    };
  }).filter((record) => record.title);
}

function metaContent(html, name) {
  return decodeEntities(html.match(new RegExp(
    `<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    'i'
  ))?.[1] || '');
}

export function parseIjcaiDetail(html) {
  const abstract = stripTags(html.match(
    /<hr\s*\/?>(?:\s*)<div\b[^>]*class=["']row["'][^>]*>\s*<div\b[^>]*class=["']col-md-12["'][^>]*>([\s\S]*?)<\/div>\s*<div\b[^>]*class=["']col-md-12["'][^>]*>\s*<div\b[^>]*class=["']keywords["']/i
  )?.[1] || '');
  const authors = [...html.matchAll(/<meta\b[^>]*name=["']citation_author["'][^>]*content=["']([^"']*)["'][^>]*>/gi)]
    .map((match) => decodeEntities(match[1]).trim())
    .filter(Boolean);
  const keywords = [...html.matchAll(/<div\b[^>]*class=["']topic["'][^>]*>([\s\S]*?)<\/div>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  const published = metaContent(html, 'citation_publication_date').replaceAll('/', '-');
  return {
    title: metaContent(html, 'citation_title'),
    abstract,
    authors,
    keywords,
    doi: metaContent(html, 'citation_doi'),
    pdfUrl: metaContent(html, 'citation_pdf_url'),
    published
  };
}

function teiElements(xml, tag) {
  return xml.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi')) || [];
}

function teiAttribute(element, name) {
  return decodeEntities(element.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1] || '');
}

function teiAffiliationNames(affiliation) {
  const organizations = teiElements(affiliation, 'orgName').map((element) => ({
    name: stripTags(element),
    type: teiAttribute(element, 'type').toLowerCase()
  })).filter((organization) => organization.name);
  const institutions = organizations.filter((organization) => organization.type === 'institution');
  if (institutions.length > 0) return institutions.map((organization) => organization.name);
  const nonDepartments = organizations.filter((organization) => organization.type !== 'department');
  return (nonDepartments.length > 0 ? nonDepartments : organizations.slice(0, 1))
    .map((organization) => organization.name);
}

export function parseGrobidHeader(tei) {
  const titleElements = teiElements(tei, 'title');
  const titleElement = titleElements.find((element) => /\blevel=["']a["']/i.test(element)) || titleElements[0] || '';
  const authorElements = teiElements(tei.match(/<analytic\b[^>]*>[\s\S]*?<\/analytic>/i)?.[0] || tei, 'author');
  const authorAffiliations = authorElements.map((author) => {
    const forenames = teiElements(author, 'forename').map(stripTags);
    const surname = stripTags(teiElements(author, 'surname')[0] || '');
    return {
      name: [...forenames, surname].filter(Boolean).join(' '),
      affiliations: [...new Set(teiElements(author, 'affiliation').flatMap(teiAffiliationNames))]
    };
  }).filter((author) => author.name);
  const authors = authorAffiliations.map((author) => author.name);
  const affiliationElements = teiElements(tei, 'affiliation');
  const affiliations = affiliationElements.flatMap(teiAffiliationNames);
  const abstractElement = teiElements(tei, 'abstract')[0] || '';
  const terms = teiElements(tei, 'term').map(stripTags).filter(Boolean);
  const idElements = teiElements(tei, 'idno');
  const doi = idElements.find((element) => /\btype=["']DOI["']/i.test(element));
  return {
    title: stripTags(titleElement),
    abstract: stripTags(abstractElement),
    authors: [...new Set(authors)],
    authorAffiliations,
    affiliations: [...new Set(affiliations)],
    keywords: [...new Set(terms)],
    doi: doi ? stripTags(doi) : ''
  };
}

export function hasExtractedMetadata(metadata) {
  return Boolean(
    metadata
    && (
      metadata.title
      || metadata.abstract
      || metadata.doi
      || metadata.authors?.length
      || metadata.affiliations?.length
      || metadata.keywords?.length
    )
  );
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function writeJsonAtomic(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, path);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 120000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      headers: { 'User-Agent': userAgent, ...(options.headers || {}) },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function cacheSourceFile(source, config) {
  if (source.path) return resolve(projectRoot, source.path);
  const sourceDirectory = resolve(projectRoot, config.workDirectory, 'sources');
  const filename = `${source.id}-${source.revision || 'latest'}.parquet`.replace(/[^a-z0-9._-]+/gi, '-');
  const destination = resolve(sourceDirectory, filename);
  if (await isExistingFile(destination)) return destination;
  await mkdir(sourceDirectory, { recursive: true });
  const temporary = `${destination}.tmp`;
  console.log(`  caching ${source.dataset} metadata…`);
  const response = await fetchWithTimeout(source.url, {}, 600000);
  if (!response.ok || !response.body) {
    throw new Error(`Hugging Face dataset HTTP ${response.status}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary));
  await rename(temporary, destination);
  return destination;
}

async function discoverHuggingFaceParquet(source, config) {
  const parquetPath = await cacheSourceFile(source, config);
  const venues = (source.venues || []).map(sqlString).join(', ');
  const years = (source.years || []).map((year) => Number(year)).filter(Boolean).join(', ');
  const clauses = [];
  if (venues) clauses.push(`conference IN (${venues})`);
  if (years) clauses.push(`year IN (${years})`);
  if (source.include !== 'all') {
    clauses.push(`regexp_matches(
      lower(concat_ws(' ', title, abstract, primary_area, array_to_string(keywords, ' '))),
      '(neuro[ -]?symbolic|neural[ -]+symbolic|(^|[^a-z])nesy([^a-z]|$))'
    )`);
  }
  const query = `
    SELECT
      paper_id, conference, year, source_paper_id, source AS upstream_source,
      title, to_json(authors) AS authors_json, abstract, paper_url, pdf_url,
      doi, arxiv_id, arxiv_id_source, type, primary_area,
      to_json(keywords) AS keywords_json, tldr, award
    FROM read_parquet(${sqlString(parquetPath)})
    ${clauses.length ? `WHERE ${clauses.join('\n      AND ')}` : ''}
    ORDER BY year DESC, conference, title
  `;
  let stdout;
  try {
    ({ stdout } = await execFileAsync('duckdb', ['-json', '-c', query], {
      maxBuffer: 256 * 1024 * 1024
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('DuckDB is required to read the Hugging Face Parquet source. Install the duckdb CLI and retry.');
    }
    throw new Error(`DuckDB dataset query failed: ${error.stderr || error.message}`);
  }
  const rows = stdout.trim() ? JSON.parse(stdout) : [];
  return rows.map((row) => huggingFaceRowToRecord(row, source)).filter((record) => record.title);
}

async function discoverArxiv(source) {
  const snapshotPath = resolve(projectRoot, source.path);
  await import(`${pathToFileURL(snapshotPath).href}?updated=${Date.now()}`);
  return (globalThis.ARXIV_PAPERS || []).filter((paper) => (
    !source.years?.length || source.years.includes(Number(paper.published?.slice(0, 4)))
  )).map((paper) => ({
    ...paper,
    sourceId: source.id,
    sourceType: 'arxiv',
    venue: source.venue,
    conference: '',
    year: Number(paper.published?.slice(0, 4)) || 0,
    authorIds: [],
    authorAffiliations: paper.authorAffiliations || (
      paper.authors?.length === 1 && paper.affiliations?.length
        ? [{ name: paper.authors[0], affiliations: paper.affiliations }]
        : []
    ),
    doi: paper.doi || '',
    arxivId: paper.id,
    keywords: [...new Set([...(paper.matches?.title || []), ...(paper.matches?.abstract || [])])],
    discoveryMetadata: { categories: paper.categories || [] }
  }));
}

async function discoverOpenReview(source) {
  const records = [];
  const token = process.env.OPENREVIEW_TOKEN;
  for (const venueId of source.venueIds || []) {
    let offset = 0;
    while (true) {
      const params = new URLSearchParams({ 'content.venueid': venueId, limit: '1000', offset: String(offset) });
      const response = await fetchWithTimeout(`https://api2.openreview.net/notes?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error(`OpenReview ${venueId}: HTTP ${response.status}`);
      const payload = await response.json();
      const notes = payload.notes || [];
      records.push(...notes.map((note) => openReviewNoteToRecord(note, source, venueId))
        .filter((record) => record.title && includeRecord(record, source)));
      if (notes.length < 1000) break;
      offset += notes.length;
    }
  }
  return records;
}

async function discoverDblp(source) {
  const indexResponse = await fetchWithTimeout(source.url);
  if (!indexResponse.ok) throw new Error(`DBLP index HTTP ${indexResponse.status}`);
  const tocLinks = parseDblpTocLinks(await indexResponse.text(), source.url, source.years || []);
  const records = [];
  for (const [index, tocUrl] of tocLinks.entries()) {
    const response = await fetchWithTimeout(tocUrl);
    if (!response.ok) {
      console.warn(`  DBLP TOC ${tocUrl}: HTTP ${response.status}`);
      continue;
    }
    records.push(...parseDblpToc(await response.text(), source, tocUrl));
    console.log(`  ${source.id}: TOC ${index + 1}/${tocLinks.length}`);
  }
  return records;
}

async function cachedText(url, cachePath, schedule) {
  if (await isExistingFile(cachePath)) return readFile(cachePath, 'utf8');
  if (schedule) await schedule(url);
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  await writeFile(cachePath, html, 'utf8');
  return html;
}

async function discoverIjcaiProceedings(source, config, knownRecords = []) {
  const records = [];
  const sourceDirectory = resolve(projectRoot, config.workDirectory, 'sources');
  const knownTitles = new Set(knownRecords.map((record) => normalizedTitle(record.title)));
  const schedule = createHostScheduler(config.hostDelayMs);
  await mkdir(sourceDirectory, { recursive: true });
  for (const page of source.pages || []) {
    const cachePath = resolve(sourceDirectory, `ijcai-${page.year}.html`);
    const html = await cachedText(page.url, cachePath, schedule);
    const pageRecords = parseIjcaiProceedings(html, source, page);
    const detailCandidates = pageRecords.filter((record) => (
      record.qualifies || knownTitles.has(normalizedTitle(record.title))
    ));
    await runWorkerPool(detailCandidates, 4, async (record) => {
      try {
        const detailPath = resolve(sourceDirectory, `ijcai-${page.year}-${record.discoveryMetadata.officialPaperNumber}.html`);
        const detail = parseIjcaiDetail(await cachedText(record.url, detailPath, schedule));
        record.title = detail.title || record.title;
        record.abstract = detail.abstract || record.abstract;
        record.authors = detail.authors.length ? detail.authors : record.authors;
        record.keywords = [...new Set([
          ...record.keywords,
          ...detail.keywords,
          ...matchedKeywords(`${record.title} ${detail.abstract}`)
        ])];
        record.doi = detail.doi || record.doi;
        record.pdfUrl = detail.pdfUrl || record.pdfUrl;
        record.downloadUrl = record.pdfUrl;
        record.published = detail.published || record.published;
        record.qualifies = record.qualifies || matchedKeywords(detail.abstract).length > 0;
        record.discoveryMetadata.abstractSource = record.url;
      } catch (error) {
        console.warn(`  IJCAI detail ${record.url}: ${error.message}`);
      }
    });
    records.push(...pageRecords);
    console.log(`  ${source.id}: ${page.year} ${pageRecords.length} official papers, ${detailCandidates.length} details`);
  }
  return records;
}

function titleTokens(value) {
  return normalizedTitle(value).split(' ').filter((token) => token.length > 1);
}

export function titleSimilarity(left, right) {
  const leftTokens = titleTokens(left);
  const rightTokens = titleTokens(right);
  if (!leftTokens.length || !rightTokens.length) return 0;
  const remaining = [...rightTokens];
  let overlap = 0;
  leftTokens.forEach((token) => {
    const index = remaining.indexOf(token);
    if (index < 0) return;
    overlap += 1;
    remaining.splice(index, 1);
  });
  return (2 * overlap) / (leftTokens.length + rightTokens.length);
}

function authorSurnames(authors = []) {
  return new Set(authors.map((author) => normalizedTitle(author).split(' ').at(-1)).filter(Boolean));
}

export function sameWorkCandidate(paper, candidate) {
  const leftTitle = normalizedTitle(paper.title);
  const rightTitle = normalizedTitle(candidate.title);
  if (!leftTitle || !rightTitle) return false;
  const paperYear = Number(paper.year) || Number(paper.published?.slice(0, 4));
  const candidateYear = Number(candidate.year) || Number(candidate.published?.slice(0, 4));
  if (paperYear && candidateYear && Math.abs(paperYear - candidateYear) > 2) return false;
  if (leftTitle === rightTitle) return true;
  if (titleSimilarity(leftTitle, rightTitle) < 0.9) return false;
  const candidateSurnames = authorSurnames(candidate.authors);
  return [...authorSurnames(paper.authors)].some((surname) => candidateSurnames.has(surname));
}

function parseArxivAtomEntries(xml) {
  return (xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || []).map((entry) => {
    const idUrl = stripTags(entry.match(/<id\b[^>]*>([\s\S]*?)<\/id>/i)?.[1] || '');
    const arxivId = normalizeArxivId(idUrl);
    const published = stripTags(entry.match(/<published\b[^>]*>([\s\S]*?)<\/published>/i)?.[1] || '').slice(0, 10);
    return {
      id: arxivId,
      arxivId,
      title: stripTags(entry.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''),
      authors: [...entry.matchAll(/<author\b[\s\S]*?<name\b[^>]*>([\s\S]*?)<\/name>[\s\S]*?<\/author>/gi)]
        .map((match) => stripTags(match[1])),
      year: Number(published.slice(0, 4)) || 0,
      published,
      url: arxivId ? `https://arxiv.org/abs/${arxivId}` : '',
      pdfUrl: arxivId ? `https://arxiv.org/pdf/${arxivId}` : ''
    };
  }).filter((entry) => entry.arxivId && entry.title);
}

async function searchArxivForPaper(paper, schedule) {
  const endpoint = new URL('https://export.arxiv.org/api/query');
  const safeTitle = paper.title.replace(/["\\]/g, ' ').replace(/\s+/g, ' ').trim();
  endpoint.searchParams.set('search_query', `ti:"${safeTitle}"`);
  endpoint.searchParams.set('start', '0');
  endpoint.searchParams.set('max_results', '5');
  await schedule(endpoint.href);
  const response = await fetchWithTimeout(endpoint.href);
  if (!response.ok) throw new Error(`arXiv search HTTP ${response.status}`);
  return parseArxivAtomEntries(await response.text()).find((candidate) => sameWorkCandidate(paper, candidate));
}

function applyArxivResolution(paper, candidate, method) {
  paper.arxivId = candidate.arxivId;
  paper.pdfUrl = candidate.pdfUrl;
  paper.downloadUrl = candidate.pdfUrl;
  paper.resolutionStatus = 'arxiv-match';
  paper.resolutionMethod = method;
  paper.resolvedArxivUrl = candidate.url;
  paper.downloadStatus = 'pending';
  paper.downloadError = '';
}

function markLinkOnly(paper) {
  paper.resolutionStatus = paper.doi ? 'doi-only' : 'metadata-only';
  const target = paper.downloadUrl || paper.pdfUrl || '';
  let hostname = '';
  try { hostname = new URL(target).hostname; } catch {}
  if (paper.downloadStatus === 'error' || hostname === 'openreview.net' || /^https?:\/\/(?:dx\.)?doi\.org\//i.test(target)) {
    paper.pdfUrl = '';
    paper.downloadUrl = '';
  }
}

async function resolvePaperLinks(config, manifestPath, limit, concurrency, localOnly = false) {
  const manifest = await readJson(manifestPath, null);
  if (!manifest) throw new Error('Run discover before resolve.');
  const arxivSource = config.sources.find((source) => source.type === 'arxiv-snapshot');
  const localArxiv = arxivSource ? await discoverArxiv({ ...arxivSource, years: [] }) : [];
  const candidates = manifest.papers.filter((paper) => {
    if (paper.downloadStatus === 'downloaded') return false;
    const target = paper.downloadUrl || paper.pdfUrl || '';
    const targetHost = (() => {
      try { return new URL(target).hostname; } catch { return ''; }
    })();
    return paper.downloadStatus === 'error' || !paper.arxivId && (!target || targetHost === 'openreview.net');
  }).slice(0, limit);
  const schedule = createHostScheduler(config.hostDelayMs);
  const checkpoint = createSerializedCheckpoint(manifestPath, manifest);
  console.log(`Resolving ${candidates.length} unavailable paper links with ${concurrency} workers`);
  await runWorkerPool(candidates, concurrency, async (paper, index) => {
    if (/^https?:\/\/(?:dx\.)?doi\.org\//i.test(paper.pdfUrl || '')) {
      paper.pdfUrl = '';
      paper.downloadUrl = '';
    }
    const localMatch = localArxiv.find((candidate) => (
      candidate.arxivId !== paper.arxivId && sameWorkCandidate(paper, candidate)
    ));
    if (localMatch) {
      applyArxivResolution(paper, localMatch, 'local-title-author-match');
      console.log(`[${index + 1}/${candidates.length}] ${paper.id}: arXiv ${localMatch.arxivId} (local)`);
      await checkpoint();
      return;
    }
    if (localOnly) {
      markLinkOnly(paper);
      console.log(`[${index + 1}/${candidates.length}] ${paper.id}: ${paper.resolutionStatus}`);
      await checkpoint();
      return;
    }
    try {
      const remoteMatch = await searchArxivForPaper(paper, schedule);
      if (remoteMatch) {
        applyArxivResolution(paper, remoteMatch, 'arxiv-api-title-author-match');
        console.log(`[${index + 1}/${candidates.length}] ${paper.id}: arXiv ${remoteMatch.arxivId}`);
      } else {
        markLinkOnly(paper);
        console.log(`[${index + 1}/${candidates.length}] ${paper.id}: ${paper.resolutionStatus}`);
      }
    } catch (error) {
      markLinkOnly(paper);
      paper.resolutionError = error.message;
      console.warn(`[${index + 1}/${candidates.length}] ${paper.id}: ${error.message}`);
    }
    await checkpoint();
  });
}

function mergeAuthorAffiliations(...groups) {
  const merged = new Map();
  groups.flat().forEach((author) => {
    if (!author?.name) return;
    const key = normalizedTitle(author.name);
    const existing = merged.get(key) || { name: author.name, affiliations: [] };
    existing.affiliations = [...new Set([
      ...existing.affiliations,
      ...(author.affiliations || [])
    ])];
    merged.set(key, existing);
  });
  return [...merged.values()];
}

export function dedupeRecords(records) {
  const seen = new Map();
  records.forEach((record) => {
    const titleKey = normalizedTitle(record.title);
    const key = titleKey
      ? `title:${titleKey}`
      : record.doi ? `doi:${record.doi.toLowerCase()}` : `arxiv:${record.arxivId}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, record);
      return;
    }
    const recordIsPublishedVenue = Boolean(
      record.conference
      && record.venue !== 'arXiv'
      && ['huggingface-dataset', 'ijcai-proceedings', 'openreview'].includes(record.sourceType)
    );
    seen.set(key, {
      ...record,
      ...existing,
      abstract: existing.abstract || record.abstract,
      authors: existing.authors.length >= record.authors.length ? existing.authors : record.authors,
      authorAffiliations: mergeAuthorAffiliations(
        existing.authorAffiliations || [],
        record.authorAffiliations || []
      ),
      affiliations: [...new Set([...existing.affiliations, ...record.affiliations])],
      categories: [...new Set([...(existing.categories || []), ...(record.categories || [])])],
      keywords: [...new Set([...(existing.keywords || []), ...(record.keywords || [])])],
      qualifies: existing.qualifies !== false || record.qualifies !== false,
      venue: recordIsPublishedVenue ? record.venue : existing.venue === 'arXiv' && record.venue ? record.venue : existing.venue,
      conference: recordIsPublishedVenue
        ? record.conference || record.venue
        : existing.conference || record.conference || (record.venue !== 'arXiv' ? record.venue : ''),
      year: recordIsPublishedVenue ? record.year : existing.year || record.year,
      published: recordIsPublishedVenue ? record.published : existing.published || record.published,
      url: recordIsPublishedVenue ? record.url : existing.url || record.url,
      pdfUrl: recordIsPublishedVenue && record.pdfUrl ? record.pdfUrl : existing.pdfUrl || record.pdfUrl,
      downloadUrl: recordIsPublishedVenue && (record.downloadUrl || record.pdfUrl)
        ? record.downloadUrl || record.pdfUrl
        : existing.downloadUrl || existing.pdfUrl || record.downloadUrl || record.pdfUrl,
      doi: recordIsPublishedVenue && record.doi ? record.doi : existing.doi || record.doi,
      arxivId: existing.arxivId || record.arxivId,
      discoveryMetadata: {
        ...(record.discoveryMetadata || {}),
        ...(existing.discoveryMetadata || {})
      },
      sourceIds: [...new Set([
        ...(existing.sourceIds || [existing.sourceId]),
        ...(record.sourceIds || [record.sourceId])
      ])]
    });
  });
  return [...seen.values()];
}

async function discover(config, manifestPath) {
  const records = [];
  const sourceStatus = [];
  const previous = await readJson(manifestPath, { papers: [] });
  for (const source of config.sources) {
    console.log(`Discovering ${source.id}…`);
    try {
      const discovered = source.type === 'arxiv-snapshot'
        ? await discoverArxiv(source)
        : source.type === 'openreview'
          ? await discoverOpenReview(source)
          : source.type === 'dblp-index'
            ? await discoverDblp(source)
            : source.type === 'huggingface-parquet'
              ? await discoverHuggingFaceParquet(source, config)
              : source.type === 'ijcai-proceedings'
                ? await discoverIjcaiProceedings(source, config, records)
              : [];
      records.push(...discovered);
      sourceStatus.push({
        id: source.id,
        type: source.type,
        dataset: source.dataset || '',
        revision: source.revision || '',
        license: source.license ?? 'unspecified',
        status: 'ok',
        count: discovered.length
      });
      console.log(`  ${discovered.length} papers`);
    } catch (error) {
      const retained = previous.papers.filter((paper) => (
        paper.sourceId === source.id || paper.sourceIds?.includes(source.id)
      ));
      records.push(...retained);
      sourceStatus.push({
        id: source.id,
        type: source.type,
        dataset: source.dataset || '',
        revision: source.revision || '',
        license: source.license ?? 'unspecified',
        status: 'error',
        retainedCount: retained.length,
        error: error.message
      });
      console.warn(`  ${error.message}; retained ${retained.length} previous records`);
    }
  }
  const deduped = dedupeRecords(records).filter((paper) => paper.qualifies !== false).map((paper) => {
    const year = Number(paper.year)
      || Number(paper.published?.slice(0, 4))
      || Number(paper.discoveryMetadata?.tocUrl?.match(/(?:19|20)\d{2}/)?.[0])
      || 0;
    return { ...paper, year, published: paper.published || (year ? `${year}-01-01` : '') };
  }).filter((paper) => {
    const year = Number(paper.year);
    if (!config.yearRange) return true;
    if (!year) return false;
    return year >= config.yearRange.from && year <= config.yearRange.to;
  });
  const previousById = new Map(previous.papers.map((paper) => [paper.id, paper]));
  const papers = deduped.map((paper) => ({ ...previousById.get(paper.id), ...paper }));
  const manifest = {
    schemaVersion: 1,
    discoveredAt: new Date().toISOString(),
    sourceStatus,
    papers
  };
  await writeJsonAtomic(manifestPath, manifest);
  console.log(`Manifest contains ${papers.length} unique papers`);
}

async function isExistingFile(path) {
  try {
    return (await stat(path)).size > 4;
  } catch {
    return false;
  }
}

async function fetchPdf(url, schedule) {
  await schedule(url);
  const first = await fetchWithTimeout(url);
  if (!first.ok) throw new Error(`HTTP ${first.status}`);
  const contentType = first.headers.get('content-type') || '';
  const body = await first.arrayBuffer();
  if (contentType.includes('pdf') || Buffer.from(body).subarray(0, 4).toString() === '%PDF') {
    return { body, pdfUrl: first.url || url };
  }
  const html = Buffer.from(body).toString('utf8');
  const pdfLink = [...html.matchAll(/href=["']([^"']+\.pdf(?:[?#][^"']*)?)["']/gi)]
    .map((match) => absoluteUrl(match[1], first.url || url))[0];
  if (!pdfLink) throw new Error('No PDF link found on landing page');
  await schedule(pdfLink);
  const pdfResponse = await fetchWithTimeout(pdfLink);
  if (!pdfResponse.ok) throw new Error(`PDF HTTP ${pdfResponse.status}`);
  const pdf = await pdfResponse.arrayBuffer();
  if (Buffer.from(pdf).subarray(0, 4).toString() !== '%PDF') throw new Error('Downloaded content is not a PDF');
  return { body: pdf, pdfUrl: pdfResponse.url || pdfLink };
}

export function selectDownloadCandidates(papers, retryErrors = false, limit = Infinity) {
  return papers
    .filter((paper) => (paper.downloadUrl || paper.pdfUrl) && paper.downloadStatus !== 'downloaded')
    .filter((paper) => retryErrors || paper.downloadStatus !== 'error')
    .sort((left, right) => Number(left.downloadStatus === 'error') - Number(right.downloadStatus === 'error'))
    .slice(0, limit);
}

async function download(config, manifestPath, limit, concurrency, retryErrors) {
  const manifest = await readJson(manifestPath, null);
  if (!manifest) throw new Error('Run discover before download.');
  const pdfDirectory = resolve(projectRoot, config.workDirectory, 'pdfs');
  await mkdir(pdfDirectory, { recursive: true });
  const candidates = selectDownloadCandidates(manifest.papers, retryErrors, limit);
  const knownErrors = manifest.papers.filter((paper) => (
    (paper.downloadUrl || paper.pdfUrl)
    && paper.downloadStatus === 'error'
  )).length;
  const schedule = createHostScheduler(config.hostDelayMs);
  const checkpoint = createSerializedCheckpoint(manifestPath, manifest);
  console.log(`Downloading ${candidates.length} papers with ${concurrency} workers`);
  if (!retryErrors && knownErrors) {
    console.log(`Skipping ${knownErrors} previous failures (use --retry-errors to try them again)`);
  }
  await runWorkerPool(candidates, concurrency, async (paper, index) => {
    const filename = `${safeKey(paper.id)}.pdf`;
    const path = resolve(pdfDirectory, filename);
    try {
      if (!(await isExistingFile(path))) {
        const downloaded = await fetchPdf(paper.downloadUrl || paper.pdfUrl, schedule);
        await writeFile(path, Buffer.from(downloaded.body));
        paper.pdfUrl = downloaded.pdfUrl;
      }
      paper.pdfPath = `${config.workDirectory}/pdfs/${filename}`;
      paper.downloadStatus = 'downloaded';
      paper.downloadError = '';
      console.log(`[${index + 1}/${candidates.length}] ${paper.id}`);
    } catch (error) {
      paper.downloadStatus = 'error';
      paper.downloadError = error.message;
      console.warn(`[${index + 1}/${candidates.length}] ${paper.id}: ${error.message}`);
    }
    await checkpoint();
  });
}

async function extract(config, manifestPath, limit, concurrency) {
  const manifest = await readJson(manifestPath, null);
  if (!manifest) throw new Error('Run discover and download before extract.');
  const extractedDirectory = resolve(projectRoot, config.workDirectory, 'extracted');
  await mkdir(extractedDirectory, { recursive: true });
  const candidates = [];
  for (const paper of manifest.papers) {
    if (paper.downloadStatus !== 'downloaded') continue;
    const cached = paper.extractedPath
      ? await readJson(resolve(projectRoot, paper.extractedPath), null)
      : null;
    if (paper.extractStatus !== 'extracted' || !hasExtractedMetadata(cached)) candidates.push(paper);
    if (candidates.length >= limit) break;
  }
  const checkpoint = createSerializedCheckpoint(manifestPath, manifest);
  console.log(`Extracting ${candidates.length} papers with ${concurrency} GROBID workers`);
  await runWorkerPool(candidates, concurrency, async (paper, index) => {
    try {
      const pdf = await readFile(resolve(projectRoot, paper.pdfPath));
      const form = new FormData();
      form.append('input', new Blob([pdf], { type: 'application/pdf' }), `${safeKey(paper.id)}.pdf`);
      form.append('consolidateHeader', '0');
      form.append('includeRawAffiliations', '1');
      const response = await fetchWithTimeout(`${config.grobidUrl.replace(/\/$/, '')}/api/processHeaderDocument`, {
        method: 'POST',
        headers: { Accept: 'application/xml' },
        body: form
      });
      if (!response.ok) throw new Error(`GROBID HTTP ${response.status}`);
      const responseBody = await response.text();
      if (!/<TEI\b/i.test(responseBody)) {
        throw new Error('GROBID returned a non-TEI response; expected application/xml');
      }
      const metadata = parseGrobidHeader(responseBody);
      if (!hasExtractedMetadata(metadata)) throw new Error('GROBID returned empty header metadata');
      const extractionPath = resolve(extractedDirectory, `${safeKey(paper.id)}.json`);
      await writeJsonAtomic(extractionPath, metadata);
      paper.extractedPath = `${config.workDirectory}/extracted/${safeKey(paper.id)}.json`;
      paper.extractStatus = 'extracted';
      paper.extractError = '';
      console.log(`[${index + 1}/${candidates.length}] ${paper.id}`);
    } catch (error) {
      paper.extractStatus = 'error';
      paper.extractError = error.message;
      console.warn(`[${index + 1}/${candidates.length}] ${paper.id}: ${error.message}`);
    }
    await checkpoint();
  });
}

export function completePaper(record, extracted) {
  const title = extracted?.title || record.title || '';
  const abstract = record.abstract || extracted?.abstract || '';
  const authors = extracted?.authors?.length ? extracted.authors : record.authors || [];
  const authorAffiliations = extracted?.authorAffiliations?.length
    ? extracted.authorAffiliations
    : record.authorAffiliations || [];
  const affiliations = extracted?.affiliations?.length ? extracted.affiliations : record.affiliations || [];
  const keywords = extracted?.keywords?.length
    ? [...new Set(extracted.keywords)]
    : [...new Set(record.keywords || [])];
  return {
    id: record.id,
    title,
    abstract,
    authors,
    authorAffiliations,
    authorIds: record.authorIds || [],
    affiliations,
    keywords,
    categories: record.categories || record.discoveryMetadata?.categories || [],
    venue: record.venue || '',
    conference: record.conference || (record.venue && record.venue !== 'arXiv' ? record.venue : ''),
    year: record.year || Number(record.published?.slice(0, 4)) || 0,
    published: record.published || '',
    url: record.url || '',
    pdfUrl: record.pdfUrl || '',
    doi: extracted?.doi || record.doi || '',
    doiUrl: (extracted?.doi || record.doi)
      ? `https://doi.org/${extracted?.doi || record.doi}`
      : '',
    arxivId: record.arxivId || '',
    primaryArea: record.primaryArea || '',
    paperType: record.paperType || '',
    tldr: record.tldr || '',
    award: record.award || '',
    sourceType: record.sourceType,
    sourceIds: record.sourceIds || [record.sourceId],
    resolutionStatus: record.resolutionStatus || (record.pdfUrl ? 'source-pdf' : record.doi ? 'doi-only' : 'metadata-only'),
    resolutionMethod: record.resolutionMethod || '',
    resolvedArxivUrl: record.resolvedArxivUrl || '',
    metadataComplete: Boolean(title && abstract && authors.length && affiliations.length && record.venue && record.pdfUrl),
    extractionStatus: record.extractStatus || 'not-extracted'
  };
}

function normalizedEntityText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

export function normalizedInstitutionName(value) {
  return normalizedEntityText(value)
    .replace(/\buniv\b/g, 'university')
    .replace(/\binst\b/g, 'institute')
    .replace(/\btech\b/g, 'technology')
    .replace(/\bctr\b/g, 'center')
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizedAuthorName(value) {
  const name = String(value || '').trim();
  const commaParts = name.split(',').map((part) => part.trim()).filter(Boolean);
  const ordered = commaParts.length === 2 ? `${commaParts[1]} ${commaParts[0]}` : name;
  return normalizedEntityText(ordered);
}

function institutionAcronym(value) {
  const ignored = new Set(['and', 'of', 'the', 'for', 'at', 'in']);
  return normalizedInstitutionName(value).split(' ')
    .filter((token) => token && !ignored.has(token))
    .map((token) => token[0])
    .join('');
}

function isInitialism(value) {
  const letters = String(value || '').replace(/[^A-Za-z]/g, '');
  return letters.length >= 2 && letters.length <= 10 && letters === letters.toUpperCase();
}

function stableEntityId(type, key) {
  return `${type}:${createHash('sha256').update(key).digest('hex').slice(0, 16)}`;
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function preferredAlias(counts, preferExpanded = false) {
  return [...counts.entries()].sort(([left, leftCount], [right, rightCount]) => {
    if (preferExpanded && isInitialism(left) !== isInitialism(right)) return isInitialism(left) ? 1 : -1;
    if (left.includes(',') !== right.includes(',')) return left.includes(',') ? 1 : -1;
    if (rightCount !== leftCount) return rightCount - leftCount;
    if (right.length !== left.length) return right.length - left.length;
    return left.localeCompare(right);
  })[0]?.[0] || '';
}

function addAlias(groups, key, rawValue) {
  if (!key || !rawValue) return;
  const group = groups.get(key) || { key, aliases: new Map() };
  group.aliases.set(rawValue, (group.aliases.get(rawValue) || 0) + 1);
  groups.set(key, group);
}

function buildInstitutionEntities(papers) {
  const groups = new Map();
  papers.forEach((paper) => {
    const values = [
      ...(paper.affiliations || []),
      ...(paper.authorAffiliations || []).flatMap((author) => author.affiliations || [])
    ];
    uniqueStrings(values).forEach((raw) => addAlias(groups, normalizedInstitutionName(raw), raw));
  });

  const longCandidates = new Map();
  groups.forEach((group, key) => {
    if ([...group.aliases.keys()].every(isInitialism) || key.split(' ').length < 2) return;
    const acronym = institutionAcronym(key);
    if (acronym.length < 2) return;
    const candidates = longCandidates.get(acronym) || new Set();
    candidates.add(key);
    longCandidates.set(acronym, candidates);
  });

  const roots = new Map([...groups.keys()].map((key) => [key, key]));
  groups.forEach((group, key) => {
    if (![...group.aliases.keys()].every(isInitialism)) return;
    const acronym = [...group.aliases.keys()][0].replace(/[^A-Za-z]/g, '').toLowerCase();
    const candidates = longCandidates.get(acronym);
    if (candidates?.size === 1) roots.set(key, [...candidates][0]);
  });

  const merged = new Map();
  groups.forEach((group, key) => {
    const root = roots.get(key) || key;
    const target = merged.get(root) || { key: root, aliases: new Map() };
    group.aliases.forEach((count, alias) => target.aliases.set(alias, (target.aliases.get(alias) || 0) + count));
    merged.set(root, target);
  });

  const byKey = new Map();
  const entities = [...merged.values()].map((group) => {
    const name = preferredAlias(group.aliases, true);
    const entity = {
      id: stableEntityId('institution', group.key),
      name,
      aliases: [...group.aliases.keys()].sort(),
      paperCount: 0
    };
    byKey.set(group.key, entity);
    return entity;
  });
  roots.forEach((root, key) => byKey.set(key, byKey.get(root)));
  return { entities, byKey };
}

function buildAuthorEntities(papers) {
  const groups = new Map();
  papers.forEach((paper) => {
    uniqueStrings([
      ...(paper.authors || []),
      ...(paper.authorAffiliations || []).map((author) => author.name)
    ]).forEach((raw) => addAlias(groups, normalizedAuthorName(raw), raw));
  });
  const byKey = new Map();
  const entities = [...groups.values()].map((group) => {
    const entity = {
      id: stableEntityId('author', group.key),
      name: preferredAlias(group.aliases),
      aliases: [...group.aliases.keys()].sort(),
      paperCount: 0,
      institutionIds: []
    };
    byKey.set(group.key, entity);
    return entity;
  });
  return { entities, byKey };
}

export function resolveCorpusEntities(inputPapers) {
  const papers = inputPapers.map((paper) => ({
    ...paper,
    authorAffiliations: (paper.authorAffiliations || []).map((author) => ({
      ...author,
      affiliations: [...(author.affiliations || [])]
    }))
  }));
  const institutions = buildInstitutionEntities(papers);
  const authors = buildAuthorEntities(papers);
  const institutionPaperIds = new Map();
  const authorPaperIds = new Map();
  const authorInstitutionIds = new Map();

  papers.forEach((paper) => {
    const paperIdentity = paper.doi
      ? `doi:${paper.doi.toLowerCase()}`
      : paper.arxivId ? `arxiv:${paper.arxivId.toLowerCase()}` : `title:${normalizedTitle(paper.title)}`;
    paper.entityId = stableEntityId('paper', paperIdentity);

    paper.rawAffiliations = uniqueStrings(paper.affiliations || []);
    const paperInstitutions = paper.rawAffiliations.map((raw) => (
      institutions.byKey.get(normalizedInstitutionName(raw))
    )).filter(Boolean);
    paper.affiliations = uniqueStrings(paperInstitutions.map((entity) => entity.name));
    paper.affiliationEntityIds = [...new Set(paperInstitutions.map((entity) => entity.id))];
    paper.affiliationEntityIds.forEach((id) => {
      const ids = institutionPaperIds.get(id) || new Set();
      ids.add(paper.entityId);
      institutionPaperIds.set(id, ids);
    });

    paper.rawAuthors = uniqueStrings(paper.authors || []);
    const paperAuthors = paper.rawAuthors.map((raw) => authors.byKey.get(normalizedAuthorName(raw))).filter(Boolean);
    paper.authors = uniqueStrings(paperAuthors.map((entity) => entity.name));
    paper.authorEntityIds = [...new Set(paperAuthors.map((entity) => entity.id))];
    paper.authorEntityIds.forEach((id) => {
      const ids = authorPaperIds.get(id) || new Set();
      ids.add(paper.entityId);
      authorPaperIds.set(id, ids);
    });

    paper.rawAuthorAffiliations = paper.authorAffiliations;
    paper.authorAffiliations = paper.rawAuthorAffiliations.map((author) => {
      const authorEntity = authors.byKey.get(normalizedAuthorName(author.name));
      const affiliationEntities = uniqueStrings(author.affiliations || []).map((raw) => (
        institutions.byKey.get(normalizedInstitutionName(raw))
      )).filter(Boolean);
      const affiliationIds = [...new Set(affiliationEntities.map((entity) => entity.id))];
      if (authorEntity) {
        const ids = authorInstitutionIds.get(authorEntity.id) || new Set();
        affiliationIds.forEach((id) => ids.add(id));
        authorInstitutionIds.set(authorEntity.id, ids);
      }
      return {
        name: authorEntity?.name || author.name,
        authorEntityId: authorEntity?.id || '',
        affiliations: uniqueStrings(affiliationEntities.map((entity) => entity.name)),
        affiliationEntityIds: affiliationIds,
        rawName: author.name,
        rawAffiliations: uniqueStrings(author.affiliations || [])
      };
    });
  });

  institutions.entities.forEach((entity) => {
    entity.paperCount = institutionPaperIds.get(entity.id)?.size || 0;
  });
  authors.entities.forEach((entity) => {
    entity.paperCount = authorPaperIds.get(entity.id)?.size || 0;
    entity.institutionIds = [...(authorInstitutionIds.get(entity.id) || [])].sort();
  });

  return {
    papers,
    entities: {
      authors: authors.entities.sort((left, right) => right.paperCount - left.paperCount || left.name.localeCompare(right.name)),
      institutions: institutions.entities.sort((left, right) => right.paperCount - left.paperCount || left.name.localeCompare(right.name))
    },
    metadata: {
      version: 1,
      method: 'local-deterministic',
      authorPolicy: 'normalized exact-name aliases; ambiguous people are not fuzzily merged',
      institutionPolicy: 'normalized exact aliases plus unique unambiguous acronym expansion',
      preservesRawValues: true
    }
  };
}

async function build(config, manifestPath) {
  const manifest = await readJson(manifestPath, null);
  if (!manifest) throw new Error('Run discover before build.');
  const papers = [];
  for (const record of manifest.papers) {
    if (
      record.sourceType === 'arxiv'
      && record.downloadStatus === 'error'
      && record.resolutionStatus !== 'arxiv-match'
    ) continue;
    const extracted = record.extractedPath
      ? await readJson(resolve(projectRoot, record.extractedPath), null)
      : null;
    papers.push(completePaper(record, extracted));
  }
  const resolved = resolveCorpusEntities(papers);
  const output = {
    schemaVersion: config.schemaVersion,
    generatedAt: new Date().toISOString(),
    yearRange: config.yearRange || null,
    keywords: config.keywords || [],
    paperCount: resolved.papers.length,
    completeMetadataCount: resolved.papers.filter((paper) => paper.metadataComplete).length,
    sources: manifest.sourceStatus,
    entityResolution: resolved.metadata,
    entities: resolved.entities,
    papers: resolved.papers
  };
  const outputJsonPath = resolve(projectRoot, config.outputJson);
  const outputScriptPath = resolve(projectRoot, config.outputScript);
  await writeJsonAtomic(outputJsonPath, output);
  await writeFile(outputScriptPath, `// Generated by scripts/paper-corpus.mjs. Do not edit manually.\nglobalThis.RESEARCH_PAPER_CORPUS = ${JSON.stringify(output, null, 2)};\n`, 'utf8');
  console.log(`Built ${papers.length} website records (${output.completeMetadataCount} complete)`);
}

async function main() {
  const command = process.argv[2] || 'help';
  const configPath = resolve(optionValue('--config', defaultConfigPath));
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const manifestPath = resolve(projectRoot, config.workDirectory, 'manifest.json');
  const limit = Number(optionValue('--limit', '0')) || Infinity;
  const sharedConcurrency = Number(optionValue('--concurrency', '0')) || 0;
  const downloadConcurrency = Number(optionValue(
    '--download-concurrency',
    String(sharedConcurrency || config.downloadConcurrency || 6)
  ));
  const resolveConcurrency = Number(optionValue(
    '--resolve-concurrency',
    String(sharedConcurrency || config.resolveConcurrency || 2)
  ));
  const extractConcurrency = Number(optionValue(
    '--extract-concurrency',
    String(sharedConcurrency || config.extractConcurrency || 4)
  ));
  const retryErrors = process.argv.includes('--retry-errors');
  const localOnly = process.argv.includes('--local-only');

  if (command === 'discover') return discover(config, manifestPath);
  if (command === 'resolve') return resolvePaperLinks(config, manifestPath, limit, resolveConcurrency, localOnly);
  if (command === 'download') return download(config, manifestPath, limit, downloadConcurrency, retryErrors);
  if (command === 'extract') return extract(config, manifestPath, limit, extractConcurrency);
  if (command === 'build') return build(config, manifestPath);
  if (command === 'all') {
    await discover(config, manifestPath);
    await resolvePaperLinks(config, manifestPath, limit, resolveConcurrency, localOnly);
    await download(config, manifestPath, limit, downloadConcurrency, retryErrors);
    await extract(config, manifestPath, limit, extractConcurrency);
    return build(config, manifestPath);
  }
  console.log('Usage: node scripts/paper-corpus.mjs <discover|resolve|download|extract|build|all> [--limit N] [--concurrency N] [--resolve-concurrency N] [--download-concurrency N] [--extract-concurrency N] [--local-only] [--retry-errors] [--config path]');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
