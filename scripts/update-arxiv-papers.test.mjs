import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  assertSafeFullRefresh,
  buildDataScript,
  buildSearchQuery,
  fetchPapers,
  matchedKeywords,
  main,
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

async function refreshFixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'arxiv-refresh-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const outputPath = join(directory, 'papers.js');
  const original = buildDataScript(parseArxivFeed(feed), '2026-08-05T00:00:00.000Z');
  await writeFile(outputPath, original);
  return {
    outputPath,
    original,
    options: {
      args: ['--output', outputPath, '--allow-stale'],
      fetchOptions: { retryAttempts: 2, sleepImpl: async () => {}, onRetry: () => {} },
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_OUTPUT: join(directory, 'output'),
        GITHUB_STEP_SUMMARY: join(directory, 'summary')
      },
      warn: () => {}
    }
  };
}

for (const full of [false, true]) {
  test(`preserves snapshot and cursor after exhausted 429s (${full ? 'full' : 'incremental'})`, async (t) => {
    const { outputPath, original, options } = await refreshFixture(t);
    if (full) options.args.push('--full');
    let attempts = 0;
    const warnings = [];
    const result = await main({
      ...options,
      warn: (message) => warnings.push(message),
      fetchImpl: async () => {
        attempts += 1;
        return new Response('Rate exceeded', { status: 429 });
      }
    });
    assert.equal(attempts, 2);
    assert.deepEqual(result, { refreshed: false });
    assert.equal(await readFile(outputPath, 'utf8'), original);
    assert.equal(await readFile(options.env.GITHUB_OUTPUT, 'utf8'), 'refreshed=false\n');
    assert.match(await readFile(options.env.GITHUB_STEP_SUMMARY, 'utf8'), /cursor 2026-08-05/);
    assert.match(warnings[0], /^::warning::arXiv refresh deferred/);
  });
}

test('discards partial pages when a later page is rate limited', async (t) => {
  const { outputPath, original, options } = await refreshFixture(t);
  let attempts = 0;
  await main({
    ...options,
    fetchImpl: async () => ++attempts === 1
      ? new Response(feed.replace('totalResults>2<', 'totalResults>501<'))
      : new Response('', { status: 429 })
  });
  assert.equal(attempts, 3);
  assert.equal(await readFile(outputPath, 'utf8'), original);
});

for (const status of [400, 403, 200]) {
  test(`does not suppress permanent HTTP errors or malformed feeds (${status})`, async (t) => {
    const { outputPath, original, options } = await refreshFixture(t);
    await assert.rejects(main({ ...options, fetchImpl: async () => new Response('bad feed', { status }) }));
    assert.equal(await readFile(outputPath, 'utf8'), original);
    await assert.rejects(readFile(options.env.GITHUB_OUTPUT), { code: 'ENOENT' });
  });
}

test('manual refreshes and refreshes without usable snapshots still fail on 429', async (t) => {
  const { outputPath, options } = await refreshFixture(t);
  const fetchImpl = async () => new Response('', { status: 429 });
  await assert.rejects(main({ ...options, args: ['--output', outputPath], fetchImpl }), /HTTP 429/);
  await rm(outputPath);
  await assert.rejects(main({ ...options, fetchImpl }), /HTTP 429/);
  await writeFile(outputPath, buildDataScript([], '2026-08-05T00:00:00.000Z'));
  await assert.rejects(main({ ...options, args: [...options.args, '--full'], fetchImpl }), /HTTP 429/);
});

test('defers exhausted network errors and server failures', async (t) => {
  const { outputPath, original, options } = await refreshFixture(t);
  for (const fetchImpl of [
    async () => { throw new TypeError('fetch failed'); },
    async () => new Response('', { status: 503 })
  ]) {
    assert.deepEqual(await main({ ...options, fetchImpl }), { refreshed: false });
    assert.equal(await readFile(outputPath, 'utf8'), original);
  }
});

test('a successful refresh after deferral queries from the preserved cursor', async (t) => {
  const { outputPath, options } = await refreshFixture(t);
  await main({ ...options, fetchImpl: async () => new Response('', { status: 429 }) });
  let query;
  const result = await main({
    ...options,
    fetchImpl: async (url) => {
      query = new URL(url).searchParams.get('search_query');
      return new Response(feed);
    }
  });
  assert.deepEqual(result, { refreshed: true });
  assert.match(query, /submittedDate:\[202607290000 TO/);
  const snapshot = parseDataScript(await readFile(outputPath, 'utf8'));
  assert.equal(snapshot.papers.length, 2);
  assert.notEqual(snapshot.metadata.cursorAt, '2026-08-05T00:00:00.000Z');
  assert.match(await readFile(options.env.GITHUB_OUTPUT, 'utf8'), /refreshed=true\n$/);
});
