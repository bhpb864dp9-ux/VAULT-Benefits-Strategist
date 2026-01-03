/**
 * VAULT DEM Engine — Enhanced VASRD Calculator
 * Bilateral factor implementation per 38 CFR § 4.26
 *
 * This module provides utilities for working with SelectedCondition[]
 * and converting to RatingInput[] for the main calculator.
 */

import type {
  SelectedCondition,
  RatingInput,
  LimbType,
  IntentLevel
} from '@/types';

// ═══════════════════════════════════════════════════════════════════
// INTENT LEVEL TO RATING MAPPING
// ═══════════════════════════════════════════════════════════════════

/**
 * Maps IntentLevel (0-4) to approximate rating percentages
 * Used when a specific rating hasn't been selected
 */
export const INTENT_TO_RATING: Record<IntentLevel, number> = {
  0: 0,    // none
  1: 10,   // mild
  2: 30,   // moderate
  3: 50,   // severe
  4: 100,  // total
};

// ═══════════════════════════════════════════════════════════════════
// BILATERAL ELIGIBLE LIMB TYPES
// ═══════════════════════════════════════════════════════════════════

const BILATERAL_LIMB_TYPES: LimbType[] = [
  'knee', 'hip', 'ankle', 'foot', 'shoulder', 'elbow', 'wrist', 'hand', 'arm', 'leg'
];

// ═══════════════════════════════════════════════════════════════════
// CONVERSION UTILITIES
// ═══════════════════════════════════════════════════════════════════

/**
 * Convert SelectedCondition[] to RatingInput[] for the VASRD calculator
 */
export function conditionsToRatingInputs(conditions: SelectedCondition[]): RatingInput[] {
  return conditions
    .filter(c => c.selectedRating && c.selectedRating > 0)
    .map(c => ({
      id: c.id,
      name: c.name,
      value: c.selectedRating!,
      isBilateral: c.isBilateral ?? (c.side === 'bilateral'),
      side: c.side,
      limbType: c.limbType,
    }));
}

/**
 * Check if a condition is eligible for bilateral factor
 */
export function isBilateralEligible(condition: SelectedCondition): boolean {
  // Explicit flag takes precedence
  if (condition.bilateralEligible === true) return true;
  if (condition.bilateralEligible === false) return false;

  // Check limbType
  if (condition.limbType && BILATERAL_LIMB_TYPES.includes(condition.limbType)) {
    return true;
  }

  return false;
}

/**
 * Group conditions by limbType for bilateral detection
 */
export function groupByLimbType(conditions: SelectedCondition[]): Map<LimbType, SelectedCondition[]> {
  const groups = new Map<LimbType, SelectedCondition[]>();

  for (const condition of conditions) {
    if (!condition.limbType || !isBilateralEligible(condition)) continue;
    if (!condition.selectedRating || condition.selectedRating === 0) continue;

    const key = condition.limbType;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(condition);
  }

  return groups;
}

/**
 * Identify bilateral pairs from conditions
 * Returns conditions that qualify for the 10% bilateral factor
 */
export function identifyBilateralPairs(conditions: SelectedCondition[]): {
  bilateralConditions: SelectedCondition[];
  nonBilateralConditions: SelectedCondition[];
} {
  const groups = groupByLimbType(conditions);
  const bilateralConditions: SelectedCondition[] = [];
  const nonBilateralConditions: SelectedCondition[] = [];

  for (const [_limbType, groupConditions] of groups) {
    const hasLeft = groupConditions.some(c => c.side === 'left');
    const hasRight = groupConditions.some(c => c.side === 'right');
    const hasBilateral = groupConditions.some(c => c.side === 'bilateral');

    if ((hasLeft && hasRight) || hasBilateral) {
      bilateralConditions.push(...groupConditions);
    } else {
      nonBilateralConditions.push(...groupConditions);
    }
  }

  // Add conditions without limbType to non-bilateral
  for (const condition of conditions) {
    if (!condition.limbType || !isBilateralEligible(condition)) {
      if (condition.selectedRating && condition.selectedRating > 0) {
        nonBilateralConditions.push(condition);
      }
    }
  }

  return { bilateralConditions, nonBilateralConditions };
}

// ═══════════════════════════════════════════════════════════════════
// RATING CALCULATION UTILITIES
// ═══════════════════════════════════════════════════════════════════

/**
 * Combine ratings using VA math (38 CFR § 4.25)
 * Each rating reduces the remaining "whole person" efficiency
 */
export function combineRatings(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  if (ratings.length === 1) return ratings[0];

  // Sort descending - highest rating first
  const sorted = [...ratings].sort((a, b) => b - a);

  let efficiency = 100;
  for (const rating of sorted) {
    efficiency = efficiency - (efficiency * rating / 100);
  }

  return 100 - efficiency;
}

/**
 * Round to nearest 10% per VA rules
 */
export function roundToNearest10(value: number): number {
  return Math.round(value / 10) * 10;
}

/**
 * Calculate bilateral factor bonus (10% of combined bilateral rating)
 * Per 38 CFR § 4.26
 */
export function calculateBilateralBonus(bilateralRatings: number[]): number {
  if (bilateralRatings.length < 2) return 0;
  const combined = combineRatings(bilateralRatings);
  return Math.round(combined * 0.10);
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════

export default {
  INTENT_TO_RATING,
  conditionsToRatingInputs,
  isBilateralEligible,
  groupByLimbType,
  identifyBilateralPairs,
  combineRatings,
  roundToNearest10,
  calculateBilateralBonus,
};
