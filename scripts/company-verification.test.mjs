import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function loadOrganizations() {
  const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');
  const marker = 'const organizations = ';
  const start = source.indexOf(marker) + marker.length;
  const end = source.indexOf('\n];', start) + 2;
  assert.ok(start >= marker.length && end > start, 'organizations array is present');
  return Function('o9Posts', `return (${source.slice(start, end)})`)([]);
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
  const companyNames = organizations.map(({ name }) => name).sort();
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
