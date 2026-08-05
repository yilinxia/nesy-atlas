#!/usr/bin/env node
// Daily blog-source checker for NeSy Atlas.
//
// Reads data/blog-sources.json (one or more listing-page URLs per company),
// fetches each source, extracts candidate post links, and diffs them against
// data/known-posts.json. Anything new gets appended to data/pending-posts.json
// for human review — this script never edits script.js directly.
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

async function main() {
  const sources = await readJson(SOURCES_PATH, {});
  const known = await readJson(KNOWN_PATH, {});
  const pending = await readJson(PENDING_PATH, []);

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
        discoveredToday.push({
          company,
          title: link.title,
          url: link.url,
          sourceUrl,
          discovered: todayIso(),
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
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
