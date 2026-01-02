/**
 * VAULT DEM Engine — TDIU & SMC Eligibility Checker
 * Implements automatic eligibility detection per 38 CFR Part 4
 */

import type { 
  RatingInput, 
  TDIUResult, 
  SMCResult, 
  SMCType,
  SelectedCondition 
} from '../types';
import { calculateExactCombinedRating } from './vasrdCalculator';

export const TDIU_CRITERIA = {
  singleCondition: {
    minRating: 60,
    description: 'One service-connected disability rated at 60% or more'
  },
  combinedConditions: {
    minSingle: 40,
    minCombined: 70,
    description: 'One disability rated at 40%+ with combined rating of 70%+'
  },
  extrascheduler: {
    description: 'Disabilities prevent substantially gainful employment despite not meeting schedular criteria'
  }
} as const;

export const SMC_RATES_2026 = {
  K: {
    amount: 139.09,
    description: 'Loss of use of creative organ, one hand, one foot, or one eye',
    cfrReference: '38 U.S.C. § 1114(k)',
    triggers: ['Erectile Dysfunction', 'Amputation (Hand)', 'Amputation (Foot)', 'Blindness (One Eye)']
  },
  L: {
    amount: 4871.62,
    description: 'Anatomical loss of both feet, both hands, or one of each',
    cfrReference: '38 U.S.C. § 1114(l)',
    triggers: ['Bilateral Amputation', 'Paraplegia', 'Blindness (Both Eyes)']
  },
  M: {
    amount: 5377.04,
    description: 'Loss of use of both hands or both feet plus blindness',
    cfrReference: '38 U.S.C. § 1114(m)',
    triggers: []
  },
  N: {
    amount: 6102.73,
    description: 'Anatomical loss of both arms at elbow or above',
    cfrReference: '38 U.S.C. § 1114(n)',
    triggers: []
  },
  O: {
    amount: 6769.50,
    description: 'Most severe disability combinations',
    cfrReference: '38 U.S.C. § 1114(o)',
    triggers: []
  },
  R1: {
    amount: 9542.99,
    description: 'Higher level aid and attendance',
    cfrReference: '38 U.S.C. § 1114(r)(1)',
    triggers: []
  },
  R2: {
    amount: 10942.90,
    description: 'Aid and attendance plus regular nursing care',
    cfrReference: '38 U.S.C. § 1114(r)(2)',
    triggers: []
  },
  S: {
    amount: 4474.34,
    description: 'Housebound - total rating plus 60%+ independent disability',
    cfrReference: '38 U.S.C. § 1114(s)',
    triggers: []
  },
  T: {
    amount: 4474.34,
    description: 'Aid and attendance for residuals of TBI',
    cfrReference: '38 U.S.C. § 1114(t)',
    triggers: ['Traumatic Brain Injury (TBI)']
  }
  ,
  // Included because SMCType includes 'P' (intermediate rate)
  P: {
    amount: 0,
    description: 'Intermediate SMC rate (P) — placeholder (requires detailed combination rules)',
    cfrReference: '38 U.S.C. § 1114(p)',
    triggers: []
  }
} as const;

const SMC_K_CONDITION_TRIGGERS = [
  'Erectile Dysfunction',
  'Loss of use of creative organ'
];

export function checkTDIUEligibility(ratings: RatingInput[]): TDIUResult {
  const result: TDIUResult = {
    eligible: false,
    pathway: null,
    explanation: '',
    requirements: [],
    forms: []
  };

  if (!ratings || ratings.length === 0) {
    result.explanation = 'No ratings provided for TDIU analysis. Add your service-connected conditions to check eligibility.';
    return result;
  }

  const sortedRatings = [...ratings].sort((a, b) => b.value - a.value);
  const highestRating = sortedRatings[0]?.value || 0;
  const highestCondition = sortedRatings[0]?.name || 'Unknown';

  const combined = calculateExactCombinedRating(ratings);

  if (highestRating >= TDIU_CRITERIA.singleCondition.minRating) {
    result.eligible = true;
    result.pathway = 'Single Condition';
    result.explanation = `Your ${highestCondition} (${highestRating}%) meets the single condition threshold of 60% or higher. You may qualify for TDIU if this disability prevents you from maintaining substantially gainful employment.`;
    result.requirements = [
      'VA Form 21-8940 (TDIU Application)',
      'Complete employment history for past 5 years',
      'Evidence disability prevents substantial gainful employment',
      'Medical opinion linking unemployability to service-connected disability',
      'Documentation of education and training'
    ];
    result.forms = ['21-8940', '21-4192'];
    return result;
  }

  if (
    highestRating >= TDIU_CRITERIA.combinedConditions.minSingle &&
    combined.combined >= TDIU_CRITERIA.combinedConditions.minCombined
  ) {
    result.eligible = true;
    result.pathway = 'Combined Conditions';
    result.explanation = `Your highest rating (${highestCondition} at ${highestRating}%) combined with your overall rating of ${combined.combined}% meets the 40%/70% combined threshold. You may qualify for TDIU if your combined disabilities prevent substantially gainful employment.`;
    result.requirements = [
      'VA Form 21-8940 (TDIU Application)',
      'Complete employment history for past 5 years',
      'Evidence showing combined effect of disabilities on employment',
      'Medical opinion addressing how conditions together prevent work',
      'Documentation of education and work experience'
    ];
    result.forms = ['21-8940', '21-4192'];
    return result;
  }

  if (combined.combined >= 40) {
    result.eligible = 'extrascheduler';
    result.pathway = 'Extrascheduler';
    result.explanation = `Your combined rating (${combined.combined}%) does not meet the standard TDIU schedular criteria. However, you may request extrascheduler consideration if your unique circumstances prevent employment. This requires referral to the Director of Compensation Service.`;
    result.requirements = [
      'VA Form 21-8940 (TDIU Application)',
      'Compelling evidence of unemployability despite ratings',
      'Detailed medical opinions explaining unique circumstances',
      'Documentation of failed employment attempts',
      'Evidence showing disabilities are uniquely debilitating for your occupation',
      'Request for extrascheduler referral in cover letter'
    ];
    result.forms = ['21-8940', '21-4138'];
    return result;
  }

  result.explanation = `Your current ratings do not meet TDIU schedular criteria. To qualify, you need either:

• ONE condition rated 60% or higher (your highest is ${highestRating}%)
• One condition at 40%+ with combined rating of 70%+ (your combined is ${combined.combined}%)

Consider filing for increased ratings on your most impactful condition.`;

  return result;
}

export function getTDIUAmount(): number {
  return 3831.30;
}

export function checkSMCEligibility(
  conditions: SelectedCondition[],
  ratings: RatingInput[]
): SMCResult[] {
  const results: SMCResult[] = [];

  const smcKEligible = conditions.some(c =>
    SMC_K_CONDITION_TRIGGERS.some(trigger =>
      c.name.toLowerCase().includes(trigger.toLowerCase())
    )
  );

  if (smcKEligible) {
    results.push({
      type: 'SMC-K',
      eligible: true,
      amount: SMC_RATES_2026.K.amount,
      reason: SMC_RATES_2026.K.description,
      cfrReference: SMC_RATES_2026.K.cfrReference,
      conditions: conditions
        .filter(c => SMC_K_CONDITION_TRIGGERS.some(t => c.name.toLowerCase().includes(t.toLowerCase())))
        .map(c => c.name)
    });
  }

  const combined = calculateExactCombinedRating(ratings);
  if (combined.combined === 100 && ratings.length > 1) {
    const sortedRatings = [...ratings].sort((a, b) => b.value - a.value);
    if (sortedRatings[0]?.value === 100) {
      const remaining = sortedRatings.slice(1);
      if (remaining.length > 0) {
        const remainingCombined = calculateExactCombinedRating(remaining);
        if (remainingCombined.combined >= 60) {
          results.push({
            type: 'SMC-S',
            eligible: true,
            amount: SMC_RATES_2026.S.amount,
            reason: `100% schedular rating plus independent ${remainingCombined.combined}% disability`,
            cfrReference: SMC_RATES_2026.S.cfrReference
          });
        }
      }
    }
  }

  const hasTBI = conditions.some(c =>
    c.name.toLowerCase().includes('tbi') ||
    c.name.toLowerCase().includes('traumatic brain injury')
  );

  if (hasTBI) {
    const tbiCondition = conditions.find(c =>
      c.name.toLowerCase().includes('tbi') ||
      c.name.toLowerCase().includes('traumatic brain injury')
    );
    const tbiRating = ratings.find(r => r.name === tbiCondition?.name)?.value || 0;
    if (tbiRating >= 70) {
      results.push({
        type: 'SMC-T',
        eligible: true,
        amount: SMC_RATES_2026.T.amount,
        reason: 'May qualify for aid and attendance due to TBI residuals',
        cfrReference: SMC_RATES_2026.T.cfrReference,
        conditions: [tbiCondition?.name || 'TBI']
      });
    }
  }

  const amputationConditions = conditions.filter(c =>
    c.name.toLowerCase().includes('amputation') ||
    c.name.toLowerCase().includes('loss of use')
  );

  if (amputationConditions.length >= 2) {
    results.push({
      type: 'SMC-L',
      eligible: true,
      amount: SMC_RATES_2026.L.amount,
      reason: 'Multiple loss of use conditions detected - review for SMC-L eligibility',
      cfrReference: SMC_RATES_2026.L.cfrReference,
      conditions: amputationConditions.map(c => c.name)
    });
  }

  return results;
}

export function getAllSMCTypes(): typeof SMC_RATES_2026 {
  return SMC_RATES_2026;
}

export function getSMCInfo(type: SMCType): typeof SMC_RATES_2026[SMCType] {
  return SMC_RATES_2026[type];
}

export interface BenefitsAnalysis {
  tdiu: TDIUResult;
  smc: SMCResult[];
  maxMonthlyBenefit: number;
  potentialBackpay: number;
}

export function analyzeBenefitsEligibility(
  conditions: SelectedCondition[],
  ratings: RatingInput[],
  effectiveDate?: Date
): BenefitsAnalysis {
  const tdiu = checkTDIUEligibility(ratings);
  const smc = checkSMCEligibility(conditions, ratings);

  let maxMonthly = 0;
  if (tdiu.eligible === true) {
    maxMonthly = getTDIUAmount();
  } else {
    const combined = calculateExactCombinedRating(ratings);
    maxMonthly = combined.combined >= 100 ? 3831.30 : 0;
  }

  smc.forEach(s => {
    if (s.eligible) maxMonthly += s.amount;
  });

  let backpay = 0;
  if (effectiveDate) {
    const monthsSinceEffective = Math.floor(
      (Date.now() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    backpay = maxMonthly * Math.max(0, monthsSinceEffective);
  }

  return {
    tdiu,
    smc,
    maxMonthlyBenefit: parseFloat(maxMonthly.toFixed(2)),
    potentialBackpay: parseFloat(backpay.toFixed(2))
  };
}

export default {
  checkTDIUEligibility,
  getTDIUAmount,
  checkSMCEligibility,
  getAllSMCTypes,
  getSMCInfo,
  analyzeBenefitsEligibility,
  TDIU_CRITERIA,
  SMC_RATES_2026
};


