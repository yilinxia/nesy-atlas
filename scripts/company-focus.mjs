#!/usr/bin/env node

// Builds a text corpus from each company's homepage and published posts, then
// profiles what every company writes about and how those themes move over time.
//
//   node scripts/company-focus.mjs fetch     # cache homepage + post text
//   node scripts/company-focus.mjs analyze   # write data/company-focus.json
//   node scripts/company-focus.mjs all

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { extractArticleText } from './update-blog-keyword-matches.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPANIES_PATH = resolve(ROOT, 'data/companies.js');
const O9_PATH = resolve(ROOT, 'data/o9-posts.json');
const CACHE_DIR = resolve(ROOT, '.company-corpus/pages');
const JSON_PATH = resolve(ROOT, 'data/company-focus.json');
const JS_PATH = resolve(ROOT, 'data/company-focus.js');

const DEFAULT_CONCURRENCY = 12;
const FETCH_TIMEOUT_MS = 25000;
const USER_AGENT = 'NeSyAtlasFocusAudit/1.0';
// Medium and Cloudflare-fronted sites reject the plain audit agent outright.
const FALLBACK_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const MIN_TEXT_LENGTH = 120;
const MAX_RESOURCE_BYTES = 12 * 1024 * 1024;
const execFileAsync = promisify(execFile);

// HTML heading levels are a stable, auditable proxy for visual prominence.
// Exact computed font sizes would require executing every third-party site and
// would make refreshes brittle; these weights preserve the same intent.
export const HOMEPAGE_PROMINENCE_WEIGHTS = Object.freeze({ body: 1, title: 4, h1: 5, h2: 3, h3: 2 });
const HOMEPAGE_PROMINENCE_STOPWORDS = new Set([
  'access', 'action', 'build', 'built', 'design', 'different', 'era', 'future',
  'problem', 'problems', 'question', 'questions', 'ready', 'tool', 'tools'
]);

// Themes are scored per document: a document counts once for a theme when any
// of its patterns fire, so a page repeating "agent" 40 times cannot swamp the
// profile. Patterns stay deliberately narrow to keep false positives low.
export const THEMES = [
  {
    id: 'neurosymbolic',
    label: 'Neurosymbolic framing',
    pattern: /\b(?:neuro[\s-]?symbolic|neural[\s-]+symbolic|nesy|symbolic ai|hybrid ai|symbolic reasoning)\b/i
  },
  {
    id: 'reasoning',
    label: 'Reasoning & logic',
    pattern: /\b(?:reasoning|logical inference|first[\s-]order logic|deductive|theorem prover?s?|constraint solv\w*|sat solver|smt solver|prolog|datalog|answer set programming|rule engine|inference engine)\b/i
  },
  {
    id: 'knowledge',
    label: 'Knowledge graphs & ontologies',
    pattern: /\b(?:knowledge graphs?|ontolog\w+|rdf|sparql|triple ?stores?|semantic (?:layer|web|model|network)|taxonom\w+|knowledge base)\b/i
  },
  {
    id: 'llm',
    label: 'LLMs & generative AI',
    pattern: /\b(?:llms?|large language models?|generative ai|gen ?ai|foundation models?|transformers?|gpt-?\d|prompt engineering|retrieval[\s-]augmented|\brag\b|hallucinat\w+)\b/i
  },
  {
    id: 'agents',
    label: 'Agents & automation',
    pattern: /\b(?:agentic|ai agents?|autonomous agents?|multi[\s-]agent|copilots?|workflow automation|orchestrat\w+|robotic process automation|\brpa\b)\b/i
  },
  {
    id: 'trust',
    label: 'Explainability & trust',
    pattern: /\b(?:explainab\w+|interpretab\w+|\bxai\b|black[\s-]box|transparen\w+|trustworth\w+|auditab\w+|provenance|traceab\w+)\b/i
  },
  {
    id: 'governance',
    label: 'Governance & compliance',
    pattern: /\b(?:compliance|regulator\w+|regulations?|eu ai act|\bgdpr\b|\bhipaa\b|governance|risk management|policy enforcement|\bsoc ?2\b)\b/i
  },
  {
    id: 'verification',
    label: 'Formal methods & verification',
    pattern: /\b(?:formal (?:verification|methods?|specification)|formally verif\w+|model checking|proof assistant|correctness guarantee|safety[\s-]critical|invariants?)\b/i
  },
  {
    id: 'data',
    label: 'Data & document processing',
    pattern: /\b(?:unstructured data|document (?:processing|understanding|extraction)|data pipelines?|data integration|\betl\b|data quality|data warehouse|\bocr\b|structured extraction)\b/i
  },
  {
    id: 'planning',
    label: 'Planning & supply chain',
    pattern: /\b(?:supply chains?|demand (?:planning|forecast\w*)|s&op|inventory|logistics|production planning|scenario planning|procurement)\b/i
  },
  {
    id: 'healthcare',
    label: 'Healthcare & life sciences',
    pattern: /\b(?:clinical|patients?|healthcare|medical records?|\bicd-?10\b|\bhcc\b|payers?|providers? network|diagnos\w+|drug discovery)\b/i
  },
  {
    id: 'finance',
    label: 'Financial services',
    pattern: /\b(?:financial services|banks?|banking|insurance|underwrit\w+|trading|credit risk|\bkyc\b|anti[\s-]money laundering|portfolio|fintech)\b/i
  },
  {
    id: 'industrial',
    label: 'Industrial & energy',
    pattern: /\b(?:oil and gas|\blng\b|refiner\w+|upstream|drilling|manufacturing plant|industrial operations|energy sector|power grid|predictive maintenance)\b/i
  },
  {
    id: 'customer',
    label: 'Customer & go-to-market',
    pattern: /\b(?:customer experience|contact cent(?:er|re)s?|conversational ai|voice assistants?|go[\s-]to[\s-]market|\bgtm\b|sales teams?|marketing teams?|revenue operations)\b/i
  },
  {
    id: 'robotics',
    label: 'Robotics & embodied AI',
    pattern: /\b(?:robots?|robotics|embodied (?:ai|agents?)|manipulation|autonomous vehicles?|self[\s-]driving|motion planning|world models?)\b/i
  },
  {
    id: 'research',
    label: 'Research & benchmarks',
    pattern: /\b(?:benchmarks?|state[\s-]of[\s-]the[\s-]art|ablation|held[\s-]out|evaluation suite|arxiv|our paper|peer[\s-]reviewed|neurips|\bicml\b|\biclr\b|\baaai\b|\bijcai\b)\b/i
  },
  {
    id: 'corporate',
    label: 'Funding & company news',
    pattern: /\b(?:series [a-e] (?:round|funding)|seed round|raises? \$|funding round|valuation|acquisition|acquires?|appoints?|joins? (?:the )?(?:board|team) as|partnership with|welcoming)\b/i
  }
];

// Page furniture that survives the HTML strip and would otherwise dominate a
// company's vocabulary: consent banners, CTA buttons, credit lines, footnotes.
const CHROME_PATTERNS = [
  /\b(?:we use cookies|this (?:web ?site|website) uses cookies|cookie (?:policy|settings|preferences|consent)|technical storage (?:and|or) access|consent to (?:the )?(?:storage|processing))[^.!?]{0,300}[.!?]?/gi,
  /\bsubscribe to (?:our )?(?:newsletter|blog|updates)[^.!?]{0,120}[.!?]?/gi,
  /\b(?:frequently asked questions|read more|learn more|get started|book a demo|request a demo|contact sales|talk to (?:us|sales)|sign up|log in|all rights reserved)\b/gi,
  /\bpress enter or click to view image in full size\b/gi,
  // Consent banners vary too much to enumerate; drop any sentence naming cookies.
  /[^.!?]{0,200}\bcookies?\b[^.!?]{0,200}[.!?]?/gi,
  /[^.!?]{0,300}↩︎/g,
  /\b(?:Article|Research|Acknowledge?ments?|Authors?|Written by)\s*:\s*(?:[A-Z][A-Za-z.'’-]+(?:\s+[A-Z][A-Za-z.'’-]+)*\s*[,|]?\s*)+/g
];

export function stripChrome(text) {
  let output = String(text || '');
  for (const pattern of CHROME_PATTERNS) output = output.replace(pattern, ' ');
  return output.replace(/\s+/g, ' ').trim();
}

const STOPWORDS = new Set(`a about above after again against all also am an and any are aren as at be because been before
being below between both but by can cannot could couldn did didn do does doesn doing don down during each few for from
further had hadn has hasn have haven having he her here hers herself him himself his how i if in into is isn it its
itself just ll me more most mustn my myself no nor not now of off on once only or other ought our ours ourselves out
over own re s same shan she should shouldn so some such t than that the their theirs them themselves then there these
they this those through to too under until up ve very was wasn we were weren what when where which while who whom why
will with won would wouldn you your yours yourself yourselves us via one two three new use used using make makes making
get gets getting need needs like way ways time times year years today many much every each first second next best
help helps helping work works working take takes taking see sees seen say says said know knows known think thinks
across within without based across around often always never able across able us it's don't we're that's you're
read more blog post posts article articles page home contact us learn about privacy policy terms cookie cookies
sign up log in request demo book meeting subscribe newsletter follow linkedin twitter copyright rights reserved
company companies team teams platform platforms solution solutions product products customer customers business
businesses enterprise enterprises industry industries technology technologies data ai artificial intelligence
system systems model models
rsquo rdquo lsquo ldquo mdash ndash nbsp amp quot hellip apos bull middot times deg
rarr larr raquo laquo copy reg trade nbsp shy zwnj
january february march april may june july august september october november december
jan feb mar apr jun jul aug sep sept oct nov dec monday tuesday wednesday thursday friday
consent cookie preferences necessary functionalities anonymously essential opt-out browser website websites
navigation menu toggle click here submit form email address phone number careers press kit
recent featured topics picks previous latest related insights news resources archive tags category categories
yes i'm we'll we've you'll it's don't doesn't isn't aren't we're they're let's lets talk
share tweet linkedin facebook youtube instagram github reserved inc llc ltd gmbh`.split(/\s+/).filter(Boolean));

function optionValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function optionNumber(name, fallback) {
  const value = Number(optionValue(name, fallback));
  return Number.isInteger(value) && value > 0 ? value : fallback;
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
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, worker));
  return results;
}

export async function loadOrganizations() {
  const [source, o9Snapshot] = await Promise.all([
    readFile(COMPANIES_PATH, 'utf8'),
    readFile(O9_PATH, 'utf8').then(JSON.parse)
  ]);
  const context = { O9_POSTS: o9Snapshot.posts };
  const loadOrgs = new Function('globalThis', `${source}\nreturn globalThis.COMPANY_DIRECTORY;`);
  return loadOrgs(context);
}

// One document per homepage or post. `depth` records whether the text is the
// full page or only the listing excerpt, so the analysis can say so honestly.
export function buildDocumentPlan(organizations) {
  return organizations.flatMap((organization) => {
    const documents = [];
    if (organization.website) {
      documents.push({
        organization: organization.name,
        kind: 'homepage',
        title: `${organization.name} homepage`,
        url: organization.website,
        date: ''
      });
    }
    const posts = organization.posts?.length
      ? organization.posts
      : organization.postUrl && organization.postTitle
        ? [{ title: organization.postTitle, date: organization.postDate, url: organization.postUrl }]
        : [];
    for (const post of posts) {
      documents.push({
        organization: organization.name,
        kind: 'post',
        title: post.title || '',
        url: post.url,
        date: post.date || '',
        // o9 ships hundreds of posts through a snapshot that already carries an
        // excerpt; reuse it instead of refetching the whole resource library.
        inlineText: typeof post.excerpt === 'string' ? post.excerpt : ''
      });
    }
    return documents;
  });
}

function cachePath(url) {
  return resolve(CACHE_DIR, `${createHash('sha1').update(url).digest('hex')}.json`);
}

async function readCache(url) {
  try {
    return JSON.parse(await readFile(cachePath(url), 'utf8'));
  } catch {
    return null;
  }
}

async function curlText(url) {
  const { stdout } = await execFileAsync('curl', [
    '--location',
    '--fail',
    '--silent',
    '--show-error',
    '--max-time',
    String(Math.ceil(FETCH_TIMEOUT_MS / 1000)),
    '--user-agent',
    FALLBACK_USER_AGENT,
    '--header',
    'Accept: text/html,application/xhtml+xml,application/javascript,text/javascript,*/*;q=0.8',
    url
  ], { encoding: 'utf8', maxBuffer: MAX_RESOURCE_BYTES });
  return stdout;
}

async function fetchResource(url) {
  let fetchError = null;
  try {
    let response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (response.status === 403 || response.status === 429) {
      response = await fetch(url, {
        headers: { 'User-Agent': FALLBACK_USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
        redirect: 'follow',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
      });
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return {
      body: await response.text(),
      contentType: response.headers.get('content-type') || '',
      finalUrl: response.url,
      transport: 'fetch'
    };
  } catch (error) {
    fetchError = error;
  }

  try {
    return { body: await curlText(url), contentType: '', finalUrl: url, transport: 'curl' };
  } catch (curlError) {
    throw new Error(`${fetchError?.message || 'fetch failed'}; curl: ${curlError.message}`);
  }
}

function readableScriptCandidate(value) {
  const decoded = String(value || '')
    .replace(/\\n|\\r|\\t/g, ' ')
    .replace(/\\([\\"'`])/g, '$1');
  const text = extractArticleText(decoded).replace(/\\u00(?:26|3c|3e)/gi, ' ').replace(/\s+/g, ' ').trim();
  const words = text.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  if (text.length < 24 || words.length < 4) return '';
  if (/https?:\/\/|\/assets\/|\.(?:js|css|woff2?|png|jpe?g|svg)(?:\?|$)/i.test(text)) return '';
  if (/(?:^|\s)(?:className|aria-|data-testid|items-center|justify-center|rounded-|text-(?:sm|lg|xl)|bg-|px-|py-|md:|lg:)/.test(text)) return '';
  if (/(?:React\.|React child|setState\(|forceFrameRate|dangerouslySetInnerHTML|full message or use the non-minified)/i.test(text)) return '';
  if (/Did you forget to add the page to the router/i.test(text)) return '';
  if (/(?:=>|===|!==|\b(?:prototype|querySelector|Array\.isArray|Symbol\.for|throw new Error)\b|children:[a-z]+\.|\)\{|\}\))/i.test(text)) return '';
  if (words.length > 25 && !/[.!?]/.test(text)) return '';
  if ((text.match(/[{};=]/g) || []).length > 3) return '';
  const letters = (text.match(/[A-Za-z]/g) || []).length;
  if (letters / Math.max(text.replace(/\s/g, '').length, 1) < 0.55) return '';
  return text;
}

// Client-rendered homepages often ship all visible copy as string literals in
// their first-party route bundle. Recover that copy without executing the app.
export function extractReadableScriptText(source) {
  const values = [];
  // Restrict ordinary strings to semantic JSX/object fields so quote marks in
  // regexes and runtime internals cannot make unrelated code look like prose.
  const patterns = [
    /(?:children|title|description|subtitle|heading|text|abstract|excerpt)\s*:\s*"((?:\\.|[^"\\]){20,20000})"/g,
    /`(\s*<(?:article|main|section|div|h[1-6]|p)\b(?:\\.|[^`\\]){20,20000})`/g
  ];
  for (const pattern of patterns) {
    for (const match of String(source || '').matchAll(pattern)) {
      if (match[0][0] === '`' && match[1].includes('${')) continue;
      const text = readableScriptCandidate(match[1]);
      if (text) values.push(text);
    }
  }
  return [...new Set(values)].join(' ').slice(0, 100000);
}

export function extractClientAssetUrls(html, pageUrl, limit = 4) {
  const source = String(html || '');
  const direct = [...source.matchAll(/<script\b[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  const preloads = [...source.matchAll(/<link\b[^>]+(?:rel=["']modulepreload["'][^>]+href|href)=["']([^"']+\.js(?:\?[^"']*)?)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((path) => /(?:home|landing|index|onton|main|app)[-_./]/i.test(path))
    .filter((path) => !/(?:entry\.client|jsx-runtime|preload-helper|chunk-)/i.test(path));
  const urls = [];
  for (const path of [...direct, ...preloads]) {
    try {
      const url = new URL(path, pageUrl);
      if (url.origin === new URL(pageUrl).origin && !urls.includes(url.href)) urls.push(url.href);
    } catch {
      // Ignore malformed asset references.
    }
  }
  return urls.slice(0, limit);
}

function textProxyUrl(url) {
  return `https://r.jina.ai/${url}`;
}

export function extractTextProxyPage(source) {
  const raw = String(source || '');
  const title = raw.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || '';
  const markdown = raw.split(/^Markdown Content:\s*$/m)[1]?.trim() || '';
  const text = markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const headings = [...markdown.matchAll(/^(#{1,3})\s+(.+)$/gm)].map((match) => ({
    level: match[1].length,
    text: match[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]+/g, '').trim()
  }));
  return { title, text, homepageProminence: { title, headings } };
}

async function fetchViaTextProxy(url, kind, reason) {
  const sourceUrl = textProxyUrl(url);
  const resource = await fetchResource(sourceUrl);
  const proxy = extractTextProxyPage(resource.body);
  if (proxy.text.length < MIN_TEXT_LENGTH) throw new Error(`${reason}; text proxy returned no usable content`);
  return {
    text: proxy.text,
    status: 'fetched',
    metaDescription: '',
    sourceMode: 'text-proxy',
    sourceUrl,
    proxyReason: reason,
    ...(kind === 'homepage' ? { homepageProminence: proxy.homepageProminence } : {})
  };
}

async function fetchPage(url, kind) {
  let resource;
  try {
    resource = await fetchResource(url);
  } catch (error) {
    return fetchViaTextProxy(url, kind, error.message);
  }
  if (/application\/pdf/i.test(resource.contentType) || /\.pdf(?:$|[?#])/i.test(resource.finalUrl)) {
    return { text: '', status: 'pdf-skipped', sourceMode: resource.transport };
  }
  let html = resource.body;
  let text = extractArticleText(html);

  // Some CDNs serve a bot shell to fetch() but complete HTML to curl.
  if (text.length < MIN_TEXT_LENGTH && resource.transport === 'fetch') {
    try {
      const curlHtml = await curlText(url);
      const curlPageText = extractArticleText(curlHtml);
      if (curlPageText.length > text.length) {
        html = curlHtml;
        text = curlPageText;
        resource.transport = 'curl';
      }
    } catch {
      // Continue to the client-bundle and proxy fallbacks.
    }
  }

  let assetUrls = [];
  if (kind === 'homepage' && text.length < MIN_TEXT_LENGTH) {
    assetUrls = extractClientAssetUrls(html, resource.finalUrl || url);
    const assets = await workerPool(assetUrls, 2, async (assetUrl) => {
      try {
        return extractReadableScriptText((await fetchResource(assetUrl)).body);
      } catch {
        return '';
      }
    });
    const clientText = assets.filter(Boolean).join(' ').trim();
    if (clientText.length > text.length) text = clientText;
  }

  if (text.length < MIN_TEXT_LENGTH) {
    try {
      return await fetchViaTextProxy(url, kind, 'official response contained no usable body text');
    } catch {
      // Preserve the official metadata as partial evidence when the proxy also fails.
    }
  }
  return {
    text,
    status: text.length >= MIN_TEXT_LENGTH ? 'fetched' : 'thin',
    metaDescription: metaDescription(html),
    sourceMode: assetUrls.length && text.length >= MIN_TEXT_LENGTH ? 'client-bundle' : resource.transport,
    ...(assetUrls.length ? { assetUrls } : {}),
    ...(kind === 'homepage' ? { homepageProminence: extractHomepageProminence(html) } : {})
  };
}

export function extractHomepageProminence(html) {
  const source = String(html || '');
  const titleSource = source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
  const withoutFurniture = source
    .replace(/<(script|style|svg|nav|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  const headings = [...withoutFurniture.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({ level: Number(match[1]), text: extractArticleText(match[2]) }))
    .filter((heading) => heading.text);
  return {
    title: extractArticleText(titleSource),
    headings
  };
}

export function metaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i
  ];
  for (const pattern of patterns) {
    const match = String(html || '').match(pattern);
    if (match) return match[1].replace(/\s+/g, ' ').trim();
  }
  return '';
}

async function commandFetch() {
  const concurrency = optionNumber('--concurrency', DEFAULT_CONCURRENCY);
  const refresh = process.argv.includes('--refresh');
  const retryFailed = process.argv.includes('--retry-failed');
  const homepagesOnly = process.argv.includes('--homepages-only');
  const organizationFilter = new Set(
    optionValue('--organization', '').split(',').map((name) => name.trim().toLowerCase()).filter(Boolean)
  );
  const limit = optionNumber('--limit', 0);
  await mkdir(CACHE_DIR, { recursive: true });

  const organizations = await loadOrganizations();
  let documents = buildDocumentPlan(organizations).filter((document) => document.url && !document.inlineText);
  if (homepagesOnly) documents = documents.filter((document) => document.kind === 'homepage');
  if (organizationFilter.size) {
    documents = documents.filter((document) => organizationFilter.has(document.organization.toLowerCase()));
  }
  if (limit) documents = documents.slice(0, limit);

  console.log(`Fetching ${documents.length} pages with ${concurrency} workers`);
  let completed = 0;
  const results = await workerPool(documents, concurrency, async (document) => {
    const cached = refresh ? null : await readCache(document.url);
    let record = retryFailed && cached && cached.status !== 'fetched' ? null : cached;
    if (!record) {
      try {
        const page = await fetchPage(document.url, document.kind);
        record = { url: document.url, fetchedAt: new Date().toISOString(), ...page };
      } catch (error) {
        // A temporary refresh failure should not erase a previously usable
        // corpus record or its prominence data.
        record = cached && (cached.status === 'fetched' || cached.metaDescription)
          ? { ...cached, lastRefreshError: error.message }
          : { url: document.url, fetchedAt: new Date().toISOString(), text: '', status: `unavailable: ${error.message}` };
      }
      await writeFile(cachePath(document.url), `${JSON.stringify(record)}\n`, 'utf8');
    }
    completed += 1;
    if (completed % 50 === 0 || completed === documents.length) console.log(`[${completed}/${documents.length}]`);
    return record.status;
  });

  const tally = results.reduce((counts, status) => {
    const key = status.startsWith('unavailable:') ? 'unavailable' : status;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  console.log(JSON.stringify(tally, null, 2));
}

export function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]+/g, ' ')
    .split(/\s+/)
    .map((token) => token.replace(/^[''-]+|[''-]+$/g, ''))
    .filter((token) => token.length > 2 && token.length < 30 && !/^\d+$/.test(token) && !STOPWORDS.has(token));
}

export function termsOf(text, blockedTerms = new Set()) {
  const tokens = tokenize(text);
  const terms = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const unigram = tokens[index];
    if (!blockedTerms.has(unigram)) terms.push(unigram);
    const next = tokens[index + 1];
    // A repeated token is almost always a title echoed by the page heading, and
    // a bigram built from a blocked identity word is just the company name again.
    if (next && next !== unigram && !blockedTerms.has(unigram) && !blockedTerms.has(next)) {
      const bigram = `${unigram} ${next}`;
      if (!blockedTerms.has(bigram)) terms.push(bigram);
    }
  }
  return terms;
}

export function themeHits(text) {
  const hits = [];
  for (const theme of THEMES) {
    if (theme.pattern.test(text)) hits.push(theme.id);
  }
  return hits;
}

export function homepageThemeProfile(text, prominence = {}) {
  const scores = Object.fromEntries(THEMES.map((theme) => [theme.id, 0]));
  for (const theme of themeHits(text)) scores[theme] += HOMEPAGE_PROMINENCE_WEIGHTS.body;
  const segments = [
    { text: prominence.title || '', weight: HOMEPAGE_PROMINENCE_WEIGHTS.title },
    ...(prominence.headings || []).map((heading) => ({
      text: heading.text,
      weight: HOMEPAGE_PROMINENCE_WEIGHTS[`h${heading.level}`] || HOMEPAGE_PROMINENCE_WEIGHTS.body
    }))
  ];
  for (const segment of segments) {
    for (const theme of themeHits(segment.text)) scores[theme] += segment.weight;
  }
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  return {
    themes: Object.entries(scores).filter(([, score]) => score > 0).map(([theme]) => theme),
    scores,
    shares: Object.fromEntries(Object.entries(scores).map(([theme, score]) => [theme, share(score, total)]))
  };
}

export function periodOf(date, granularity = 'half') {
  const match = /^(\d{4})-(\d{2})/.exec(String(date || ''));
  if (!match) return '';
  const [, year, month] = match;
  if (granularity === 'year') return year;
  if (granularity === 'quarter') return `${year}-Q${Math.floor((Number(month) - 1) / 3) + 1}`;
  return `${year}-H${Number(month) <= 6 ? 1 : 2}`;
}

function share(part, whole) {
  return whole > 0 ? Number((part / whole).toFixed(4)) : 0;
}

async function loadCorpus(organizations) {
  const plan = buildDocumentPlan(organizations);
  const documents = [];
  for (const item of plan) {
    if (item.inlineText) {
      documents.push({ ...item, text: stripChrome(`${item.title}. ${item.inlineText}`), depth: 'excerpt', status: 'source-content' });
      continue;
    }
    const cached = await readCache(item.url);
    const combined = cached
      ? stripChrome(`${item.title}. ${cached.metaDescription || ''} ${cached.text || ''}`)
      : item.title;
    if (cached && cached.status === 'fetched') {
      documents.push({
        ...item,
        text: combined,
        depth: 'full',
        status: 'fetched',
        sourceMode: cached.sourceMode || 'fetch',
        sourceUrl: cached.sourceUrl || item.url,
        ...(item.kind === 'homepage' ? { homepageProminence: cached.homepageProminence || null } : {})
      });
      continue;
    }
    // Client-rendered pages return almost no server HTML; their meta description
    // is usually a hand-written summary, so keep it as partial signal.
    if (cached && (cached.metaDescription || '').length >= 60) {
      documents.push({
        ...item,
        text: combined,
        depth: 'partial',
        status: cached.status,
        sourceMode: cached.sourceMode || 'fetch',
        sourceUrl: cached.sourceUrl || item.url,
        ...(item.kind === 'homepage' ? { homepageProminence: cached.homepageProminence || null } : {})
      });
      continue;
    }
    // Fall back to the title so an unreachable page still contributes its
    // headline signal, but mark it so coverage numbers stay honest.
    documents.push({ ...item, text: item.title, depth: 'title-only', status: cached ? cached.status : 'not-fetched' });
  }
  return documents;
}

function homepageProminentTerms(homepages, blockedTerms, limit = 24) {
  const stats = new Map();
  for (const homepage of homepages) {
    const prominence = homepage.homepageProminence || {};
    const segments = [
      { text: prominence.title || '', weight: HOMEPAGE_PROMINENCE_WEIGHTS.title },
      ...(prominence.headings || []).map((heading) => ({
        text: heading.text,
        weight: HOMEPAGE_PROMINENCE_WEIGHTS[`h${heading.level}`] || HOMEPAGE_PROMINENCE_WEIGHTS.body
      }))
    ];
    const companyWeights = new Map();
    for (const segment of segments) {
      for (const term of new Set(termsOf(segment.text, blockedTerms))) {
        if (HOMEPAGE_PROMINENCE_STOPWORDS.has(term)) continue;
        companyWeights.set(term, Math.min(12, (companyWeights.get(term) || 0) + segment.weight));
      }
    }
    for (const [term, weight] of companyWeights) {
      const entry = stats.get(term) || { term, score: 0, companies: 0 };
      entry.score += weight;
      entry.companies += 1;
      stats.set(term, entry);
    }
  }
  return [...stats.values()]
    .filter((entry) => entry.companies >= 2)
    .sort((a, b) => b.score - a.score || b.companies - a.companies || a.term.localeCompare(b.term))
    .slice(0, limit);
}

function blockedTermsFor(organizations) {
  const blocked = new Set();
  for (const organization of organizations) {
    // Company, product, and founder names describe who is talking, not what
    // they are talking about, so they never count as distinctive vocabulary.
    const identity = tokenize(`${organization.name} ${organization.product || ''} ${organization.ceoName || ''}`);
    for (const token of identity) blocked.add(token);
    for (let index = 0; index + 1 < identity.length; index += 1) blocked.add(`${identity[index]} ${identity[index + 1]}`);
    const host = (() => {
      try {
        return new URL(organization.website).hostname.replace(/^www\./, '');
      } catch {
        return '';
      }
    })();
    for (const token of tokenize(host.replace(/\.[a-z]+$/, '').replace(/\./g, ' '))) blocked.add(token);
  }
  return blocked;
}

function distinctiveTerms(profile, documentFrequency, companyCount, limit = 12) {
  const { counts, docFreq, docs } = profile;
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0) || 1;
  const scored = [];
  for (const [term, count] of counts) {
    if (count < 3) continue;
    // With four or more documents, a term confined to a single page is usually
    // one page's jargon rather than the company's theme.
    if (docs >= 4 && (docFreq.get(term) || 0) < 2) continue;
    const df = documentFrequency.get(term) || 1;
    if (df === companyCount) continue;
    const score = (count / total) * Math.log(companyCount / df);
    if (score > 0) scored.push({ term, count, documents: docFreq.get(term) || 0, companies: df, score: Number(score.toFixed(6)) });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

async function commandAnalyze() {
  const granularity = optionValue('--granularity', 'half');
  const organizations = await loadOrganizations();
  const documents = await loadCorpus(organizations);
  const blocked = blockedTermsFor(organizations);

  const analyzed = documents.map((document) => {
    const homepageFocus = document.kind === 'homepage' && document.depth !== 'title-only'
      ? homepageThemeProfile(document.text, document.homepageProminence || {})
      : null;
    return {
      ...document,
      themes: homepageFocus?.themes
        || (document.depth === 'title-only' ? themeHits(document.title) : themeHits(document.text)),
      homepageFocus,
      period: periodOf(document.date, granularity)
    };
  });

  const termsByCompany = new Map();
  const documentFrequency = new Map();
  for (const organization of organizations) {
    termsByCompany.set(organization.name, { counts: new Map(), docFreq: new Map(), docs: 0 });
  }
  for (const document of analyzed) {
    if (document.kind !== 'post' || document.depth === 'title-only') continue;
    const profile = termsByCompany.get(document.organization);
    if (!profile) continue;
    profile.docs += 1;
    const perDocument = new Map();
    for (const term of termsOf(document.text, blocked)) perDocument.set(term, (perDocument.get(term) || 0) + 1);
    for (const [term, count] of perDocument) {
      // Cap per-page repetition so a navigation link repeated on every card
      // cannot outweigh a term the company actually writes about.
      profile.counts.set(term, (profile.counts.get(term) || 0) + Math.min(count, 3));
      profile.docFreq.set(term, (profile.docFreq.get(term) || 0) + 1);
    }
  }
  for (const profile of termsByCompany.values()) {
    for (const term of profile.counts.keys()) documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
  }

  const companies = organizations.map((organization) => {
    const own = analyzed.filter((document) => document.organization === organization.name);
    const homepage = own.find((document) => document.kind === 'homepage');
    const posts = own.filter((document) => document.kind === 'post');
    const analyzablePosts = posts.filter((document) => document.depth !== 'title-only');
    const dated = posts.filter((document) => document.date);

    const themeProfile = {};
    for (const theme of THEMES) {
      const postHits = analyzablePosts.filter((document) => document.themes.includes(theme.id)).length;
      themeProfile[theme.id] = {
        homepage: Boolean(homepage && homepage.themes.includes(theme.id)),
        posts: postHits,
        postShare: share(postHits, analyzablePosts.length)
      };
    }

    const timeline = {};
    for (const document of dated) {
      const bucket = timeline[document.period] || (timeline[document.period] = { posts: 0, themes: {} });
      bucket.posts += 1;
      for (const themeId of document.themes) bucket.themes[themeId] = (bucket.themes[themeId] || 0) + 1;
    }

    const sortedDates = dated.map((document) => document.date).sort();
    return {
      name: organization.name,
      industry: organization.industry || '',
      product: organization.product || '',
      founded: organization.founded || '',
      website: organization.website || '',
      coverage: {
        homepage: homepage ? homepage.depth : 'none',
        homepageSource: homepage?.sourceMode || '',
        homepageSourceUrl: homepage?.sourceUrl || '',
        posts: posts.length,
        postsAnalyzed: analyzablePosts.length,
        postsTextProxy: analyzablePosts.filter((document) => document.sourceMode === 'text-proxy').length,
        postsDated: dated.length,
        excerptOnly: posts.filter((document) => document.depth === 'excerpt').length
      },
      activity: {
        firstPost: sortedDates[0] || '',
        lastPost: sortedDates[sortedDates.length - 1] || '',
        postsPerYear: sortedDates.length
          ? Number((sortedDates.length / Math.max(1, yearsBetween(sortedDates[0], sortedDates[sortedDates.length - 1]))).toFixed(1))
          : 0
      },
      homepageThemes: homepage ? homepage.themes : [],
      homepageFocus: homepage?.homepageFocus || null,
      themes: themeProfile,
      topThemes: THEMES
        .map((theme) => ({ id: theme.id, label: theme.label, share: themeProfile[theme.id].postShare, posts: themeProfile[theme.id].posts }))
        .filter((entry) => entry.posts > 0)
        .sort((a, b) => b.share - a.share || b.posts - a.posts)
        .slice(0, 5),
      distinctiveTerms: distinctiveTerms(
        termsByCompany.get(organization.name) || { counts: new Map(), docFreq: new Map(), docs: 0 },
        documentFrequency,
        organizations.length
      ),
      timeline
    };
  });

  const overall = {};
  for (const document of analyzed) {
    if (document.kind !== 'post' || !document.period || document.depth === 'title-only') continue;
    const bucket = overall[document.period] || (overall[document.period] = { posts: 0, companies: new Set(), themes: {} });
    bucket.posts += 1;
    bucket.companies.add(document.organization);
    for (const themeId of document.themes) bucket.themes[themeId] = (bucket.themes[themeId] || 0) + 1;
  }
  const trend = Object.fromEntries(
    Object.entries(overall)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, bucket]) => [
        period,
        {
          posts: bucket.posts,
          companies: bucket.companies.size,
          themes: bucket.themes,
          themeShare: Object.fromEntries(Object.entries(bucket.themes).map(([id, count]) => [id, share(count, bucket.posts)]))
        }
      ])
  );

  // Company-normalised trend: each company contributes at most one vote per
  // period per theme, so o9's 500-post resource library cannot define the field.
  const normalized = {};
  for (const document of analyzed) {
    if (document.kind !== 'post' || !document.period || document.depth === 'title-only') continue;
    const bucket = normalized[document.period] || (normalized[document.period] = { companies: new Set(), themes: {} });
    bucket.companies.add(document.organization);
    for (const themeId of document.themes) {
      const set = bucket.themes[themeId] || (bucket.themes[themeId] = new Set());
      set.add(document.organization);
    }
  }
  const companyTrend = Object.fromEntries(
    Object.entries(normalized)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, bucket]) => [
        period,
        {
          companies: bucket.companies.size,
          themes: Object.fromEntries(Object.entries(bucket.themes).map(([id, set]) => [id, set.size])),
          themeShare: Object.fromEntries(
            Object.entries(bucket.themes).map(([id, set]) => [id, share(set.size, bucket.companies.size)])
          )
        }
      ])
  );

  const analyzablePosts = analyzed.filter((document) => document.kind === 'post' && document.depth !== 'title-only');
  const homepages = analyzed.filter((document) => document.kind === 'homepage');
  const analyzableHomepages = homepages.filter((document) => document.depth !== 'title-only');
  const snapshot = {
    generatedAt: new Date().toISOString(),
    granularity,
    themes: THEMES.map((theme) => ({ id: theme.id, label: theme.label, pattern: theme.pattern.source })),
    coverage: {
      companies: organizations.length,
      homepagesFetched: homepages.filter((document) => document.depth === 'full').length,
      homepagesTextProxy: homepages.filter((document) => document.sourceMode === 'text-proxy').length,
      homepagesMetaOnly: homepages.filter((document) => document.depth === 'partial').length,
      homepagesTitleOnly: homepages.filter((document) => document.depth === 'title-only').length,
      posts: analyzed.filter((document) => document.kind === 'post').length,
      postsAnalyzed: analyzablePosts.length,
      postsFullText: analyzablePosts.filter((document) => document.depth === 'full').length,
      postsTextProxy: analyzablePosts.filter((document) => document.sourceMode === 'text-proxy').length,
      postsMetaOnly: analyzablePosts.filter((document) => document.depth === 'partial').length,
      postsExcerptOnly: analyzablePosts.filter((document) => document.depth === 'excerpt').length,
      postsTitleOnly: analyzed.filter((document) => document.kind === 'post' && document.depth === 'title-only').length
    },
    homepageThemeCounts: Object.fromEntries(
      THEMES.map((theme) => [
        theme.id,
        analyzableHomepages.filter((document) => document.themes.includes(theme.id)).length
      ])
    ),
    homepageAnalysis: {
      companies: analyzableHomepages.length,
      weights: HOMEPAGE_PROMINENCE_WEIGHTS,
      themes: THEMES.map((theme) => ({
        id: theme.id,
        label: theme.label,
        companies: analyzableHomepages.filter((document) => document.themes.includes(theme.id)).length,
        prevalence: share(
          analyzableHomepages.filter((document) => document.themes.includes(theme.id)).length,
          analyzableHomepages.length
        ),
        focusShare: Number((analyzableHomepages.reduce(
          (sum, document) => sum + (document.homepageFocus?.shares[theme.id] || 0),
          0
        ) / Math.max(analyzableHomepages.length, 1)).toFixed(4))
      })),
      prominentTerms: homepageProminentTerms(analyzableHomepages, blocked)
    },
    trend,
    companyTrend,
    companies
  };

  await writeFile(JSON_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  await writeFile(
    JS_PATH,
    `// Generated by scripts/company-focus.mjs. Do not edit manually.\nglobalThis.COMPANY_FOCUS = ${JSON.stringify(snapshot)};\n`,
    'utf8'
  );
  console.log(JSON.stringify(snapshot.coverage, null, 2));
}

function yearsBetween(first, last) {
  const start = Date.parse(first);
  const end = Date.parse(last);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 1;
  return Math.max(1, (end - start) / (365.25 * 24 * 60 * 60 * 1000));
}

async function main() {
  const command = process.argv[2] || 'all';
  if (command === 'fetch' || command === 'all') await commandFetch();
  if (command === 'analyze' || command === 'all') await commandAnalyze();
  if (!['fetch', 'analyze', 'all'].includes(command)) {
    console.error('Usage: node scripts/company-focus.mjs [fetch|analyze|all]');
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { CACHE_DIR, JSON_PATH, readCache, loadCorpus, distinctiveTerms, yearsBetween };
