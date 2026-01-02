import { getAllConditions } from '../data/bodySystems';
import type { Condition } from '../types';

export type NarrativeDetection = {
  condition: Condition & { system: string };
  score: number;
  matchedKeywords: string[];
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function detectConditionsFromNarrative(text: string, limit = 8): NarrativeDetection[] {
  const t = normalize(text);
  if (!t || t.length < 12) return [];

  const all = getAllConditions();
  const scored: NarrativeDetection[] = [];

  for (const c of all) {
    const kws = (c.keywords || []).map(normalize).filter(Boolean);
    if (!kws.length) continue;

    const matched: string[] = [];
    for (const kw of kws) {
      if (t.includes(kw)) matched.push(kw);
    }
    if (!matched.length) continue;

    const nameMention = t.includes(normalize(c.name)) ? 2 : 0;
    const score = matched.length + nameMention;
    scored.push({ condition: c, score, matchedKeywords: matched.slice(0, 6) });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function suggestRelatedConditions(
  selectedNames: string[],
  limit = 8
): (Condition & { system: string })[] {
  const all = getAllConditions();
  const selectedNorm = selectedNames.map(normalize);
  const selectedSet = new Set(selectedNorm);

  const byName = new Map<string, Condition & { system: string }>();
  for (const c of all) byName.set(normalize(c.name), c);

  const out: (Condition & { system: string })[] = [];
  const seen = new Set<string>();

  for (const candidate of all) {
    if (!candidate.secondary?.length) continue;
    const hit = candidate.secondary.some((sec) => {
      const s = normalize(sec);
      return selectedNorm.some((sel) => sel.includes(s) || s.includes(sel));
    });
    if (!hit) continue;
    const key = normalize(candidate.name);
    if (selectedSet.has(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
    if (out.length >= limit) return out;
  }

  for (const name of selectedNames) {
    const sel = byName.get(normalize(name));
    if (!sel?.secondary?.length) continue;

    for (const sec of sel.secondary) {
      const resolved =
        byName.get(normalize(sec)) ||
        all.find((c) => normalize(c.name).includes(normalize(sec)) || normalize(sec).includes(normalize(c.name)));

      if (!resolved) continue;
      const key = normalize(resolved.name);
      if (selectedSet.has(key) || seen.has(key)) continue;
      seen.add(key);
      out.push(resolved);
      if (out.length >= limit) return out;
    }
  }

  return out;
}


