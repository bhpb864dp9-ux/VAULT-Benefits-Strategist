/**
 * VAULT Repo Doctor (ADH-MOSA safe cleanup + consistency checks)
 *
 * Goals:
 * - Make it unambiguous what to run and where.
 * - Detect (and optionally safely fix) common duplicate/stray repo paths.
 * - Validate essential ADH-MOSA platform roots across ios/android/web.
 * - Run immutable registry validation + reconcile (read-only).
 *
 * Usage:
 *   node tools/repo-doctor/doctor.mjs
 *   node tools/repo-doctor/doctor.mjs --fix
 *   node tools/repo-doctor/doctor.mjs --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Resolve repo root relative to this script so it works from any CWD.
const THIS_FILE = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(THIS_FILE), '..', '..');
process.chdir(ROOT);
const ARGS = new Set(process.argv.slice(2));

const FIX = ARGS.has('--fix') || ARGS.has('fix');
const JSON_OUT = ARGS.has('--json');

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.vite',
  'coverage'
]);

function rel(p) {
  return path.relative(ROOT, p) || '.';
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function isDirEmpty(dir) {
  try {
    const entries = fs.readdirSync(dir);
    return entries.length === 0;
  } catch {
    return false;
  }
}

function safeRmDirIfEmpty(absDir, issues) {
  if (!exists(absDir)) return false;
  let st;
  try {
    st = fs.lstatSync(absDir);
  } catch {
    return false;
  }
  if (!st.isDirectory()) return false;

  if (!isDirEmpty(absDir)) {
    issues.push({
      level: 'warn',
      code: 'NON_EMPTY_SUSPECT_DIR',
      path: rel(absDir),
      message: 'Suspect directory is not empty; safe mode will not delete it.'
    });
    return false;
  }

  if (!FIX) return false;
  fs.rmSync(absDir, { recursive: true, force: true });
  return true;
}

function runNodeScript(scriptRelPath) {
  const res = spawnSync(process.execPath, [path.join(ROOT, scriptRelPath)], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  return {
    ok: res.status === 0,
    status: res.status,
    stdout: (res.stdout || '').trim(),
    stderr: (res.stderr || '').trim()
  };
}

function walkSuspiciousNames(rootDir, maxDepth = 4) {
  const out = [];
  const q = [{ dir: rootDir, depth: 0 }];

  while (q.length) {
    const { dir, depth } = q.shift();
    if (depth > maxDepth) continue;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (IGNORE_DIRS.has(e.name)) continue;

      const abs = path.join(dir, e.name);
      const name = e.name;

      // Heuristics: these names often come from accidental moves/merges.
      const suspicious =
        name.includes('{') ||
        name.includes('}') ||
        /\s+2$/.test(name) ||
        /\s+copy$/i.test(name) ||
        /__MACOSX/i.test(name);

      if (suspicious) out.push(abs);
      q.push({ dir: abs, depth: depth + 1 });
    }
  }

  return out;
}

function main() {
  const issues = [];
  const fixes = [];

  // ────────────────────────────────────────────────────────────────────────────
  // ADH-MOSA platform roots (essentials)
  // ────────────────────────────────────────────────────────────────────────────
  for (const platform of ['ios', 'android', 'web']) {
    const base = path.join(ROOT, 'src', platform);
    for (const req of ['Project', 'Tabs', 'Shared']) {
      const p = path.join(base, req);
      if (!exists(p)) {
        if (FIX) {
          fs.mkdirSync(p, { recursive: true });
          fixes.push({ code: 'MOSA_CREATED_PATH', path: rel(p) });
          issues.push({
            level: 'warn',
            code: 'MOSA_MISSING_PATH_FIXED',
            path: rel(p),
            message: `Missing required ADH-MOSA path was created: src/${platform}/${req}/`
          });
        } else {
          issues.push({
            level: 'error',
            code: 'MOSA_MISSING_PATH',
            path: rel(p),
            message: `Missing required ADH-MOSA path: src/${platform}/${req}/`
          });
        }
      }
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Suspect duplicate/stray directories (safe cleanup)
  // ────────────────────────────────────────────────────────────────────────────
  const suspects = [];
  const knownSuspects = [
    path.join(ROOT, 'src', 'web 2'),
    path.join(ROOT, 'src', 'web', '{src'),
    path.join(ROOT, 'src', 'web', '{src}'),
    path.join(ROOT, 'src', 'web', '{'),
    path.join(ROOT, 'src', '{src'),
    path.join(ROOT, 'src', '{src}')
  ];

  for (const p of knownSuspects) {
    if (exists(p)) suspects.push(p);
  }

  // Also find suspicious names up to a shallow depth under src/
  const heuristicSuspects = walkSuspiciousNames(path.join(ROOT, 'src'), 4);
  for (const p of heuristicSuspects) suspects.push(p);

  // Unique
  const uniqueSuspects = [...new Set(suspects.map((p) => path.resolve(p)))];
  for (const s of uniqueSuspects) {
    issues.push({
      level: 'warn',
      code: 'SUSPECT_DIR',
      path: rel(s),
      message: 'Suspect directory name detected (potential duplicate/stray).'
    });
    const deleted = safeRmDirIfEmpty(s, issues);
    if (deleted) fixes.push({ code: 'DELETED_EMPTY_SUSPECT_DIR', path: rel(s) });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Registry checks (read-only)
  // ────────────────────────────────────────────────────────────────────────────
  const registryValidate = runNodeScript('tools/feature-registry/validate.mjs');
  const registryReconcile = runNodeScript('tools/feature-registry/vault_reconcile.mjs');

  if (!registryValidate.ok) {
    issues.push({
      level: 'error',
      code: 'REGISTRY_VALIDATE_FAIL',
      path: 'tools/feature-registry/validate.mjs',
      message: registryValidate.stderr || registryValidate.stdout || 'Registry validation failed'
    });
  }
  if (!registryReconcile.ok) {
    issues.push({
      level: 'error',
      code: 'REGISTRY_RECONCILE_FAIL',
      path: 'tools/feature-registry/vault_reconcile.mjs',
      message: registryReconcile.stderr || registryReconcile.stdout || 'Registry reconcile failed'
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Web runtime capabilities catalog (machine-readable)
  // ────────────────────────────────────────────────────────────────────────────
  const capabilitiesPath = path.join(ROOT, 'src', 'web', 'Shared', 'Core', 'Registry', 'capabilities.v1.json');
  let capabilities = null;
  if (exists(capabilitiesPath)) {
    try {
      capabilities = JSON.parse(fs.readFileSync(capabilitiesPath, 'utf8'));
    } catch (e) {
      issues.push({
        level: 'warn',
        code: 'CAPABILITIES_JSON_PARSE_FAIL',
        path: rel(capabilitiesPath),
        message: `Failed to parse capabilities JSON: ${String(e?.message || e)}`
      });
    }
  } else {
    issues.push({
      level: 'warn',
      code: 'CAPABILITIES_JSON_MISSING',
      path: rel(capabilitiesPath),
      message: 'Missing web capabilities catalog; feature listing may be incomplete.'
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Final report
  // ────────────────────────────────────────────────────────────────────────────
  const summary = {
    ok: issues.every((i) => i.level !== 'error'),
    mode: FIX ? 'fix' : 'report',
    run: {
      reactVite: {
        command: 'npm run web:dev',
        url: 'http://localhost:3000',
        projectDir: 'src/web/Project/react-vite'
      }
    },
    registry: {
      immutable: {
        path: 'registry/v1/feature-registry.v1.0.0.json',
        validate: { ok: registryValidate.ok },
        reconcile: { ok: registryReconcile.ok }
      },
      runtimeWeb: {
        path: 'src/web/Shared/Core/Registry/featureRegistry.ts',
        capabilitiesCatalog: exists(capabilitiesPath) ? rel(capabilitiesPath) : null,
        capabilitiesCount: Array.isArray(capabilities?.capabilities) ? capabilities.capabilities.length : 0
      }
    },
    issues,
    fixes
  };

  if (JSON_OUT) {
    process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
  } else {
    const errCount = issues.filter((i) => i.level === 'error').length;
    const warnCount = issues.filter((i) => i.level === 'warn').length;
    console.log(`VAULT_DOCTOR ${summary.ok ? 'OK' : 'FAIL'} (${summary.mode})`);
    console.log(`- Errors: ${errCount}`);
    console.log(`- Warnings: ${warnCount}`);
    if (fixes.length) console.log(`- Fixes: ${fixes.length}`);
    console.log('');
    console.log('Run commands:');
    console.log(`- React/Vite: ${summary.run.reactVite.command}  (${summary.run.reactVite.url})`);
    console.log('');
    if (issues.length) {
      console.log('Issues:');
      for (const i of issues) {
        console.log(`- [${i.level.toUpperCase()}] ${i.code}: ${i.path} — ${i.message}`);
      }
    }
    if (Array.isArray(capabilities?.capabilities) && capabilities.capabilities.length) {
      console.log('');
      console.log(`Web capabilities (${capabilities.capabilities.length}):`);
      for (const c of capabilities.capabilities) {
        const tag = c.kind ? ` (${c.kind})` : '';
        console.log(`- ${c.name}${tag}${c.routePath ? ` — ${c.routePath}` : ''}`);
      }
    }
    if (fixes.length) {
      console.log('');
      console.log('Fixes applied:');
      for (const f of fixes) {
        console.log(`- ${f.code}: ${f.path}${f.target ? ` -> ${f.target}` : ''}`);
      }
    }
  }

  process.exit(summary.ok ? 0 : 1);
}

main();


