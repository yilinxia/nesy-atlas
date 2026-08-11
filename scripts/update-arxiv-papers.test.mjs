import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertSafeFullRefresh,
  buildDataScript,
  buildSearchQuery,
  fetchPapers,
  matchedKeywords,
  mergePaperSnapshots,
  parseArxivFeed,
  parseDataScript,
  parseTotalResults
} from './update-arxiv-papers.mjs';

const feed = `
  <feed xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:arxiv="http://arxiv.org/schemas/atom">
    <opensearch:totalResults>2</opensearch:totalResults>
    <entry>
      <id>http://arxiv.org/abs/2608.00001v2</id>
      <title>A Neuro-Symbolic System &amp; Benchmark</title>
      <summary>We present a hybrid system.</summary>
      <published>2026-08-01T00:00:00Z</published>
      <updated>2026-08-02T00:00:00Z</updated>
      <category term="cs.AI" />
      <arxiv:primary_category term="cs.AI" />
      <author>
        <name>Ada Lovelace</name>
        <arxiv:affiliation>Analytical Engine Institute</arxiv:affiliation>
        <arxiv:affiliation>Royal Society</arxiv:affiliation>
      </author>
    </entry>
    <entry>
      <id>http://arxiv.org/abs/2608.00002v1</id>
      <title>An unrelated title</title>
      <summary>This abstract studies neural symbolic reasoning.</summary>
      <published>2026-08-02T00:00:00Z</published>
      <updated>2026-08-02T00:00:00Z</updated>
      <category term="cs.LG" />
      <author><name>Grace Hopper</name></author>
    </entry>
  </feed>`;

test('matches explicit neurosymbolic keyword variants', () => {
  assert.deepEqual(
    matchedKeywords('Neurosymbolic, neuro-symbolic, neural symbolic, and NeSy'),
    ['neurosymbolic', 'neuro-symbolic', 'neural symbolic', 'NeSy']
  );
});

test('parses and normalizes qualifying arXiv entries', () => {
  const papers = parseArxivFeed(feed);
  assert.equal(parseTotalResults(feed), 2);
  assert.equal(papers.length, 2);
  assert.equal(papers[0].id, '2608.00001');
  assert.equal(papers[0].title, 'A Neuro-Symbolic System & Benchmark');
  assert.deepEqual(papers[0].authors, ['Ada Lovelace']);
  assert.deepEqual(papers[0].authorAffiliations, [{
    name: 'Ada Lovelace',
    affiliations: ['Analytical Engine Institute', 'Royal Society']
  }]);
  assert.deepEqual(papers[0].affiliations, ['Analytical Engine Institute', 'Royal Society']);
  assert.deepEqual(papers[0].matches.title, ['neuro-symbolic']);
  assert.deepEqual(papers[1].matches.abstract, ['neural symbolic']);
});

test('builds a browser-ready data snapshot', () => {
  const output = buildDataScript(parseArxivFeed(feed), '2026-08-05T00:00:00.000Z', {
    refreshMode: 'incremental',
    lastFullRefreshAt: '2026-08-03T00:00:00.000Z',
    lookbackDays: 7
  });
  assert.match(output, /globalThis\.ARXIV_PAPERS_META/);
  assert.match(output, /globalThis\.ARXIV_PAPERS =/);
  assert.match(output, /2608\.00001/);
  const snapshot = parseDataScript(output);
  assert.equal(snapshot.metadata.cursorAt, '2026-08-05T00:00:00.000Z');
  assert.equal(snapshot.metadata.refreshMode, 'incremental');
  assert.equal(snapshot.metadata.lastFullRefreshAt, '2026-08-03T00:00:00.000Z');
  assert.equal(snapshot.papers.length, 2);
});

test('builds a bounded submitted-date query for incremental refreshes', () => {
  const incrementalQuery = buildSearchQuery(
    '2026-08-03T12:34:00.000Z',
    '2026-08-11T13:45:00.000Z'
  );
  assert.match(incrementalQuery, /submittedDate:\[202608031234 TO 202608111345\]/);
  assert.match(incrementalQuery, /all:neurosymbolic/);
});

test('merges incremental papers by arXiv ID without deleting older records', () => {
  const existing = parseArxivFeed(feed);
  const revised = { ...existing[0], title: 'Revised title', updated: '2026-08-09' };
  const added = { ...existing[1], id: '2608.00003', published: '2026-08-08', updated: '2026-08-08' };
  const merged = mergePaperSnapshots(existing, [revised, added]);

  assert.equal(merged.length, 3);
  assert.equal(merged.find((paper) => paper.id === revised.id).title, 'Revised title');
  assert.ok(merged.some((paper) => paper.id === existing[1].id));
  assert.equal(merged[0].id, added.id);
});

test('rejects suspicious full-refresh results before replacing the snapshot', () => {
  const existing = Array.from({ length: 10 }, (_, index) => ({ id: String(index) }));
  assert.throws(() => assertSafeFullRefresh(existing, []), /returned no qualifying papers/);
  assert.throws(() => assertSafeFullRefresh(existing, existing.slice(0, 7)), /looks incomplete/);
  assert.doesNotThrow(() => assertSafeFullRefresh(existing, existing.slice(0, 8)));
});

test('retries a rate-limited arXiv page before parsing it', async () => {
  const responses = [
    new Response('Rate exceeded.', { status: 429, headers: { 'Retry-After': '2' } }),
    new Response(feed, { status: 200 })
  ];
  const delays = [];
  const retries = [];
  const papers = await fetchPapers(async () => responses.shift(), {
    sleepImpl: async (delayMs) => { delays.push(delayMs); },
    retryBaseDelayMs: 100,
    retryMaxDelayMs: 5000,
    randomImpl: () => 0,
    onRetry: (retry) => { retries.push(retry.reason); }
  });

  assert.equal(papers.length, 2);
  assert.deepEqual(delays, [2000]);
  assert.deepEqual(retries, ['HTTP 429']);
});

test('rejects a malformed successful response instead of replacing paper data', async () => {
  await assert.rejects(
    () => fetchPapers(async () => new Response('<html>temporary error</html>', { status: 200 })),
    /malformed feed/
  );
});
