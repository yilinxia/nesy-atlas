import assert from 'node:assert/strict';
import test from 'node:test';

import { buildO9Snapshot, normalizeO9Record } from './update-o9-posts.mjs';

test('normalizes o9 WordPress records to public website URLs', () => {
  const record = normalizeO9Record({
    id: 125555,
    date: '2026-07-31T15:42:41',
    link: 'https://cms.o9solutions.com/articles/ai-powered-category-management-planning/',
    title: { rendered: 'AI &amp; Category Management' },
    excerpt: { rendered: '<p>A planning example.</p>' },
    content: { rendered: '<p>The full article discusses neuro-symbolic systems.</p>' }
  }, { sourceType: 'post', type: 'Blog', path: 'articles' });
  assert.deepEqual(record, {
    title: 'AI & Category Management',
    excerpt: 'A planning example.',
    neurosymbolicMatch: true,
    date: '2026-07-31',
    url: 'https://o9solutions.com/articles/ai-powered-category-management-planning',
    type: 'Blog',
    sourceType: 'post',
    sourceId: 125555
  });
});

test('builds a deduplicated, date-sorted o9 snapshot', () => {
  const post = {
    id: 1, date: '2026-07-31T00:00:00',
    link: 'https://cms.o9solutions.com/articles/example/',
    title: { rendered: 'Example article' }
  };
  const resource = {
    id: 2, date: '2026-08-01T00:00:00',
    link: 'https://cms.o9solutions.com/resources/example-guide/',
    title: { rendered: 'Example guide' }
  };
  const snapshot = buildO9Snapshot({ post: [post, post], resource: [resource] }, '2026-08-05T00:00:00.000Z');
  assert.deepEqual(snapshot.counts, { post: 1, resource: 1, total: 2 });
  assert.deepEqual(snapshot.posts.map((item) => item.title), ['Example guide', 'Example article']);
});
