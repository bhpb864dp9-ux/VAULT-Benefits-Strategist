/**
 * VAULT Immutable Feature Registry Validator
 *
 * Validates:
 * - ID patterns (Theme/Epic/Feature/Criteria)
 * - Basic referential integrity (feature.epicId exists)
 * - Checksum integrity for records + registry meta
 *
 * Usage:
 *   node tools/feature-registry/validate.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const DEFAULT_REGISTRY_PATH = path.join(ROOT, 'registry', 'v1', 'feature-registry.v1.0.0.json');

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  const withEq = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (withEq) return withEq.slice(flag.length + 1);
  return null;
}

const REGISTRY_PATH =
  process.env.VAULT_REGISTRY_PATH ||
  getArgValue('--file') ||
  DEFAULT_REGISTRY_PATH;

const RX = {
  theme: /^VAULT-TH-\d{3}$/,
  epic: /^VAULT-EP-\d{3}$/,
  // Per schema section 1.3:
  // - Standard features: VAULT-(F|AR|TC|INT|UI)-[EPIC]-XXX
  // - Accessibility: VAULT-ACC-XXX
  // - Security: VAULT-SEC-[TYPE]-XXX
  // - Non-functional: VAULT-NF-[TYPE]-XXX
  feature: /^(VAULT-(F|AR|TC|INT|UI)-[A-Z]{2}-\d{3}|VAULT-ACC-\d{3}|VAULT-SEC-[A-Z]{2,3}-\d{3}|VAULT-NF-[A-Z]{2,3}-\d{3})$/,
  criteria: /^AC-\d{3}$/
};

function stableSortKeys(value) {
  if (Array.isArray(value)) return value.map(stableSortKeys);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = stableSortKeys(value[k]);
    return out;
  }
  return value;
}

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function checksumEntity(entity) {
  const cloned = JSON.parse(JSON.stringify(entity));
  if (cloned?.metadata?.checksum) cloned.metadata.checksum = '';
  const stable = JSON.stringify(stableSortKeys(cloned));
  return sha256Hex(stable);
}

function checksumRegistryMeta(registry) {
  const cloned = JSON.parse(JSON.stringify(registry));
  if (cloned?.meta?.checksum) cloned.meta.checksum = '';
  // exclude audit log from checksum (append-only and optional), keep it deterministic for snapshot
  const stable = JSON.stringify(stableSortKeys(cloned));
  return sha256Hex(stable);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function main() {
  assert(fs.existsSync(REGISTRY_PATH), `Registry file missing: ${REGISTRY_PATH}`);
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const registry = JSON.parse(raw);

  // Meta
  assert(registry?.meta?.schemaVersion === '1.0.0', `Unexpected schemaVersion: ${registry?.meta?.schemaVersion}`);

  // Themes
  for (const t of registry.themes || []) {
    assert(RX.theme.test(t.id), `Invalid Theme ID: ${t.id}`);
    const cs = checksumEntity(t);
    assert(t?.metadata?.checksum === cs, `Theme checksum mismatch ${t.id}: expected ${cs}, got ${t?.metadata?.checksum}`);
  }

  // Epics
  const epicIds = new Set();
  for (const e of registry.epics || []) {
    assert(RX.epic.test(e.id), `Invalid Epic ID: ${e.id}`);
    epicIds.add(e.id);
    const cs = checksumEntity(e);
    assert(e?.metadata?.checksum === cs, `Epic checksum mismatch ${e.id}: expected ${cs}, got ${e?.metadata?.checksum}`);
  }

  // Features
  for (const f of registry.features || []) {
    assert(RX.feature.test(f.id), `Invalid Feature ID: ${f.id}`);
    assert(epicIds.has(f.epicId), `Feature ${f.id} references missing epicId ${f.epicId}`);
    for (const ac of f.acceptanceCriteria || []) {
      assert(RX.criteria.test(ac.id), `Invalid Criteria ID: ${ac.id} in feature ${f.id}`);
    }
    const cs = checksumEntity(f);
    assert(f?.metadata?.checksum === cs, `Feature checksum mismatch ${f.id}: expected ${cs}, got ${f?.metadata?.checksum}`);
  }

  // Registry meta checksum
  const expectedMetaChecksum = checksumRegistryMeta(registry);
  assert(registry.meta.checksum === expectedMetaChecksum, `Registry meta checksum mismatch: expected ${expectedMetaChecksum}, got ${registry.meta.checksum}`);

  console.log(`OK: Registry validated (${REGISTRY_PATH})`);
  console.log(`- Themes: ${registry.themes?.length || 0}`);
  console.log(`- Epics: ${registry.epics?.length || 0}`);
  console.log(`- Features: ${registry.features?.length || 0}`);
}

main();


