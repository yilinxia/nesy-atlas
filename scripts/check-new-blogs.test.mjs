import test from 'node:test';
import assert from 'node:assert/strict';

import {
  arxivIdFromUrl,
  extractArxivSubmittedDateFromFeed,
  extractPublicationDateFromHtml,
  extractPublicationDateFromText,
  formatSnapshotDate,
  updateBlogSnapshotHtml,
  normalizePublicationDate
} from './check-new-blogs.mjs';

test('updates the Posts snapshot label for the workflow run date', () => {
  const html = '<span id="blogs-updated">Snapshot Aug 5, 2026</span>';
  assert.equal(formatSnapshotDate('2026-08-10'), 'Aug 10, 2026');
  assert.equal(
    updateBlogSnapshotHtml(html, '2026-08-10'),
    '<span id="blogs-updated">Snapshot Aug 10, 2026</span>'
  );
  assert.throws(
    () => updateBlogSnapshotHtml('<span>Snapshot Aug 5, 2026</span>', '2026-08-10'),
    /Could not find #blogs-updated/
  );
});

test('uses the original arXiv submitted date instead of the revision date', () => {
  const feed = `
    <entry>
      <updated>2025-11-03T15:21:13Z</updated>
      <published>2025-08-05T17:24:50Z</published>
    </entry>`;
  assert.equal(arxivIdFromUrl('https://arxiv.org/abs/2508.03665v4'), '2508.03665');
  assert.equal(extractArxivSubmittedDateFromFeed(feed), '2025-08-05');
});

test('normalizes common publication-date formats', () => {
  assert.equal(normalizePublicationDate('11/18/2025'), '2025-11-18');
  assert.equal(normalizePublicationDate('18 November 2025'), '2025-11-18');
  assert.equal(normalizePublicationDate('November 18th, 2025'), '2025-11-18');
  assert.equal(normalizePublicationDate('2025-11-18T14:30:00Z'), '2025-11-18');
});

test('extracts datePublished from JSON-LD', () => {
  const html = `
    <script type="application/ld+json">
      {"@type":"BlogPosting","datePublished":"2025-11-18T09:00:00-08:00"}
    </script>`;
  assert.equal(extractPublicationDateFromHtml(html), '2025-11-18');
});

test('extracts publication metadata regardless of attribute order', () => {
  assert.equal(
    extractPublicationDateFromHtml('<meta content="2025-11-18" property="article:published_time">'),
    '2025-11-18'
  );
});

test('extracts visible article and proxy dates', () => {
  assert.equal(
    extractPublicationDateFromHtml('<article><h1>Welcoming Zac Maufe</h1><p>Published: 11/18/2025</p></article>'),
    '2025-11-18'
  );
  assert.equal(
    extractPublicationDateFromText('Published Time: November 18, 2025\n\nArticle copy'),
    '2025-11-18'
  );
  assert.equal(
    extractPublicationDateFromHtml('<article><h1>Welcoming Zac Maufe</h1><div>11/18/2025</div></article>'),
    '2025-11-18'
  );
});
