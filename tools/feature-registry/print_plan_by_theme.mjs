/**
 * Print VAULT Feature Plan by Theme → Epic → Feature → Functions
 *
 * Reads immutable registry JSON, then inspects implementation files to extract
 * key function/component names for a more granular "where we are" view.
 *
 * Output:
 * - Markdown to stdout
 *
 * Usage:
 *   node tools/feature-registry/print_plan_by_theme.mjs > docs/FEATURE_PLAN_BY_THEME.md
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

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function uniq(arr) {
  return [...new Set(arr)].filter(Boolean);
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function extractSymbols(tsText) {
  // Heuristic extraction (good enough for navigation/attribution):
  // - export function NAME
  // - export const NAME
  // - function NAME(
  // - const NAME = ( / async ( / function(
  // - export default function NAME
  // - export default NAME
  const out = [];
  const patterns = [
    /export\s+default\s+function\s+([A-Za-z0-9_]+)/g,
    /export\s+function\s+([A-Za-z0-9_]+)/g,
    /export\s+const\s+([A-Za-z0-9_]+)/g,
    /\bfunction\s+([A-Za-z0-9_]+)\s*\(/g,
    /\bconst\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(/g,
    /\bconst\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?[A-Za-z0-9_<>,\s]*=>/g
  ];
  for (const rx of patterns) {
    let m;
    while ((m = rx.exec(tsText))) {
      out.push(m[1]);
    }
  }
  // Remove noise
  const banned = new Set(['default', 'return', 'if', 'for', 'while', 'switch']);
  return uniq(out.filter((s) => s && !banned.has(s))).slice(0, 24);
}

function formatList(items) {
  if (!items.length) return '_(none detected)_';
  return items.map((x) => `- \`${x}\``).join('\n');
}

function mdEscape(s) {
  return String(s).replace(/\|/g, '\\|');
}

function main() {
  const registry = readJson(REGISTRY_PATH);
  const themesById = new Map(registry.themes.map((t) => [t.id, t]));
  const epicsById = new Map(registry.epics.map((e) => [e.id, e]));

  const featuresByEpic = new Map();
  for (const f of registry.features) {
    const list = featuresByEpic.get(f.epicId) || [];
    list.push(f);
    featuresByEpic.set(f.epicId, list);
  }

  const now = new Date().toISOString();
  let md = '';

  md += `## VAULT Feature Plan (Theme → Epic → Feature → Functions)\n\n`;
  md += `- **Registry**: \`${registry.meta.id}\`\n`;
  md += `- **Schema**: \`${registry.meta.schemaVersion}\`\n`;
  md += `- **Checksum**: \`${registry.meta.checksum}\`\n`;
  md += `- **Generated**: \`${now}\`\n\n`;

  // Themes in stable order
  const themeIds = registry.themes.map((t) => t.id);
  for (const themeId of themeIds) {
    const theme = themesById.get(themeId);
    if (!theme) continue;

    md += `### Theme: **${mdEscape(theme.id)}** — ${mdEscape(theme.name)}\n\n`;
    md += `- **Tagline**: ${mdEscape(theme.tagline)}\n`;
    md += `- **Status**: ${mdEscape(theme.status)}\n\n`;

    // Epics belonging to this theme
    const epics = registry.epics
      .filter((e) => (e.themeIds || []).includes(themeId))
      .sort((a, b) => a.id.localeCompare(b.id));

    if (!epics.length) {
      md += `_No epics linked to this theme._\n\n`;
      continue;
    }

    for (const epic of epics) {
      md += `#### Epic: **${mdEscape(epic.id)}** (${mdEscape(epic.code)}) — ${mdEscape(epic.name)}\n\n`;
      md += `- **Priority**: ${mdEscape(epic.priority)}\n`;
      md += `- **Status**: ${mdEscape(epic.status)}\n`;
      md += `- **Owner**: ${mdEscape(epic.owner)}\n\n`;

      const feats = (featuresByEpic.get(epic.id) || []).slice().sort((a, b) => a.id.localeCompare(b.id));
      if (!feats.length) {
        md += `_No features registered under this epic in this registry snapshot._\n\n`;
        continue;
      }

      for (const f of feats) {
        const impl = f.implementation || {};
        const filePaths = impl.filePaths || [];
        md += `##### Feature: **${mdEscape(f.id)}** — ${mdEscape(f.name)}\n\n`;
        md += `- **Status**: ${mdEscape(f.status)}\n`;
        md += `- **Priority**: ${mdEscape(f.priority)}\n`;
        md += `- **Sprint**: ${f.sprint ?? '—'}\n`;
        md += `- **AC**:\n`;
        for (const ac of f.acceptanceCriteria || []) {
          md += `  - \`${ac.id}\` **${ac.status}** — ${mdEscape(ac.requirement)}\n`;
        }
        md += `- **Primary componentPath**: ${impl.componentPath ? `\`${impl.componentPath}\`` : '—'}\n`;
        md += `- **Files**:\n`;
        md += (filePaths.length ? filePaths.map((p) => `  - \`${p}\``).join('\n') : '  - —') + '\n\n';

        // Functions per file
        if (filePaths.length) {
          md += `- **Key functions/components (auto-extracted)**:\n`;
          for (const rel of filePaths) {
            const abs = path.join(ROOT, rel);
            const text = safeRead(abs);
            if (!text) {
              md += `  - \`${rel}\`: _(missing/unreadable)_\n`;
              continue;
            }
            const symbols = extractSymbols(text);
            md += `  - \`${rel}\`:\n`;
            md += symbols.length ? symbols.map((s) => `    - \`${s}\``).join('\n') + '\n' : `    - _(none detected)_\n`;
          }
          md += '\n';
        }
      }
    }
  }

  md += `### Registry Totals\n\n`;
  md += `- **Themes**: ${registry.statistics.totals.themes}\n`;
  md += `- **Epics**: ${registry.statistics.totals.epics}\n`;
  md += `- **Features**: ${registry.statistics.totals.features}\n`;
  md += `- **Acceptance Criteria**: ${registry.statistics.totals.acceptanceCriteria}\n`;
  md += `- **Adoption rate**: ${Math.round(registry.statistics.adoptionRate * 10000) / 100}%\n`;

  process.stdout.write(md);
}

main();


