/**
 * VAULT DEM Engine — VASRD Severity-to-Rating Mappings
 * Per 38 CFR Part 4 Schedule for Rating Disabilities
 *
 * Each condition category has specific rating criteria based on severity.
 * This maps user-friendly severity levels to regulatory-compliant percentages.
 */

export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'total';

export interface RatingCriteria {
  level: SeverityLevel;
  rating: number;
  description: string;
  criteria: string;
}

export interface ConditionRatingSchedule {
  id: string;
  name: string;
  cfrSection: string;
  dbq: string;
  category: string;
  ratings: RatingCriteria[];
  bilateralEligible?: boolean;
}

/**
 * Mental Health Conditions - 38 CFR § 4.130
 * General Rating Formula for Mental Disorders
 */
const MENTAL_HEALTH_FORMULA: RatingCriteria[] = [
  {
    level: 'none',
    rating: 0,
    description: 'No symptoms',
    criteria: 'Diagnosed but symptoms not severe enough to interfere with occupational/social functioning or require continuous medication'
  },
  {
    level: 'mild',
    rating: 10,
    description: 'Mild symptoms',
    criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress'
  },
  {
    level: 'moderate',
    rating: 30,
    description: 'Moderate symptoms',
    criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks'
  },
  {
    level: 'severe',
    rating: 50,
    description: 'Moderate-Severe symptoms',
    criteria: 'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect, circumstantial or stereotyped speech, panic attacks more than once weekly'
  },
  {
    level: 'total',
    rating: 70,
    description: 'Severe symptoms',
    criteria: 'Occupational and social impairment with deficiencies in most areas such as work, school, family relations, judgment, thinking, or mood'
  }
];

/**
 * Spine Conditions - 38 CFR § 4.71a
 * General Rating Formula for Diseases and Injuries of the Spine
 */
const SPINE_FORMULA: RatingCriteria[] = [
  {
    level: 'none',
    rating: 0,
    description: 'No limitation',
    criteria: 'Full range of motion with no objective evidence of pain'
  },
  {
    level: 'mild',
    rating: 10,
    description: 'Mild limitation',
    criteria: 'Forward flexion greater than 60° but not greater than 85°, or combined ROM greater than 120° but not greater than 235°'
  },
  {
    level: 'moderate',
    rating: 20,
    description: 'Moderate limitation',
    criteria: 'Forward flexion greater than 30° but not greater than 60°, or combined ROM not greater than 120°'
  },
  {
    level: 'severe',
    rating: 40,
    description: 'Severe limitation',
    criteria: 'Forward flexion 30° or less, or favorable ankylosis of the entire thoracolumbar spine'
  },
  {
    level: 'total',
    rating: 50,
    description: 'Unfavorable ankylosis',
    criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine (100% for entire spine)'
  }
];

/**
 * Joint Conditions - 38 CFR § 4.71a
 * Limitation of Motion ratings
 */
const JOINT_FORMULA: RatingCriteria[] = [
  {
    level: 'none',
    rating: 0,
    description: 'No limitation',
    criteria: 'Full range of motion with no objective findings'
  },
  {
    level: 'mild',
    rating: 10,
    description: 'Slight limitation',
    criteria: 'Slight limitation of motion or painful motion with functional loss'
  },
  {
    level: 'moderate',
    rating: 20,
    description: 'Moderate limitation',
    criteria: 'Limitation of motion at shoulder level, or flexion limited to 90°'
  },
  {
    level: 'severe',
    rating: 30,
    description: 'Marked limitation',
    criteria: 'Motion limited to 25° from side, or limitation midway between side and shoulder level'
  },
  {
    level: 'total',
    rating: 40,
    description: 'Severe limitation',
    criteria: 'Limitation to 25° from side or ankylosis'
  }
];

/**
 * Sleep Apnea - 38 CFR § 4.97 DC 6847
 */
const SLEEP_APNEA_FORMULA: RatingCriteria[] = [
  {
    level: 'none',
    rating: 0,
    description: 'Asymptomatic',
    criteria: 'No current symptoms or treatment required'
  },
  {
    level: 'mild',
    rating: 30,
    description: 'Persistent daytime hypersomnolence',
    criteria: 'Documented sleep study with AHI ≥ 5, persistent daytime sleepiness'
  },
  {
    level: 'moderate',
    rating: 50,
    description: 'Requires CPAP',
    criteria: 'Requires use of breathing assistance device such as CPAP machine'
  },
  {
    level: 'severe',
    rating: 100,
    description: 'Chronic respiratory failure',
    criteria: 'Chronic respiratory failure with CO2 retention or cor pulmonale, or requires tracheostomy'
  }
];

/**
 * Tinnitus - 38 CFR § 4.87 DC 6260
 * Single rating regardless of unilateral or bilateral
 */
const TINNITUS_FORMULA: RatingCriteria[] = [
  {
    level: 'mild',
    rating: 10,
    description: 'Recurrent tinnitus',
    criteria: 'Recurrent tinnitus (maximum schedular rating)'
  }
];

/**
 * Migraine Headaches - 38 CFR § 4.124a DC 8100
 */
const MIGRAINE_FORMULA: RatingCriteria[] = [
  {
    level: 'none',
    rating: 0,
    description: 'Less frequent attacks',
    criteria: 'Less frequent attacks than required for 10%'
  },
  {
    level: 'mild',
    rating: 10,
    description: 'Characteristic prostrating attacks',
    criteria: 'Characteristic prostrating attacks averaging one in 2 months over last several months'
  },
  {
    level: 'moderate',
    rating: 30,
    description: 'Monthly prostrating attacks',
    criteria: 'Characteristic prostrating attacks occurring on an average once a month over last several months'
  },
  {
    level: 'severe',
    rating: 50,
    description: 'Very frequent attacks',
    criteria: 'Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability'
  }
];

/**
 * Radiculopathy/Neuropathy - 38 CFR § 4.124a
 * Peripheral Nerve ratings
 */
const PERIPHERAL_NERVE_FORMULA: RatingCriteria[] = [
  {
    level: 'none',
    rating: 0,
    description: 'No impairment',
    criteria: 'No objective neurological findings'
  },
  {
    level: 'mild',
    rating: 10,
    description: 'Mild incomplete paralysis',
    criteria: 'Mild sensory or motor impairment; decreased reflexes'
  },
  {
    level: 'moderate',
    rating: 20,
    description: 'Moderate incomplete paralysis',
    criteria: 'Moderate sensory and motor impairment; some muscle atrophy'
  },
  {
    level: 'severe',
    rating: 40,
    description: 'Severe incomplete paralysis',
    criteria: 'Marked sensory and motor loss; significant muscle atrophy'
  },
  {
    level: 'total',
    rating: 60,
    description: 'Complete paralysis',
    criteria: 'Complete paralysis of affected nerve group'
  }
];

/**
 * Map condition IDs to their rating schedules
 */
export const CONDITION_RATING_SCHEDULES: ConditionRatingSchedule[] = [
  // Mental Health
  { id: 'ptsd', name: 'PTSD', cfrSection: '§ 4.130 DC 9411', dbq: '21-0960P-3', category: 'Mental Health', ratings: MENTAL_HEALTH_FORMULA },
  { id: 'mdd', name: 'Major Depressive Disorder', cfrSection: '§ 4.130 DC 9434', dbq: '21-0960P-3', category: 'Mental Health', ratings: MENTAL_HEALTH_FORMULA },
  { id: 'gad', name: 'Generalized Anxiety Disorder', cfrSection: '§ 4.130 DC 9400', dbq: '21-0960P-3', category: 'Mental Health', ratings: MENTAL_HEALTH_FORMULA },
  { id: 'insomnia', name: 'Insomnia / Sleep Disorder', cfrSection: '§ 4.130', dbq: '21-0960P-3', category: 'Mental Health', ratings: MENTAL_HEALTH_FORMULA.slice(0, 4) },

  // Spine
  { id: 'lumbar', name: 'Lumbar Spine (Lower Back)', cfrSection: '§ 4.71a DC 5237-5243', dbq: '21-0960M-14', category: 'Spine', ratings: SPINE_FORMULA },
  { id: 'cervical', name: 'Cervical Spine (Neck)', cfrSection: '§ 4.71a DC 5237-5243', dbq: '21-0960M-13', category: 'Spine', ratings: SPINE_FORMULA },
  { id: 'thoracic', name: 'Thoracic Spine (Mid-Back)', cfrSection: '§ 4.71a DC 5237-5243', dbq: '21-0960M-14', category: 'Spine', ratings: SPINE_FORMULA.slice(0, 4) },

  // Joints
  { id: 'knee', name: 'Knee Condition', cfrSection: '§ 4.71a DC 5256-5263', dbq: '21-0960M-9', category: 'Joint', ratings: JOINT_FORMULA, bilateralEligible: true },
  { id: 'shoulder', name: 'Shoulder Condition', cfrSection: '§ 4.71a DC 5200-5203', dbq: '21-0960M-12', category: 'Joint', ratings: JOINT_FORMULA, bilateralEligible: true },
  { id: 'hip', name: 'Hip Condition', cfrSection: '§ 4.71a DC 5250-5255', dbq: '21-0960M-5', category: 'Joint', ratings: JOINT_FORMULA, bilateralEligible: true },
  { id: 'ankle', name: 'Ankle Condition', cfrSection: '§ 4.71a DC 5270-5274', dbq: '21-0960M-2', category: 'Joint', ratings: JOINT_FORMULA.slice(0, 4), bilateralEligible: true },

  // Respiratory
  { id: 'sleepapnea', name: 'Sleep Apnea', cfrSection: '§ 4.97 DC 6847', dbq: '21-0960C-1', category: 'Respiratory', ratings: SLEEP_APNEA_FORMULA },

  // Auditory
  { id: 'tinnitus', name: 'Tinnitus', cfrSection: '§ 4.87 DC 6260', dbq: '21-0960N-1', category: 'Auditory', ratings: TINNITUS_FORMULA },

  // Neurological
  { id: 'migraines', name: 'Migraine Headaches', cfrSection: '§ 4.124a DC 8100', dbq: '21-0960N-2', category: 'Neurological', ratings: MIGRAINE_FORMULA },
  { id: 'radiculopathy', name: 'Radiculopathy', cfrSection: '§ 4.124a DC 8520', dbq: '21-0960N-3', category: 'Neurological', ratings: PERIPHERAL_NERVE_FORMULA, bilateralEligible: true },
  { id: 'neuropathy', name: 'Peripheral Neuropathy', cfrSection: '§ 4.124a DC 8520', dbq: '21-0960N-3', category: 'Neurological', ratings: PERIPHERAL_NERVE_FORMULA, bilateralEligible: true },
  { id: 'tbi', name: 'Traumatic Brain Injury', cfrSection: '§ 4.124a DC 8045', dbq: '21-0960C-7', category: 'Neurological', ratings: [
    { level: 'none', rating: 0, description: 'No residuals', criteria: 'No objective residual effects' },
    { level: 'mild', rating: 10, description: 'Mild residuals', criteria: 'TBI with 3 or fewer subjective symptoms that mildly interfere with work' },
    { level: 'moderate', rating: 40, description: 'Moderate residuals', criteria: 'Objective evidence on testing of moderate impairment of memory, attention, or executive functions' },
    { level: 'severe', rating: 70, description: 'Severe residuals', criteria: 'Objective evidence on testing of severe impairment of memory, attention, or executive functions' },
    { level: 'total', rating: 100, description: 'Total residuals', criteria: 'Total impairment in one or more facets of cognitive function' }
  ]},
];

/**
 * Get rating schedule for a condition
 */
export function getConditionRatingSchedule(conditionId: string): ConditionRatingSchedule | undefined {
  return CONDITION_RATING_SCHEDULES.find(c => c.id === conditionId);
}

/**
 * Get rating for a condition at a specific severity level
 */
export function getRatingForSeverity(conditionId: string, severity: SeverityLevel): number {
  const schedule = getConditionRatingSchedule(conditionId);
  if (!schedule) return 0;

  const criteria = schedule.ratings.find(r => r.level === severity);
  return criteria?.rating ?? 0;
}

/**
 * Get all available conditions for the calculator
 */
export function getCalculatorConditions(): Array<{ id: string; name: string; category: string }> {
  return CONDITION_RATING_SCHEDULES.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category
  }));
}

/**
 * Severity level display info
 */
export const SEVERITY_DISPLAY: Record<SeverityLevel, { label: string; color: string; bgColor: string }> = {
  none: { label: 'None', color: 'text-slate-400', bgColor: 'bg-slate-700/50' },
  mild: { label: 'Mild', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  moderate: { label: 'Moderate', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  severe: { label: 'Severe', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  total: { label: 'Total', color: 'text-purple-400', bgColor: 'bg-purple-500/20' }
};

/**
 * Cycle to next severity level
 */
export function cycleSeverity(current: SeverityLevel): SeverityLevel {
  const order: SeverityLevel[] = ['none', 'mild', 'moderate', 'severe', 'total'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}
