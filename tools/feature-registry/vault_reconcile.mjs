/**
 * VAULT_RECONCILE
 *
 * Enforces the "Cursor AI Reconciliation Directive" version lock against the
 * immutable registry.
 *
 * Usage:
 *   node tools/feature-registry/vault_reconcile.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'registry', 'v1', 'feature-registry.v1.0.0.json');
const DIRECTIVE_PATH = path.join(ROOT, 'docs', 'CURSOR-DIR-2026-001.md');

const VERSION_LOCK = {
  executionPlan: '6.0.0',
  registryId: 'VAULT-FEATURE-REGISTRY-IMMUTABLE-001',
  registryChecksum: '6a57635e745b821259a89d6e210fd03e3c4cdac95108c292ab40610808c5461a',
  schemaVersion: '1.0.0',
  corporateEntity: 'VAULT LLC',
  parentCorporation: 'Northstar|Insight Inc.'
};

function assert(cond, msg) {
  if (!cond) {
    console.error(`VAULT_RECONCILE FAIL: ${msg}`);
    process.exit(1);
  }
}

function main() {
  assert(fs.existsSync(DIRECTIVE_PATH), `Missing directive doc: ${DIRECTIVE_PATH}`);
  assert(fs.existsSync(REGISTRY_PATH), `Missing registry: ${REGISTRY_PATH}`);

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  assert(registry?.meta?.id === VERSION_LOCK.registryId, `registryId mismatch (${registry?.meta?.id})`);
  assert(registry?.meta?.schemaVersion === VERSION_LOCK.schemaVersion, `schemaVersion mismatch (${registry?.meta?.schemaVersion})`);
  assert(registry?.meta?.checksum === VERSION_LOCK.registryChecksum, `registryChecksum mismatch (${registry?.meta?.checksum})`);

  console.log('VAULT_RECONCILE OK');
  console.log(JSON.stringify({ VERSION_LOCK, registryMeta: registry.meta }, null, 2));
}

main();


