#!/usr/bin/env node

import { access, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_PATH = resolve(ROOT, 'index.html');
const INITIAL_SCRIPT_BUDGET = 1_000_000;

function fail(message) {
  console.error(`Static check failed: ${message}`);
  process.exitCode = 1;
}

async function existingLocalReferences(html) {
  const references = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => !reference.includes(':') && !reference.startsWith('#'));
  for (const reference of references) {
    try {
      await access(resolve(ROOT, reference));
    } catch {
      fail(`index.html references missing file: ${reference}`);
    }
  }
  return references;
}

function checkJavaScriptSyntax(files) {
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', resolve(ROOT, file)], { encoding: 'utf8' });
    if (result.status !== 0) fail(`${file} does not parse\n${result.stderr.trim()}`);
  }
}

async function main() {
  const html = await readFile(INDEX_PATH, 'utf8');
  const references = await existingLocalReferences(html);
  const initialScripts = references.filter((reference) => reference.endsWith('.js'));
  const initialBytes = (await Promise.all(initialScripts.map(async (file) => (await stat(resolve(ROOT, file))).size)))
    .reduce((total, size) => total + size, 0);

  if (references.includes('data/research-papers.js')) {
    fail('the full paper corpus must not be loaded on the initial page');
  }
  if (initialBytes > INITIAL_SCRIPT_BUDGET) {
    fail(`initial local JavaScript is ${initialBytes.toLocaleString()} bytes; budget is ${INITIAL_SCRIPT_BUDGET.toLocaleString()}`);
  }

  try {
    await access(resolve(ROOT, '_t2.html'));
    fail('_t2.html is an obsolete test artifact and must not be committed');
  } catch {
    // Expected: the obsolete test artifact is absent.
  }

  checkJavaScriptSyntax([
    'script.js',
    'data/companies.js',
    'data/company-verification.js',
    'data/books.js'
  ]);

  if (!process.exitCode) {
    console.log(`Static checks passed. Initial local JavaScript: ${initialBytes.toLocaleString()} bytes.`);
  }
}

main().catch((error) => {
  fail(error.stack || error.message);
});
