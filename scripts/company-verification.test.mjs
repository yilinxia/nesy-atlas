import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function loadOrganizations() {
  const source = await readFile(new URL('../data/companies.js', import.meta.url), 'utf8');
  const context = { globalThis: { O9_POSTS: [] } };
  vm.runInNewContext(source, context);
  return context.globalThis.COMPANY_DIRECTORY;
}

async function loadVerification() {
  const source = await readFile(new URL('../data/company-verification.js', import.meta.url), 'utf8');
  const context = { globalThis: {} };
  vm.runInNewContext(source, context);
  return context.globalThis.COMPANY_VERIFICATION;
}

test('every directory company has complete, source-backed inclusion evidence', async () => {
  const [organizations, verification] = await Promise.all([
    loadOrganizations(),
    loadVerification()
  ]);
  const companyNames = Array.from(organizations, ({ name }) => name).sort();
  const evidenceNames = Object.keys(verification.companies).sort();

  assert.deepEqual(evidenceNames, companyNames);
  assert.match(verification.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);

  for (const companyName of companyNames) {
    const evidence = verification.companies[companyName];
    assert.ok(evidence.criterion, `${companyName} has a criterion`);
    assert.ok(evidence.summary, `${companyName} has a summary`);
    assert.ok(evidence.sources.length > 0, `${companyName} has at least one source`);
    for (const source of evidence.sources) {
      assert.ok(source.label, `${companyName} source has a pointer label`);
      assert.match(source.url, /^https:\/\//, `${companyName} source uses HTTPS`);
      assert.ok(source.quote.length >= 10, `${companyName} source includes a meaningful quote`);
    }
  }
});
