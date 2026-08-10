#!/usr/bin/env node
// Daily blog-source checker for NeSy Atlas.
//
// Reads data/blog-sources.json (one or more listing-page URLs per company),
// fetches each source, extracts candidate post links, and diffs them against
// data/known-posts.json. It also visits each new article to recover publication
// dates omitted by listing pages. Anything new gets appended to
// data/pending-posts.json for human review — this script never edits script.js
// directly. A completed run also advances the Posts snapshot date in index.html.
//
// This is a best-effort generic link scraper, not a per-site parser: it will
// miss posts on JS-rendered pages it can't see and may occasionally surface a
// non-post link (nav item, tag page) as a false positive. Both are expected;
// review data/pending-posts.json periodically and prune/promote entries as
// needed. Add or fix listing pages in data/blog-sources.json at any time.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const INDEX_PATH = path.join(ROOT, 'index.html');
const SOURCES_PATH = path.join(DATA_DIR, 'blog-sources.json');
const KNOWN_PATH = path.join(DATA_DIR, 'known-posts.json');
const PENDING_PATH = path.join(DATA_DIR, 'pending-posts.json');

const USER_AGENT =
  'Mozilla/5.0 (compatible; NeSyAtlasBlogChecker/1.0; +https://github.com/)';
const FETCH_TIMEOUT_MS = 15000;
const REQUEST_DELAY_MS = 400;

const SKIP_EXTENSIONS = /\.(png|jpe?g|gif|svg|webp|ico|css|js|mjs|xml|json|pdf|zip|mp4|mp3)(\?|#|$)/i;
const SKIP_PATH_HINTS = /\/(tag|tags|category|categories|author|authors|page|feed|rss|search|login|signup|cart|privacy|terms|cookie)s?(\/|$|\?)/i;
const SKIP_SCHEMES = /^(mailto|tel|javascript):/i;
const CONTENT_SECTION_PREFIXES = new Set(['articles', 'blog', 'insights', 'news', 'research', 'resources']);

// Stoplist checked against the first path segment "local" to the listing page
// (i.e. immediately after its own path prefix). Catches site nav/footer links
// that happen to share the listing page's path prefix — some site templates
// emit root-relative hrefs (e.g. "blog/solutions") that, once resolved against
// a nested listing URL like /blog/, land under /blog/solutions and would
// otherwise look like a real post one level under the listing page.
const NAV_STOPLIST = new Set([
  'about', 'about-us', 'contact', 'contact-us', 'team', 'careers', 'jobs',
  'pricing', 'blog', 'blogs', 'news', 'press', 'company', 'login', 'signin',
  'signup', 'privacy', 'terms', 'cookies', 'products', 'product', 'platform',
  'solutions', 'solution', 'use-cases', 'integrations', 'events', 'webinars',
  'podcast', 'developer', 'developers', 'docs', 'documentation', 'compare',
  'case-studies', 'customers', 'partners', 'investors', 'security', 'legal',
  'sitemap', 'help', 'plans', 'membership', 'followers', 'following', 'agencies',
  'science', 'newsroom', 'resources', 'research', 'insights', 'media', 'roadmap',
  'search', 'faq', 'support', 'demo', 'signin', 'account', 'dashboard', 'status',
  'reposts', 'activity', 'lists', 'privacy-policy', 'cookies-policy',
  'cookie-policy', 'terms-of-service', 'terms-and-conditions', 'cookie-settings'
]);

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw err;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatSnapshotDate(isoDate) {
  const match = String(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error(`Invalid snapshot date: ${isoDate}`);
  const [, year, month, day] = match;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthName = monthNames[Number(month) - 1];
  if (!monthName || validIsoDate(year, month, day) !== isoDate) {
    throw new Error(`Invalid snapshot date: ${isoDate}`);
  }
  return `${monthName} ${Number(day)}, ${year}`;
}

function updateBlogSnapshotHtml(html, isoDate) {
  const marker = /(<span id="blogs-updated">)Snapshot [^<]*(<\/span>)/;
  if (!marker.test(html)) {
    throw new Error('Could not find #blogs-updated snapshot label in index.html');
  }
  return html.replace(marker, `$1Snapshot ${formatSnapshotDate(isoDate)}$2`);
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function validIsoDate(year, month, day) {
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const date = new Date(Date.UTC(numericYear, numericMonth - 1, numericDay));
  if (
    date.getUTCFullYear() !== numericYear
    || date.getUTCMonth() !== numericMonth - 1
    || date.getUTCDate() !== numericDay
  ) return '';
  return `${String(numericYear).padStart(4, '0')}-${String(numericMonth).padStart(2, '0')}-${String(numericDay).padStart(2, '0')}`;
}

function normalizePublicationDate(value) {
  const text = decodeEntities(stripTags(String(value))).trim();
  let match = text.match(/(?:^|\D)(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:\D|$)/);
  if (match) return validIsoDate(match[1], match[2], match[3]);

  match = text.match(/(?:^|\D)(\d{1,2})[/.](\d{1,2})[/.](\d{4})(?:\D|$)/);
  if (match) {
    const [, first, second, year] = match;
    // Prefer the US month/day convention when the order is ambiguous. If one
    // component exceeds 12, its role is unambiguous.
    const [month, day] = Number(first) > 12 ? [second, first] : [first, second];
    return validIsoDate(year, month, day);
  }

  const monthNumbers = {
    jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
    apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
    aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10,
    october: 10, nov: 11, november: 11, dec: 12, december: 12
  };
  const monthPattern = Object.keys(monthNumbers).join('|');
  match = text.match(new RegExp(`\\b(${monthPattern})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?\\s+(\\d{4})\\b`, 'i'));
  if (match) return validIsoDate(match[3], monthNumbers[match[1].toLowerCase()], match[2]);

  match = text.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthPattern})\\.?(?:,)?\\s+(\\d{4})\\b`, 'i'));
  if (match) return validIsoDate(match[3], monthNumbers[match[2].toLowerCase()], match[1]);
  return '';
}

function htmlAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decodeEntities(match[2]).trim() : '';
}

function extractPublicationDateFromText(text) {
  const labeledDate = text.match(
    /(?:published(?: time| date)?|publication date|posted|date)\s*(?:on|:|-)?\s*((?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2})|(?:\d{1,2}[/.]\d{1,2}[/.]\d{4})|(?:[a-z]+\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,)?\s+\d{4})|(?:\d{1,2}(?:st|nd|rd|th)?\s+[a-z]+\.?(?:,)?\s+\d{4}))/i
  );
  return labeledDate ? normalizePublicationDate(labeledDate[1]) : '';
}

function extractPublicationDateFromHtml(html) {
  // JSON-LD is generally the strongest signal and is independent of how the
  // visible article header happens to be styled.
  const structuredMatch = html.match(/["']datePublished["']\s*:\s*["']([^"']+)["']/i);
  if (structuredMatch) {
    const date = normalizePublicationDate(structuredMatch[1]);
    if (date) return date;
  }

  const publicationMetaNames = new Set([
    'article:published_time', 'og:published_time', 'date', 'datepublished',
    'publishdate', 'publish-date', 'pub_date', 'parsely-pub-date',
    'sailthru.date', 'dc.date', 'dcterms.date', 'date.created', 'date.issued'
  ]);
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const name = (
      htmlAttribute(tag, 'property')
      || htmlAttribute(tag, 'name')
      || htmlAttribute(tag, 'itemprop')
    ).toLowerCase();
    if (!publicationMetaNames.has(name)) continue;
    const date = normalizePublicationDate(htmlAttribute(tag, 'content'));
    if (date) return date;
  }

  const timeTags = html.match(/<time\b[^>]*>[\s\S]*?<\/time>/gi) || [];
  const explicitlyPublished = timeTags.filter((tag) => (
    /(?:datepublished|publish|posted|entry-date|post-date)/i.test(tag)
  ));
  for (const tag of [...explicitlyPublished, ...timeTags]) {
    const date = normalizePublicationDate(htmlAttribute(tag, 'datetime') || stripTags(tag));
    if (date) return date;
  }

  const visibleHtml = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  const visibleTextDate = extractPublicationDateFromText(stripTags(visibleHtml));
  if (visibleTextDate) return visibleTextDate;

  // Some article headers print only a bare date (as AUI does) without a
  // semantic <time> element or a "Published" label. Limit this fallback to
  // the content immediately following the main heading so dates elsewhere in
  // the article or footer cannot be mistaken for the publication date.
  const headingMatch = visibleHtml.match(/<h1\b[^>]*>[\s\S]*?<\/h1>([\s\S]{0,2000})/i);
  return headingMatch ? normalizePublicationDate(stripTags(headingMatch[1])) : '';
}

function arxivIdFromUrl(value) {
  try {
    const url = new URL(value);
    if (!/^(?:www\.)?arxiv\.org$/i.test(url.hostname)) return '';
    const match = url.pathname.match(/^\/(?:abs|pdf)\/(.+?)(?:\.pdf)?$/i);
    return match ? decodeURIComponent(match[1]).replace(/v\d+$/i, '') : '';
  } catch {
    return '';
  }
}

function extractArxivSubmittedDateFromFeed(feed) {
  const published = feed.match(/<published>([^<]+)<\/published>/i);
  return published ? normalizePublicationDate(published[1]) : '';
}

function isLikelyPostLink(url, sourceUrl) {
  let parsed;
  let base;
  try {
    parsed = new URL(url);
    base = new URL(sourceUrl);
  } catch {
    return false;
  }
  const baseDomain = base.hostname.replace(/^www\./i, '');
  const isOfficialBlogSubdomain = parsed.hostname === `blog.${baseDomain}`;
  if (parsed.origin !== base.origin && !isOfficialBlogSubdomain) return false;
  if (SKIP_EXTENSIONS.test(parsed.pathname)) return false;
  if (SKIP_PATH_HINTS.test(parsed.pathname)) return false;
  if (parsed.pathname === base.pathname || parsed.pathname === '/') return false;

  // Reject accidental self-nesting from site-relative hrefs resolved against a
  // nested listing page (e.g. an href of "blog/labels" on .../blog/ resolving
  // to .../blog/blog/labels) — any consecutively repeated path segment is a
  // reliable sign of that, not a real post URL.
  const allSegments = parsed.pathname.split('/').filter(Boolean);
  for (let i = 0; i < allSegments.length - 1; i += 1) {
    if (allSegments[i].toLowerCase() === allSegments[i + 1].toLowerCase()) return false;
  }

  const basePath = base.pathname.endsWith('/') ? base.pathname : `${base.pathname}/`;
  const isLinkedContentSection = parsed.origin === base.origin
    && !parsed.pathname.startsWith(basePath)
    && CONTENT_SECTION_PREFIXES.has(allSegments[0]?.toLowerCase());
  let localSegments;

  if (parsed.origin !== base.origin && isOfficialBlogSubdomain) {
    // Some official listing pages on www link to posts hosted on the site's
    // blog subdomain (for example www.cognaize.com/news → blog.cognaize.com).
    localSegments = allSegments;
    if (localSegments.length > 2) return false;
  } else if (isLinkedContentSection) {
    // Some indexes use a branded listing path while linking to several
    // first-party content sections (for example /signal → /blog and
    // /news-resources → /blog, /news, or /resources).
    localSegments = allSegments.slice(1);
    if (localSegments.length === 0 || localSegments.length > 2) return false;
  } else if (basePath !== '/') {
    // Listing page has a real subpath (e.g. /blog/) — scope candidates to links
    // that live under that same directory, which excludes site-wide nav/footer
    // links that happen to share the origin but point elsewhere on the site.
    if (!parsed.pathname.startsWith(basePath) || parsed.pathname === basePath) return false;
    localSegments = parsed.pathname.slice(basePath.length).split('/').filter(Boolean);
  } else {
    // Listing page is the site root (e.g. a homepage "News" section, or a
    // Medium/Substack profile) — no path prefix to scope by, so require a
    // shallow depth instead.
    localSegments = allSegments;
    if (localSegments.length > 2) return false;
  }

  if (localSegments.length === 0) return false;
  if (NAV_STOPLIST.has(localSegments[0].toLowerCase())) return false;
  return true;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    parsed.search = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, ...(options.headers || {}) }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function extractLinksFromHtml(sourceUrl) {
  const response = await fetchWithTimeout(sourceUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();

  const links = [];
  const anchorRegex = /<a\b[^>]*href\s*=\s*["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorRegex.exec(html))) {
    const [, href, innerHtml] = match;
    if (SKIP_SCHEMES.test(href.trim())) continue;
    let absolute;
    try {
      absolute = new URL(href, sourceUrl).toString();
    } catch {
      continue;
    }
    const text = decodeEntities(stripTags(innerHtml));
    if (text.length < 4) continue;
    links.push({ url: normalizeUrl(absolute), title: text });
  }
  return links;
}

async function extractLinksFromProxy(sourceUrl) {
  const proxyUrl = `https://r.jina.ai/${sourceUrl}`;
  const response = await fetchWithTimeout(proxyUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status} (proxy)`);
  const text = await response.text();

  const links = [];
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(text))) {
    const [, title, href] = match;
    if (title.trim().length < 4) continue;
    links.push({ url: normalizeUrl(href), title: title.trim() });
  }
  return links;
}

async function extractCandidateLinks(sourceUrl) {
  try {
    return await extractLinksFromHtml(sourceUrl);
  } catch (err) {
    console.warn(`  direct fetch failed (${err.message}), retrying via proxy…`);
    try {
      return await extractLinksFromProxy(sourceUrl);
    } catch (proxyErr) {
      console.warn(`  proxy fetch also failed (${proxyErr.message}), skipping this source`);
      return [];
    }
  }
}

async function extractPublicationDate(postUrl) {
  const arxivId = arxivIdFromUrl(postUrl);
  if (arxivId) {
    try {
      const apiUrl = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`;
      const response = await fetchWithTimeout(apiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const date = extractArxivSubmittedDateFromFeed(await response.text());
      if (!date) throw new Error('submitted date missing from arXiv response');
      return date;
    } catch (err) {
      // Do not fall through to generic metadata: arXiv's updated date may
      // represent a later revision. An unavailable date is safer than a false
      // publication date here.
      console.warn(`  arXiv submitted-date lookup failed (${err.message}); date unavailable`);
      return '';
    }
  }

  try {
    const response = await fetchWithTimeout(postUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const date = extractPublicationDateFromHtml(await response.text());
    if (date) return date;
  } catch (err) {
    console.warn(`  article fetch failed (${err.message}), retrying via proxy…`);
  }

  try {
    const proxyUrl = `https://r.jina.ai/${postUrl}`;
    const response = await fetchWithTimeout(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} (proxy)`);
    return extractPublicationDateFromText(await response.text());
  } catch (err) {
    console.warn(`  article proxy fetch failed (${err.message}); date unavailable`);
    return '';
  }
}

async function main() {
  const runDate = todayIso();
  const sources = await readJson(SOURCES_PATH, {});
  const known = await readJson(KNOWN_PATH, {});
  const pending = await readJson(PENDING_PATH, []);
  const indexHtml = await readFile(INDEX_PATH, 'utf8');

  const pendingUrls = new Set(pending.map((entry) => entry.url));
  const discoveredToday = [];

  for (const [company, sourceUrls] of Object.entries(sources)) {
    if (!sourceUrls || sourceUrls.length === 0) continue;
    const knownUrls = new Set(known[company] || []);

    for (const sourceUrl of sourceUrls) {
      console.log(`Checking ${company}: ${sourceUrl}`);
      const links = await extractCandidateLinks(sourceUrl);
      await sleep(REQUEST_DELAY_MS);

      for (const link of links) {
        if (!isLikelyPostLink(link.url, sourceUrl)) continue;
        if (knownUrls.has(link.url)) continue;
        if (pendingUrls.has(link.url)) continue;

        knownUrls.add(link.url);
        pendingUrls.add(link.url);
        // Listing pages frequently omit dates even though the article itself
        // includes one. Inspect the article before marking the post undated.
        const date = await extractPublicationDate(link.url);
        await sleep(REQUEST_DELAY_MS);
        discoveredToday.push({
          company,
          title: link.title,
          date,
          url: link.url,
          sourceUrl,
          discovered: runDate,
          status: 'needs-review'
        });
      }
    }

    known[company] = [...knownUrls];
  }

  if (discoveredToday.length > 0) {
    console.log(`\nDiscovered ${discoveredToday.length} candidate new post(s).`);
    pending.push(...discoveredToday);
  } else {
    console.log('\nNo new posts found.');
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(KNOWN_PATH, JSON.stringify(known, null, 2) + '\n');
  await writeFile(PENDING_PATH, JSON.stringify(pending, null, 2) + '\n');
  await writeFile(INDEX_PATH, updateBlogSnapshotHtml(indexHtml, runDate), 'utf8');
  console.log(`Updated Posts snapshot date to ${runDate}.`);
}

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

export {
  arxivIdFromUrl,
  extractArxivSubmittedDateFromFeed,
  extractPublicationDateFromHtml,
  extractPublicationDateFromText,
  formatSnapshotDate,
  updateBlogSnapshotHtml,
  normalizePublicationDate
};
