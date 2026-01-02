/**
 * VAULT DEM Engine — VASRD Combined Rating Calculator
 * Implements EXACT VA math per 38 CFR § 4.25 and § 4.26
 */

import type { 
  RatingInput, 
  CombinedRatingResult, 
  CalculationStep,
  CompensationResult,
  Dependents 
} from '../types';

export const BILATERAL_FACTOR = 0.10;
export const COLA_2026 = 0.028;

export const COMPENSATION_RATES_2026 = {
  veteran: {
    0: 0.00,
    10: 175.51,
    20: 346.85,
    30: 537.02,
    40: 773.85,
    50: 1102.04,
    60: 1395.08,
    70: 1758.56,
    80: 2044.33,
    90: 2297.65,
    100: 3831.30
  },
  spouseAdd: {
    30: 63.16,
    40: 86.74,
    50: 110.05,
    60: 133.39,
    70: 157.68,
    80: 181.70,
    90: 205.44,
    100: 212.72
  },
  childAdd: {
    30: 28.00,
    40: 37.00,
    50: 47.00,
    60: 56.00,
    70: 66.00,
    80: 75.00,
    90: 85.00,
    100: 94.36
  },
  additionalChild: {
    30: 20.00,
    40: 20.00,
    50: 28.00,
    60: 28.00,
    70: 28.00,
    80: 28.00,
    90: 28.00,
    100: 28.00
  }
} as const;

export function calculateExactCombinedRating(
  ratings: RatingInput[],
  options: { includeBilateral?: boolean } = {}
): CombinedRatingResult {
  const { includeBilateral = true } = options;
  const steps: CalculationStep[] = [];
  
  if (!ratings || ratings.length === 0) {
    return {
      exactValue: 0,
      combined: 0,
      bilateralFactor: 0,
      bilateralCombined: 0,
      breakdown: { bilateral: [], nonBilateral: [] },
      steps: [{ description: 'No ratings provided', value: 0, remainingEfficiency: 100 }]
    };
  }

  const bilateralRatings: RatingInput[] = [];
  const nonBilateralRatings: RatingInput[] = [];

  if (includeBilateral) {
    const limbGroups = new Map<string, RatingInput[]>();
    
    ratings.forEach(r => {
      if (r.isBilateral && r.limbType) {
        const key = r.limbType;
        if (!limbGroups.has(key)) limbGroups.set(key, []);
        limbGroups.get(key)!.push(r);
      } else {
        nonBilateralRatings.push(r);
      }
    });

    limbGroups.forEach((limbs, type) => {
      const hasLeft = limbs.some(l => l.side === 'left');
      const hasRight = limbs.some(l => l.side === 'right');
      const hasBilateral = limbs.some(l => l.side === 'bilateral');
      
      if ((hasLeft && hasRight) || hasBilateral || limbs.length >= 2) {
        bilateralRatings.push(...limbs);
        steps.push({ description: `Bilateral pair identified: ${type}`, value: 0, remainingEfficiency: 100 });
      } else {
        nonBilateralRatings.push(...limbs);
      }
    });
  } else {
    nonBilateralRatings.push(...ratings);
  }

  const sortedBilateral = [...bilateralRatings].sort((a, b) => b.value - a.value);
  const sortedNonBilateral = [...nonBilateralRatings].sort((a, b) => b.value - a.value);

  let bilateralCombined = 0;
  let bilateralFactor = 0;

  if (sortedBilateral.length >= 2) {
    let bilateralEfficiency = 100;

    steps.push({ description: '=== BILATERAL CALCULATION (38 CFR § 4.26) ===', value: 0, remainingEfficiency: 100 });

    sortedBilateral.forEach((r, i) => {
      const contribution = bilateralEfficiency * (r.value / 100);
      bilateralEfficiency -= contribution;
      steps.push({
        description: `Bilateral #${i + 1}: ${r.value}% (${r.name})`,
        value: r.value,
        remainingEfficiency: parseFloat(bilateralEfficiency.toFixed(4))
      });
    });

    const rawBilateral = 100 - bilateralEfficiency;
    bilateralCombined = Math.round(rawBilateral);

    steps.push({
      description: `Bilateral subtotal: ${rawBilateral.toFixed(2)}% → ${bilateralCombined}%`,
      value: bilateralCombined,
      remainingEfficiency: 100 - bilateralCombined
    });

    bilateralFactor = Math.round(bilateralCombined * BILATERAL_FACTOR);
    bilateralCombined += bilateralFactor;

    steps.push({
      description: `Bilateral factor (+10%): +${bilateralFactor}%`,
      value: bilateralFactor,
      remainingEfficiency: 100 - bilateralCombined
    });

    steps.push({
      description: `Bilateral total with factor: ${bilateralCombined}%`,
      value: bilateralCombined,
      remainingEfficiency: 100 - bilateralCombined
    });
  }

  let combinedEfficiency = 100;

  steps.push({ description: '=== FINAL COMBINATION (38 CFR § 4.25) ===', value: 0, remainingEfficiency: 100 });

  if (bilateralCombined > 0) {
    const contribution = combinedEfficiency * (bilateralCombined / 100);
    combinedEfficiency -= contribution;
    steps.push({
      description: `Applied bilateral block: ${bilateralCombined}%`,
      value: bilateralCombined,
      remainingEfficiency: parseFloat(combinedEfficiency.toFixed(4))
    });
  }

  sortedNonBilateral.forEach((r, i) => {
    const contribution = combinedEfficiency * (r.value / 100);
    combinedEfficiency -= contribution;
    steps.push({
      description: `Rating #${i + 1}: ${r.value}% (${r.name})`,
      value: r.value,
      remainingEfficiency: parseFloat(combinedEfficiency.toFixed(4))
    });
  });

  const exactValue = 100 - combinedEfficiency;
  steps.push({
    description: `Exact combined value: ${exactValue.toFixed(4)}%`,
    value: parseFloat(exactValue.toFixed(4)),
    remainingEfficiency: combinedEfficiency
  });

  const combined = Math.round(exactValue / 10) * 10;
  steps.push({
    description: `Rounded to nearest 10%: ${combined}%`,
    value: combined,
    remainingEfficiency: 100 - combined
  });

  return {
    exactValue: parseFloat(exactValue.toFixed(4)),
    combined,
    bilateralFactor,
    bilateralCombined,
    breakdown: {
      bilateral: sortedBilateral,
      nonBilateral: sortedNonBilateral
    },
    steps
  };
}

export function calculateRatingRange(
  conditionRatings: { name: string; ratings: number[] }[]
): { min: number; max: number; minExact: number; maxExact: number } {
  if (conditionRatings.length === 0) {
    return { min: 0, max: 0, minExact: 0, maxExact: 0 };
  }

  const minRatings = conditionRatings.map(c => 
    Math.min(...c.ratings.filter(r => r > 0))
  );
  const maxRatings = conditionRatings.map(c => Math.max(...c.ratings));

  const minInputs: RatingInput[] = minRatings.map((value, i) => ({
    id: `min-${i}`,
    name: conditionRatings[i].name,
    value
  }));

  const maxInputs: RatingInput[] = maxRatings.map((value, i) => ({
    id: `max-${i}`,
    name: conditionRatings[i].name,
    value
  }));

  const minResult = calculateExactCombinedRating(minInputs, { includeBilateral: false });
  const maxResult = calculateExactCombinedRating(maxInputs, { includeBilateral: false });

  return {
    min: minResult.combined,
    max: maxResult.combined,
    minExact: minResult.exactValue,
    maxExact: maxResult.exactValue
  };
}

export function calculateCompensation(
  rating: number,
  dependents: Partial<Dependents> = {}
): CompensationResult {
  const rates = COMPENSATION_RATES_2026;
  const ratingKey = rating as keyof typeof rates.veteran;
  
  let base = rates.veteran[ratingKey] || 0;
  let spouse = 0;
  let children = 0;
  let parents = 0;

  if (rating >= 30) {
    if (dependents.spouse) {
      spouse = rates.spouseAdd[ratingKey as keyof typeof rates.spouseAdd] || 0;
    }

    const numChildren = dependents.children || 0;
    if (numChildren > 0) {
      children = rates.childAdd[ratingKey as keyof typeof rates.childAdd] || 0;
      if (numChildren > 1) {
        const additionalRate = rates.additionalChild[ratingKey as keyof typeof rates.additionalChild] || 0;
        children += (numChildren - 1) * additionalRate;
      }
    }

    if (dependents.dependentParents && dependents.dependentParents > 0) {
      parents = dependents.dependentParents * 50;
    }
  }

  const monthly = base + spouse + children + parents;

  return {
    monthly: parseFloat(monthly.toFixed(2)),
    annual: parseFloat((monthly * 12).toFixed(2)),
    colaRate: COLA_2026,
    colaYear: 2026,
    effectiveDate: '2026-01-01',
    breakdown: {
      base: parseFloat(base.toFixed(2)),
      spouse: spouse > 0 ? parseFloat(spouse.toFixed(2)) : undefined,
      children: children > 0 ? parseFloat(children.toFixed(2)) : undefined,
      parents: parents > 0 ? parseFloat(parents.toFixed(2)) : undefined
    }
  };
}

export default {
  calculateExactCombinedRating,
  calculateRatingRange,
  calculateCompensation,
  BILATERAL_FACTOR,
  COLA_2026,
  COMPENSATION_RATES_2026
};


