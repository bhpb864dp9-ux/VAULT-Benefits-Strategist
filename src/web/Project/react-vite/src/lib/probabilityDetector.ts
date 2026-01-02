/**
 * VDIO Narrative Engine — Probability Detector
 * Phase 5: Compare Narrative Strength vs. BVA Historical Decisions.
 *
 * Combined Heuristic + Historical Approach:
 * - Heuristic Score (65%): Evidence count, citation strength, gap penalty, red team penalty
 * - Historical Baseline (35%): Condition-specific approval rates
 *
 * @vault-feature VDIO-PD-001 Approval Probability Scoring
 */
import type { OCRIndexEntry, GapResult, RedTeamFlag, NarrativeBlock, LayEvidenceEntry, ProbabilityResult } from '../stores/narrativeStore';

// ═══════════════════════════════════════════════════════════════════
// HISTORICAL BASELINES
// ═══════════════════════════════════════════════════════════════════

/**
 * Historical approval rates by condition (approximate based on VA/BVA data)
 * These represent baseline success rates before considering individual evidence strength
 */
const CONDITION_BASELINES: Record<string, number> = {
  // Auditory - Very High (well-documented, objective testing)
  tinnitus: 93,
  hearing: 78,
  menieres: 65,
  
  // Mental Health - High (subjective but well-established criteria)
  ptsd: 85,
  mdd: 80,
  gad: 78,
  bipolar: 72,
  insomnia: 70,
  mst: 75,
  adjustment: 68,
  ocd: 70,
  
  // Musculoskeletal - Medium-High (objective ROM measurements)
  lumbar: 72,
  cervical: 70,
  knee: 68,
  shoulder: 65,
  hip: 62,
  ankle: 60,
  wrist: 58,
  elbow: 58,
  plantar: 55,
  flatfeet: 60,
  fibro: 52,
  arthritis: 65,
  thoracic: 65,
  
  // Respiratory - Medium (requires documented testing)
  sleepapnea: 65,
  asthma: 60,
  copd: 58,
  sinusitis: 55,
  rhinitis: 52,
  bronchitis: 55,
  pulmonary: 50,
  
  // Neurological - Medium (can be complex to prove)
  tbi: 70,
  migraines: 68,
  neuropathy: 60,
  radiculopathy: 58,
  carpal: 62,
  sciatica: 55,
  vertigo: 58,
  seizures: 52,
  parkinsons: 75, // Presumptive for AO
  ms: 60,
  
  // Cardiovascular - Medium-High
  hypertension: 65,
  cad: 70, // Presumptive for AO
  arrhythmia: 60,
  chf: 58,
  
  // Default for unlisted conditions
  default: 55,
};

/**
 * Claim type modifiers
 */
const CLAIM_TYPE_MODIFIERS: Record<string, number> = {
  new: 0,           // Baseline
  increase: 5,      // Easier to prove worsening
  secondary: -10,   // Requires nexus to primary
  supplemental: -5, // Prior denial creates hurdle
  appeal: -15,      // Prior denial, higher bar
};

// ═══════════════════════════════════════════════════════════════════
// SCORING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

interface ScoringInput {
  ocrIndex: OCRIndexEntry[];
  gapAnalysis: GapResult[];
  redTeamFlags: RedTeamFlag[];
  narrativeBlocks: NarrativeBlock[];
  layEvidence: LayEvidenceEntry[];
  conditionIds: string[];
  claimType: 'new' | 'increase' | 'secondary' | 'appeal' | 'supplemental';
}

/**
 * Calculate evidence score (0-100)
 * Weight: 30% of heuristic score
 */
function calculateEvidenceScore(input: ScoringInput): number {
  const { ocrIndex, layEvidence, conditionIds } = input;
  
  if (conditionIds.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const conditionId of conditionIds) {
    // Count relevant OCR entries
    const relevantOcr = ocrIndex.filter(e => 
      e.taggedCondition === conditionId ||
      e.taggedCondition.toLowerCase().includes(conditionId.toLowerCase())
    );
    
    // Count lay evidence
    const relevantLay = layEvidence.filter(l => l.conditionId === conditionId);
    
    // Score based on evidence volume
    let conditionScore = 0;
    
    if (relevantOcr.length >= 5) {
      conditionScore = 100;
    } else if (relevantOcr.length >= 3) {
      conditionScore = 80;
    } else if (relevantOcr.length >= 1) {
      conditionScore = 60;
    } else if (relevantLay.length >= 1) {
      conditionScore = 40; // Lay evidence alone is weaker but valid
    } else {
      conditionScore = 10;
    }
    
    // Bonus for multiple evidence types
    if (relevantOcr.length > 0 && relevantLay.length > 0) {
      conditionScore = Math.min(100, conditionScore + 10);
    }
    
    totalScore += conditionScore;
  }
  
  return Math.round(totalScore / conditionIds.length);
}

/**
 * Calculate citation score (0-100)
 * Weight: 20% of heuristic score
 */
function calculateCitationScore(input: ScoringInput): number {
  const { narrativeBlocks } = input;
  
  if (narrativeBlocks.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const block of narrativeBlocks) {
    const evidenceCount = block.evidenceCitations.length;
    const lawCount = block.lawCitations.length;
    
    // Evidence citations (up to 50 points)
    let blockScore = Math.min(50, evidenceCount * 10);
    
    // Law citations (up to 50 points)
    blockScore += Math.min(50, lawCount * 15);
    
    // Penalty for placeholder citations
    if (block.evidenceCitations.some(c => c.includes('[NOTE:'))) {
      blockScore -= 20;
    }
    
    totalScore += Math.max(0, blockScore);
  }
  
  return Math.round(Math.min(100, totalScore / narrativeBlocks.length));
}

/**
 * Calculate gap penalty (0-100, where 100 = no gaps)
 * Weight: 15% of heuristic score (as negative)
 */
function calculateGapScore(input: ScoringInput): number {
  const { gapAnalysis } = input;
  
  if (gapAnalysis.length === 0) return 100;
  
  const ready = gapAnalysis.filter(g => g.status === 'ready').length;
  const partial = gapAnalysis.filter(g => g.status === 'partial').length;
  const gap = gapAnalysis.filter(g => g.status === 'gap').length;
  const total = gapAnalysis.length;
  
  // Weighted average: ready = full points, partial = half, gap = zero
  const score = ((ready * 100) + (partial * 50) + (gap * 0)) / total;
  
  return Math.round(score);
}

/**
 * Calculate red team penalty (0-100, where 100 = no issues)
 * Weight: 20% of heuristic score (as negative)
 */
function calculateRedTeamScore(input: ScoringInput): number {
  const { redTeamFlags } = input;
  
  if (redTeamFlags.length === 0) return 100;
  
  const criticalCount = redTeamFlags.filter(f => f.severity === 'critical').length;
  const warningCount = redTeamFlags.filter(f => f.severity === 'warning').length;
  
  // Each critical = -20 points, each warning = -5 points
  const penalty = (criticalCount * 20) + (warningCount * 5);
  
  return Math.max(0, 100 - penalty);
}

/**
 * Calculate historical baseline (0-100)
 * Weight: 35% of total score
 */
function calculateHistoricalBaseline(input: ScoringInput): number {
  const { conditionIds, claimType } = input;
  
  if (conditionIds.length === 0) return CONDITION_BASELINES.default;
  
  // Average baseline across all conditions
  let totalBaseline = 0;
  for (const id of conditionIds) {
    const baseline = CONDITION_BASELINES[id.toLowerCase()] ?? CONDITION_BASELINES.default;
    totalBaseline += baseline;
  }
  
  const averageBaseline = totalBaseline / conditionIds.length;
  
  // Apply claim type modifier
  const modifier = CLAIM_TYPE_MODIFIERS[claimType] ?? 0;
  
  return Math.max(0, Math.min(100, averageBaseline + modifier));
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PROBABILITY CALCULATION
// ═══════════════════════════════════════════════════════════════════

export function calculateProbability(input: ScoringInput): ProbabilityResult {
  // Calculate individual scores
  const evidenceScore = calculateEvidenceScore(input);
  const citationScore = calculateCitationScore(input);
  const gapScore = calculateGapScore(input);
  const redTeamScore = calculateRedTeamScore(input);
  const historicalBaseline = calculateHistoricalBaseline(input);
  
  // Calculate gap and red team penalties (inverted from 100)
  const gapPenalty = 100 - gapScore;
  const redTeamPenalty = 100 - redTeamScore;
  
  // Calculate heuristic component (65% of total)
  // Evidence: 30%, Citation: 20%, Gap: -15%, RedTeam: -20%
  const heuristicRaw = (
    (evidenceScore * 0.30) +
    (citationScore * 0.20) +
    (gapScore * 0.15) +       // Using positive score, not penalty
    (redTeamScore * 0.20)     // Using positive score, not penalty
  ) / 0.85; // Normalize back to 0-100 range
  
  // Calculate final score
  // Heuristic: 65%, Historical: 35%
  const overall = Math.round(
    (heuristicRaw * 0.65) + (historicalBaseline * 0.35)
  );
  
  // Determine rating
  let rating: ProbabilityResult['rating'];
  if (overall >= 70) {
    rating = 'High';
  } else if (overall >= 45) {
    rating = 'Medium';
  } else {
    rating = 'Low';
  }
  
  // Generate explanation
  const explanation = generateExplanation(
    overall,
    rating,
    evidenceScore,
    citationScore,
    gapPenalty,
    redTeamPenalty,
    historicalBaseline,
    input
  );
  
  return {
    overall,
    breakdown: {
      evidenceScore,
      citationScore,
      gapPenalty,
      redTeamPenalty,
      historicalBaseline,
    },
    rating,
    explanation,
  };
}

function generateExplanation(
  overall: number,
  rating: ProbabilityResult['rating'],
  evidenceScore: number,
  _citationScore: number,
  gapPenalty: number,
  redTeamPenalty: number,
  historicalBaseline: number,
  input: ScoringInput
): string {
  const parts: string[] = [];
  
  // Overall assessment
  if (rating === 'High') {
    parts.push(`Your claim shows strong probability of approval (${overall}%).`);
  } else if (rating === 'Medium') {
    parts.push(`Your claim has a moderate probability of approval (${overall}%). There are areas to strengthen.`);
  } else {
    parts.push(`Your claim currently shows a lower probability of approval (${overall}%). Significant improvements are recommended.`);
  }
  
  // Evidence feedback
  if (evidenceScore >= 80) {
    parts.push('You have strong documentary evidence supporting your conditions.');
  } else if (evidenceScore >= 50) {
    parts.push('Your evidence is adequate but could be strengthened with additional documentation.');
  } else {
    parts.push('Your evidence is limited. Consider adding medical records or lay statements.');
  }
  
  // Gap feedback
  if (gapPenalty > 30) {
    parts.push(`${input.gapAnalysis.filter(g => g.status === 'gap').length} condition(s) have significant evidence gaps.`);
  }
  
  // Red team feedback
  if (redTeamPenalty > 20) {
    const critical = input.redTeamFlags.filter(f => f.severity === 'critical').length;
    parts.push(`Warning: ${critical} critical issue(s) found in your evidence that should be addressed.`);
  }
  
  // Historical context
  parts.push(`Historical approval rates for your conditions average ${Math.round(historicalBaseline)}%.`);
  
  return parts.join(' ');
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════

export function getConditionBaseline(conditionId: string): number {
  return CONDITION_BASELINES[conditionId.toLowerCase()] ?? CONDITION_BASELINES.default;
}

export function getAllBaselines(): Record<string, number> {
  return { ...CONDITION_BASELINES };
}

export function getProbabilityColor(rating: ProbabilityResult['rating']): string {
  switch (rating) {
    case 'High': return 'text-emerald-400';
    case 'Medium': return 'text-amber-400';
    case 'Low': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getProbabilityBgColor(rating: ProbabilityResult['rating']): string {
  switch (rating) {
    case 'High': return 'bg-emerald-500/10 border-emerald-500/30';
    case 'Medium': return 'bg-amber-500/10 border-amber-500/30';
    case 'Low': return 'bg-red-500/10 border-red-500/30';
    default: return 'bg-slate-500/10 border-slate-500/30';
  }
}

export default {
  calculateProbability,
  getConditionBaseline,
  getAllBaselines,
  getProbabilityColor,
  getProbabilityBgColor,
};

