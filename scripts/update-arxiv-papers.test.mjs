import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDataScript,
  matchedKeywords,
  parseArxivFeed,
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
  const output = buildDataScript(parseArxivFeed(feed), '2026-08-05T00:00:00.000Z');
  assert.match(output, /globalThis\.ARXIV_PAPERS_META/);
  assert.match(output, /globalThis\.ARXIV_PAPERS =/);
  assert.match(output, /2608\.00001/);
});
