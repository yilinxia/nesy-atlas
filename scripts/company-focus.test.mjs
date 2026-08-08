import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDocumentPlan,
  extractClientAssetUrls,
  extractHomepageProminence,
  extractReadableScriptText,
  extractTextProxyPage,
  homepageThemeProfile,
  metaDescription,
  periodOf,
  stripChrome,
  termsOf,
  themeHits
} from './company-focus.mjs';

test('themeHits tags a document once per matching theme', () => {
  const hits = themeHits('Our neuro-symbolic engine pairs an LLM with a knowledge graph for explainable underwriting.');
  assert.deepEqual(hits.sort(), ['finance', 'knowledge', 'llm', 'neurosymbolic', 'trust'].sort());
});

test('themeHits stays quiet on unrelated marketing copy', () => {
  assert.deepEqual(themeHits('We are hiring designers in Berlin.'), []);
});

test('periodOf buckets by year, half, and quarter', () => {
  assert.equal(periodOf('2025-08-14', 'year'), '2025');
  assert.equal(periodOf('2025-08-14', 'half'), '2025-H2');
  assert.equal(periodOf('2025-06-30', 'half'), '2025-H1');
  assert.equal(periodOf('2025-08-14', 'quarter'), '2025-Q3');
  assert.equal(periodOf('', 'half'), '');
  assert.equal(periodOf('not a date', 'half'), '');
});

test('stripChrome removes consent banners, captions, and footnote markers', () => {
  const text = 'Reasoning matters. This website uses cookies to improve your experience. Press enter or click to view image in full size Symbolic proofs stay auditable.';
  const cleaned = stripChrome(text);
  assert.match(cleaned, /Reasoning matters/);
  assert.match(cleaned, /Symbolic proofs stay auditable/);
  assert.doesNotMatch(cleaned, /cookies/i);
  assert.doesNotMatch(cleaned, /full size/i);
});

test('stripChrome removes author credit lines but keeps the body', () => {
  const cleaned = stripChrome('MetaCOG Article: Ravi Deedwania , Julian Jara-Ettinger | July 16, 2024 we introduce a probabilistic model.');
  assert.doesNotMatch(cleaned, /Deedwania/);
  assert.match(cleaned, /probabilistic model/);
});

test('termsOf yields unigrams and bigrams while honouring blocked identity terms', () => {
  const terms = termsOf('Acme builds ontology tooling', new Set(['acme']));
  assert.ok(terms.includes('ontology'));
  assert.ok(terms.includes('ontology tooling'));
  assert.ok(!terms.some((term) => term.includes('acme')));
});

test('termsOf drops repeated-token bigrams from echoed headings', () => {
  assert.ok(!termsOf('Cognaize Cognaize ontology', new Set()).includes('cognaize cognaize'));
});

test('metaDescription reads either meta name or og:description', () => {
  assert.equal(metaDescription('<meta name="description" content="Neurosymbolic search">'), 'Neurosymbolic search');
  assert.equal(metaDescription('<meta property="og:description" content="Hybrid reasoning">'), 'Hybrid reasoning');
  assert.equal(metaDescription('<p>no meta here</p>'), '');
});

test('extractHomepageProminence keeps semantic hero headings and removes navigation', () => {
  const prominence = extractHomepageProminence(`
    <html><head><title>Hybrid AI for decisions</title></head><body>
      <nav><h1>Menu</h1></nav>
      <header><h1>Trusted agents that reason</h1></header>
      <main><h2>Governed workflows</h2><h3>Built for banks</h3></main>
    </body></html>`);
  assert.equal(prominence.title, 'Hybrid AI for decisions');
  assert.deepEqual(prominence.headings, [
    { level: 1, text: 'Trusted agents that reason' },
    { level: 2, text: 'Governed workflows' },
    { level: 3, text: 'Built for banks' }
  ]);
});

test('extractReadableScriptText recovers visible copy from a compiled JSX bundle', () => {
  const text = extractReadableScriptText(`
    const runtime = "return function(){throw new Error('internal')}";
    const hero = { children: "A self-reinforcing cycle of collective intelligence powered by federated learning." };
    const detail = \`<p>Neuro-symbolic reasoning keeps every decision explainable and auditable.</p>\`;
  `);
  assert.match(text, /collective intelligence/);
  assert.match(text, /Neuro-symbolic reasoning/);
  assert.doesNotMatch(text, /throw new Error/);
});

test('extractClientAssetUrls selects same-origin app and home bundles', () => {
  const urls = extractClientAssetUrls(`
    <script type="module" src="/assets/app-123.js"></script>
    <link rel="modulepreload" href="/assets/home-456.js">
    <script src="https://tracker.example/pixel.js"></script>
  `, 'https://acme.example/');
  assert.deepEqual(urls, [
    'https://acme.example/assets/app-123.js',
    'https://acme.example/assets/home-456.js'
  ]);
});

test('extractTextProxyPage preserves proxy provenance headings and body copy', () => {
  const page = extractTextProxyPage(`Title: QGI | Deterministic AI
URL Source: https://qgi.dev/

Markdown Content:
# Deterministic AI.
Under your control.
## Hybrid models
Language and symbolic reasoning work together.`);
  assert.equal(page.title, 'QGI | Deterministic AI');
  assert.match(page.text, /symbolic reasoning/);
  assert.deepEqual(page.homepageProminence.headings.map((heading) => heading.level), [1, 2]);
});

test('homepageThemeProfile gives prominent headings more weight than body copy', () => {
  const profile = homepageThemeProfile('Governance for enterprises.', {
    title: '',
    headings: [{ level: 1, text: 'Neurosymbolic reasoning' }]
  });
  assert.equal(profile.scores.governance, 1);
  assert.equal(profile.scores.neurosymbolic, 5);
  assert.equal(profile.scores.reasoning, 5);
  assert.ok(profile.shares.neurosymbolic > profile.shares.governance);
});

test('buildDocumentPlan emits one homepage plus every post, reusing snapshot excerpts', () => {
  const plan = buildDocumentPlan([
    {
      name: 'Acme',
      website: 'https://acme.example/',
      posts: [
        { title: 'First', date: '2025-01-02', url: 'https://acme.example/a' },
        { title: 'Second', date: '2025-02-02', url: 'https://acme.example/b', excerpt: 'cached body' }
      ]
    }
  ]);
  assert.equal(plan.length, 3);
  assert.equal(plan[0].kind, 'homepage');
  assert.equal(plan[1].inlineText, '');
  assert.equal(plan[2].inlineText, 'cached body');
});

test('buildDocumentPlan falls back to the single featured post when no list exists', () => {
  const plan = buildDocumentPlan([
    { name: 'Solo', website: 'https://solo.example/', postTitle: 'Only', postDate: '2026-01-01', postUrl: 'https://solo.example/only' }
  ]);
  assert.deepEqual(plan.map((document) => document.kind), ['homepage', 'post']);
  assert.equal(plan[1].title, 'Only');
});
