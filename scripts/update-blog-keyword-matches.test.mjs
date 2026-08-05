import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyPost, extractArticleText } from './update-blog-keyword-matches.mjs';

test('classifies explicit neurosymbolic variants in either title or content', () => {
  assert.deepEqual(classifyPost('A NeSy update', 'General article copy'), {
    match: true,
    matchedIn: ['title']
  });
  assert.deepEqual(classifyPost('A planning update', 'Our neural-symbolic approach is explainable.'), {
    match: true,
    matchedIn: ['content']
  });
  assert.deepEqual(classifyPost('Symbolic planning', 'Neural networks are also discussed.'), {
    match: false,
    matchedIn: []
  });
});

test('extracts article content without matching site navigation', () => {
  const html = `
    <html><body>
      <nav>Our neurosymbolic platform</nav>
      <main><article><h1>Planning</h1><p>Ordinary article content.</p></article></main>
    </body></html>`;
  assert.equal(extractArticleText(html), 'Planning Ordinary article content.');
  assert.equal(classifyPost('Planning', extractArticleText(html)).match, false);
});

test('prefers structured articleBody metadata', () => {
  const html = `
    <script type="application/ld+json">{"@type":"Article","articleBody":"A neuro symbolic method."}</script>
    <article>Fallback copy</article>`;
  assert.equal(extractArticleText(html), 'A neuro symbolic method.');
});
