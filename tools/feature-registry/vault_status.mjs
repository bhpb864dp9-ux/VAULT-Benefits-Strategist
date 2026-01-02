/**
 * VAULT_STATUS
 *
 * Prints:
 * - registry meta + checksum
 * - current statistics
 * - ADOPTED features
 * - ACTIVE features
 *
 * Usage:
 *   node tools/feature-registry/vault_status.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

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

function main() {
  const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const registry = JSON.parse(raw);

  const adopted = registry.features.filter((f) => f.status === 'ADOPTED');
  const active = registry.features.filter((f) => f.status === 'ACTIVE');

  console.log(JSON.stringify({
    meta: registry.meta,
    statistics: registry.statistics,
    adopted: adopted.map((f) => ({
      id: f.id,
      name: f.name,
      epicId: f.epicId,
      sprint: f.sprint,
      acStatus: (f.acceptanceCriteria || []).map((a) => ({ id: a.id, status: a.status }))
    })),
    active: active.map((f) => ({
      id: f.id,
      name: f.name,
      epicId: f.epicId,
      sprint: f.sprint,
      acStatus: (f.acceptanceCriteria || []).map((a) => ({ id: a.id, status: a.status }))
    }))
  }, null, 2));
}

main();


