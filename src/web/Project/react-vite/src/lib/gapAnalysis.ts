/**
 * VDIO Narrative Engine — Gap Analysis Engine
 * Phase 3: Compare User Intent vs. Evidence Map. Identify Gaps and Risks.
 *
 * @vault-feature VDIO-GAP-001 Evidence Gap Detection
 * @legal-authority 38 CFR 3.159 (Duty to Assist)
 */
import type { SelectedCondition } from '../types';
import type { OCRIndexEntry, GapResult } from '../stores/narrativeStore';
import { searchIndexByCondition } from './ocrSchema';
import { BODY_SYSTEMS } from '../data/bodySystems';

// ═══════════════════════════════════════════════════════════════════
// EVIDENCE REQUIREMENTS BY CONDITION TYPE
// ═══════════════════════════════════════════════════════════════════

interface EvidenceRequirement {
  type: 'required' | 'helpful';
  description: string;
  examples: string[];
}

// Generic evidence requirements by body system
const SYSTEM_EVIDENCE_REQUIREMENTS: Record<string, EvidenceRequirement[]> = {
  mental: [
    { type: 'required', description: 'Diagnosis from licensed mental health provider', examples: ['Psychiatrist evaluation', 'Psychologist assessment', 'VA mental health record'] },
    { type: 'required', description: 'Current symptoms documentation', examples: ['GAF score', 'PHQ-9 results', 'Clinical notes'] },
    { type: 'helpful', description: 'Stressor verification (for PTSD)', examples: ['Combat Action Ribbon', 'Deployment orders', 'Unit records'] },
    { type: 'helpful', description: 'Buddy/lay statements on behavior changes', examples: ['Spouse statement', 'Coworker observations', 'Family testimony'] },
  ],
  musculoskeletal: [
    { type: 'required', description: 'Range of motion measurements', examples: ['Physical therapy notes', 'C&P exam', 'Orthopedic evaluation'] },
    { type: 'required', description: 'Diagnostic imaging', examples: ['X-ray', 'MRI', 'CT scan'] },
    { type: 'helpful', description: 'In-service injury documentation', examples: ['Service treatment records', 'Line of duty report', 'Accident report'] },
    { type: 'helpful', description: 'Continuity of treatment', examples: ['Ongoing physical therapy', 'Prescription history', 'Follow-up appointments'] },
  ],
  respiratory: [
    { type: 'required', description: 'Pulmonary function test (PFT)', examples: ['FEV1 results', 'FVC results', 'DLCO measurements'] },
    { type: 'required', description: 'Diagnosis documentation', examples: ['Pulmonologist report', 'Sleep study for apnea', 'Chest X-ray'] },
    { type: 'helpful', description: 'Exposure documentation', examples: ['Burn pit registry', 'Deployment location records', 'Hazard exposure reports'] },
  ],
  neurological: [
    { type: 'required', description: 'Neurological examination', examples: ['EMG/NCV study', 'Neurology consult', 'Brain MRI'] },
    { type: 'helpful', description: 'TBI documentation', examples: ['Incident report', 'Medical evacuation records', 'Post-deployment health assessment'] },
    { type: 'helpful', description: 'Symptom frequency log', examples: ['Headache diary', 'Seizure log', 'Symptom tracker'] },
  ],
  auditory: [
    { type: 'required', description: 'Audiogram results', examples: ['Pure tone thresholds', 'Speech discrimination scores', 'VA audiology exam'] },
    { type: 'required', description: 'Noise exposure documentation', examples: ['MOS hazardous noise list', 'Hearing conservation program records', 'Weapons qualification records'] },
  ],
  cardiovascular: [
    { type: 'required', description: 'Cardiac evaluation', examples: ['EKG/ECG', 'Echocardiogram', 'Stress test results'] },
    { type: 'required', description: 'Blood pressure readings (for hypertension)', examples: ['Multiple BP readings', 'Ambulatory BP monitoring', 'Treatment records'] },
  ],
  // Add more systems as needed
};

// Default requirements for systems not explicitly defined
const DEFAULT_EVIDENCE_REQUIREMENTS: EvidenceRequirement[] = [
  { type: 'required', description: 'Current diagnosis from qualified provider', examples: ['Doctor\'s report', 'Specialist evaluation', 'VA treatment record'] },
  { type: 'required', description: 'In-service occurrence or aggravation', examples: ['Service treatment records', 'Line of duty report', 'Incident documentation'] },
  { type: 'helpful', description: 'Nexus statement linking condition to service', examples: ['Independent medical opinion', 'Doctor\'s nexus letter', 'Specialist statement'] },
  { type: 'helpful', description: 'Lay/buddy statements', examples: ['Personal statement', 'Family observations', 'Coworker testimony'] },
];

// ═══════════════════════════════════════════════════════════════════
// GAP ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function getConditionSystem(conditionId: string): string | null {
  for (const system of BODY_SYSTEMS) {
    if (system.conditions.some(c => c.id === conditionId)) {
      return system.id;
    }
  }
  return null;
}

function getEvidenceRequirements(systemId: string): EvidenceRequirement[] {
  return SYSTEM_EVIDENCE_REQUIREMENTS[systemId] || DEFAULT_EVIDENCE_REQUIREMENTS;
}

function assessEvidenceCompleteness(
  conditionId: string,
  ocrEntries: OCRIndexEntry[]
): { found: string[]; missing: string[]; score: number } {
  const systemId = getConditionSystem(conditionId);
  const requirements = getEvidenceRequirements(systemId || 'default');
  
  const found: string[] = [];
  const missing: string[] = [];
  
  const requiredCount = requirements.filter(r => r.type === 'required').length;
  let requiredFound = 0;
  
  for (const req of requirements) {
    // Check if any OCR entry might satisfy this requirement
    const hasEvidence = ocrEntries.some(entry => {
      const snippet = entry.snippet.toLowerCase();
      return req.examples.some(example => 
        snippet.includes(example.toLowerCase()) ||
        req.description.toLowerCase().split(' ').some(word => 
          word.length > 3 && snippet.includes(word)
        )
      );
    });
    
    if (hasEvidence) {
      found.push(req.description);
      if (req.type === 'required') requiredFound++;
    } else if (req.type === 'required') {
      missing.push(req.description);
    }
  }
  
  // Score based on required evidence found
  const score = requiredCount > 0 ? (requiredFound / requiredCount) * 100 : 0;
  
  return { found, missing, score };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN GAP ANALYSIS
// ═══════════════════════════════════════════════════════════════════

/**
 * Analyze gaps between selected conditions and available evidence
 */
export function analyzeGaps(
  selectedConditions: SelectedCondition[],
  ocrIndex: OCRIndexEntry[]
): GapResult[] {
  const results: GapResult[] = [];
  
  for (const condition of selectedConditions) {
    // Find all OCR entries tagged with this condition
    const relevantEntries = searchIndexByCondition(ocrIndex, condition.id);
    
    // Also search by condition name and keywords
    const nameMatches = ocrIndex.filter(entry => {
      const snippet = entry.snippet.toLowerCase();
      const conditionName = condition.name.toLowerCase();
      return snippet.includes(conditionName) ||
             conditionName.split(' ').some(word => 
               word.length > 3 && snippet.includes(word)
             );
    });
    
    // Combine and deduplicate
    const allRelevant = [...relevantEntries];
    for (const match of nameMatches) {
      if (!allRelevant.find(e => e.id === match.id)) {
        allRelevant.push(match);
      }
    }
    
    // Assess evidence completeness
    const assessment = assessEvidenceCompleteness(condition.id, allRelevant);
    
    // Determine status
    let status: GapResult['status'];
    let suggestedAction: GapResult['suggestedAction'];
    
    if (allRelevant.length === 0) {
      status = 'gap';
      suggestedAction = 'lay_evidence';
    } else if (assessment.score >= 75) {
      status = 'ready';
      suggestedAction = 'proceed';
    } else if (assessment.score >= 25) {
      status = 'partial';
      suggestedAction = assessment.missing.length > 0 ? 'request_records' : 'lay_evidence';
    } else {
      status = 'gap';
      suggestedAction = 'request_records';
    }
    
    results.push({
      conditionId: condition.id,
      conditionName: condition.name,
      status,
      evidenceFound: allRelevant,
      evidenceMissing: assessment.missing,
      suggestedAction,
    });
  }
  
  return results;
}

/**
 * Get summary statistics for gap analysis
 */
export function getGapSummary(gaps: GapResult[]): {
  ready: number;
  partial: number;
  gap: number;
  total: number;
  readyPercentage: number;
} {
  const ready = gaps.filter(g => g.status === 'ready').length;
  const partial = gaps.filter(g => g.status === 'partial').length;
  const gap = gaps.filter(g => g.status === 'gap').length;
  const total = gaps.length;
  
  return {
    ready,
    partial,
    gap,
    total,
    readyPercentage: total > 0 ? Math.round((ready / total) * 100) : 0,
  };
}

/**
 * Get conditions that need lay evidence
 */
export function getConditionsNeedingLayEvidence(gaps: GapResult[]): GapResult[] {
  return gaps.filter(g => g.suggestedAction === 'lay_evidence');
}

/**
 * Get conditions that need additional records
 */
export function getConditionsNeedingRecords(gaps: GapResult[]): GapResult[] {
  return gaps.filter(g => g.suggestedAction === 'request_records');
}

/**
 * Generate VA Form 20-10206 request list for missing records
 */
export function generateRecordRequestList(gaps: GapResult[]): {
  condition: string;
  recordsNeeded: string[];
  suggestedSources: string[];
}[] {
  const needsRecords = getConditionsNeedingRecords(gaps);
  
  return needsRecords.map(gap => ({
    condition: gap.conditionName,
    recordsNeeded: gap.evidenceMissing,
    suggestedSources: [
      'VA Medical Center Records',
      'Private Treatment Records',
      'Service Treatment Records',
      'Military Personnel Records',
    ],
  }));
}

export default {
  analyzeGaps,
  getGapSummary,
  getConditionsNeedingLayEvidence,
  getConditionsNeedingRecords,
  generateRecordRequestList,
};

