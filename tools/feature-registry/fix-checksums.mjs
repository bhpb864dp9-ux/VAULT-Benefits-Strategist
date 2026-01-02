/**
 * VAULT Registry Checksum Fixer (one-time helper)
 *
 * Fills placeholder checksums in `registry/v1/feature-registry.v1.0.0.json`.
 *
 * Usage:
 *   node tools/feature-registry/fix-checksums.mjs
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
  return sha256Hex(JSON.stringify(stableSortKeys(cloned)));
}

function checksumRegistryMeta(registry) {
  const cloned = JSON.parse(JSON.stringify(registry));
  if (cloned?.meta?.checksum) cloned.meta.checksum = '';
  return sha256Hex(JSON.stringify(stableSortKeys(cloned)));
}

function main() {
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const registry = JSON.parse(raw);

  for (const t of registry.themes || []) {
    t.metadata.checksum = checksumEntity(t);
  }
  for (const e of registry.epics || []) {
    e.metadata.checksum = checksumEntity(e);
  }
  for (const f of registry.features || []) {
    f.metadata.checksum = checksumEntity(f);
  }

  registry.meta.checksum = checksumRegistryMeta(registry);

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n', 'utf8');
  console.log(`Updated checksums: ${REGISTRY_PATH}`);
}

main();


