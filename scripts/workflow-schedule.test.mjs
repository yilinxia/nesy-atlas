import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflows = [
  '../.github/workflows/check-blogs.yml',
  '../.github/workflows/update-arxiv-papers.yml'
];

for (const relativePath of workflows) {
  test(`${relativePath} runs daily at 7 AM Chicago time`, async () => {
    const workflow = await readFile(new URL(relativePath, import.meta.url), 'utf8');
    assert.match(workflow, /- cron: '0 7 \* \* \*'\s+timezone: 'America\/Chicago'/);
    assert.match(workflow, /for attempt in 1 2 3;/);
    assert.match(workflow, /git pull --rebase origin main/);
    if (relativePath.includes('arxiv')) {
      assert.match(workflow, /TZ=America\/Chicago date \+%u/);
      assert.match(workflow, /update-arxiv-papers\.mjs --full/);
    }
  });
}
