/**
 * VAULT Feature Scanner (code annotations)
 *
 * Scans for `@vault-feature <ID> <Name>` in the codebase.
 *
 * Usage:
 *   node tools/feature-registry/scan-code.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET = path.join(ROOT, 'src');
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'dev-dist', '.git']);

const RX = /@vault-feature\s+(VAULT-[A-Z]+(?:-[A-Z]{2,3})?-\d{3})\s*(.*)$/gm;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile()) {
      if (!/\.(ts|tsx|js|jsx|md)$/.test(entry.name)) continue;
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function main() {
  const files = walk(TARGET);
  const found = [];

  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = RX.exec(text))) {
      found.push({
        id: m[1],
        label: (m[2] || '').trim() || null,
        file: path.relative(ROOT, f)
      });
    }
  }

  found.sort((a, b) => a.id.localeCompare(b.id));
  console.log(JSON.stringify({ count: found.length, features: found }, null, 2));
}

main();


