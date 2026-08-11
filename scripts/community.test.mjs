import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function loadCommunity() {
  const source = await readFile(new URL('../data/community.js', import.meta.url), 'utf8');
  const context = { globalThis: {} };
  vm.runInNewContext(source, context);
  return context.globalThis.NESY_COMMUNITY;
}

test('community resources are complete, unique, and source-backed', async () => {
  const community = await loadCommunity();
  const items = community.sections.flatMap((section) => section.items);
  const ids = items.map((item) => item.id);

  assert.match(community.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(
    Array.from(community.sections, (section) => section.id).join(','),
    'organizations,independent'
  );
  assert.equal(items.length, 4);
  assert.equal(new Set(ids).size, ids.length, 'resource IDs are unique');
  assert.ok(ids.includes('centaur-institute'));
  assert.ok(ids.includes('nesy-ai-association'));
  assert.ok(ids.includes('neus-community'));
  assert.ok(ids.includes('nesy-mailing-list'));

  for (const item of items) {
    assert.ok(item.name, `${item.id} has a name`);
    assert.ok(item.description, `${item.id} has a description`);
    assert.ok(item.evidence, `${item.id} has a source note`);
    assert.ok(item.action, `${item.id} has an action label`);
    assert.match(item.url, /^https:\/\//, `${item.id} uses HTTPS`);
    if (item.logo) assert.match(item.logo, /^https:\/\//, `${item.id} has an HTTPS logo`);
    if (item.logoFallback) assert.match(item.logoFallback, /^.{1,3}$/, `${item.id} has a compact logo fallback`);
    if (item.sourceUrl) assert.match(item.sourceUrl, /^https:\/\//, `${item.id} source uses HTTPS`);
    for (const related of [...(item.socials || []), ...(item.programs || [])]) {
      assert.ok(related.name, `${item.id} related link has a name`);
      assert.match(related.url, /^https:\/\//, `${item.id} related link uses HTTPS`);
    }
  }

  const centaur = items.find((item) => item.id === 'centaur-institute');
  assert.equal(centaur.socials[0].name, 'Discord');
  assert.equal(centaur.programs[0].name, 'Neuro-Symbolic AI Summer School');

  const neus = items.find((item) => item.id === 'neus-community');
  const mailingList = items.find((item) => item.id === 'nesy-mailing-list');
  assert.equal(neus.logo, 'https://raw.githubusercontent.com/NeuS-2025/NeuS-2025.github.io/main/files/favicon.png');
  assert.equal(mailingList.logo, undefined, 'the NeSy mailing list does not display an organization logo');
});
