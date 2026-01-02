import type { IntentLevel } from '../types';
import { BODY_SYSTEMS } from '../data/bodySystems';

type BodySystemId = (typeof BODY_SYSTEMS)[number]['id'];

// Mirror the body-map part → system mapping (kept small and deterministic).
const PART_TO_SYSTEM: Record<string, BodySystemId> = {
  head: 'mental',
  l_eye: 'vision',
  r_eye: 'vision',
  l_ear: 'auditory',
  r_ear: 'auditory',
  neck: 'musculoskeletal',
  upper_back: 'musculoskeletal',
  lower_back: 'musculoskeletal',
  chest: 'respiratory',
  stomach: 'digestive',
  l_shoulder: 'musculoskeletal',
  r_shoulder: 'musculoskeletal',
  l_hip: 'musculoskeletal',
  r_hip: 'musculoskeletal',
  l_upper_arm: 'musculoskeletal',
  r_upper_arm: 'musculoskeletal',
  l_elbow: 'musculoskeletal',
  r_elbow: 'musculoskeletal',
  l_forearm: 'musculoskeletal',
  r_forearm: 'musculoskeletal',
  l_wrist: 'musculoskeletal',
  r_wrist: 'musculoskeletal',
  l_hand: 'musculoskeletal',
  r_hand: 'musculoskeletal',
  l_thigh: 'musculoskeletal',
  r_thigh: 'musculoskeletal',
  l_knee: 'musculoskeletal',
  r_knee: 'musculoskeletal',
  l_calf: 'musculoskeletal',
  r_calf: 'musculoskeletal',
  l_ankle: 'musculoskeletal',
  r_ankle: 'musculoskeletal',
  l_foot: 'musculoskeletal',
  r_foot: 'musculoskeletal'
};

export type BodyMapSuggestion = {
  partId: string;
  intent: IntentLevel;
  conditionIds: string[];
};

/**
 * Conservative “bridge” from body region → likely claimable condition IDs.
 * This is used to drive the right-side fast-track suggestions panel.
 *
 * Notes:
 * - Keep it conservative to avoid pushing diagnoses.
 * - Use existing condition IDs from `src/data/bodySystems.ts`.
 */
export const BODY_PART_SUGGESTIONS: Record<string, string[]> = {
  head: ['tbi', 'migraines', 'ptsd', 'insomnia'],
  l_eye: ['visual', 'dryeye', 'cataracts'],
  r_eye: ['visual', 'dryeye', 'cataracts'],
  l_ear: ['tinnitus', 'hearing', 'menieres'],
  r_ear: ['tinnitus', 'hearing', 'menieres'],

  neck: ['cervical', 'radiculopathy'],
  upper_back: ['thoracic', 'radiculopathy'],
  lower_back: ['lumbar', 'radiculopathy', 'sciatica'],

  chest: ['asthma', 'sleepapnea', 'sinusitis', 'rhinitis'],
  stomach: ['gerd', 'ibs', 'ulcer'],

  l_shoulder: ['shoulder', 'arthritis'],
  r_shoulder: ['shoulder', 'arthritis'],
  l_elbow: ['elbow', 'arthritis'],
  r_elbow: ['elbow', 'arthritis'],
  l_wrist: ['wrist', 'carpal'],
  r_wrist: ['wrist', 'carpal'],
  l_hand: ['carpal', 'neuropathy'],
  r_hand: ['carpal', 'neuropathy'],

  l_hip: ['hip', 'arthritis'],
  r_hip: ['hip', 'arthritis'],
  l_thigh: ['sciatica', 'radiculopathy', 'knee'],
  r_thigh: ['sciatica', 'radiculopathy', 'knee'],
  l_knee: ['knee', 'arthritis'],
  r_knee: ['knee', 'arthritis'],
  l_calf: ['sciatica', 'radiculopathy', 'neuropathy'],
  r_calf: ['sciatica', 'radiculopathy', 'neuropathy'],
  l_ankle: ['ankle'],
  r_ankle: ['ankle'],
  l_foot: ['plantar', 'flatfeet'],
  r_foot: ['plantar', 'flatfeet']
};

function systemFallbackConditionIds(systemId: BodySystemId): string[] {
  const sys = BODY_SYSTEMS.find((s) => s.id === systemId);
  if (!sys) return [];

  // Conservative top picks by system (first 3 in curated list).
  const ids = sys.conditions.map((c) => c.id).slice(0, 3);

  // Nudge a few common “fast track” helpers where appropriate.
  if (systemId === 'musculoskeletal') {
    // Ensure spine appears if user is clicking limbs.
    return Array.from(new Set(['lumbar', 'cervical', ...ids])).slice(0, 4);
  }
  if (systemId === 'auditory') {
    return Array.from(new Set(['tinnitus', 'hearing', ...ids])).slice(0, 4);
  }
  if (systemId === 'vision') {
    return Array.from(new Set(['visual', ...ids])).slice(0, 4);
  }
  return ids;
}

export function getBodyMapSuggestions(intentLevels: Record<string, IntentLevel | undefined>): BodyMapSuggestion[] {
  const out: BodyMapSuggestion[] = [];
  for (const [partId, intent] of Object.entries(intentLevels || {})) {
    if (!intent || intent <= 0) continue;
    const conditionIds =
      BODY_PART_SUGGESTIONS[partId] ||
      (PART_TO_SYSTEM[partId] ? systemFallbackConditionIds(PART_TO_SYSTEM[partId]) : undefined);
    if (!conditionIds?.length) continue;
    out.push({ partId, intent, conditionIds });
  }

  // Higher severity first; stable by partId.
  out.sort((a, b) => (b.intent ?? 0) - (a.intent ?? 0) || a.partId.localeCompare(b.partId));
  return out;
}


