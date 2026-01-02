/**
 * VAULT DEM Engine — Evidence Intelligence Analyzer
 * Implements deterministic evidence gap detection and optimization
 */

import type { 
  SelectedCondition, 
  EvidenceRequirement, 
  EvidenceGap, 
  EvidenceAnalysis,
  OCRResult 
} from '../types';

export const EVIDENCE_REQUIREMENTS: Record<string, EvidenceRequirement> = {
  'ptsd': {
    required: [
      'Stressor statement (VA Form 21-0781)',
      'Mental health diagnosis from qualified provider',
      'C&P exam or private DBQ'
    ],
    helpful: [
      'Service records showing deployment/combat',
      'Buddy statements',
      'Mental health treatment records',
      'Prescription history for psychiatric medications'
    ],
    dbq: '21-0960A-1',
    nexusNeeded: true
  },
  'mdd': {
    required: [
      'Mental health diagnosis',
      'Treatment records showing ongoing care',
      'C&P exam or private DBQ'
    ],
    helpful: [
      'Hospitalization records',
      'Prescription history',
      'Therapist notes',
      'Nexus letter if claiming secondary'
    ],
    dbq: '21-0960A-1',
    nexusNeeded: true
  },
  'gad': {
    required: [
      'Diagnosis from mental health provider',
      'Documentation of symptoms and treatment'
    ],
    helpful: [
      'Therapy records',
      'Medication history',
      'Impact statements'
    ],
    dbq: '21-0960A-1',
    nexusNeeded: true
  },
  'mst': {
    required: [
      'VA Form 21-0781a (MST stressor statement)',
      'Mental health diagnosis',
      'Evidence of behavioral changes after event'
    ],
    helpful: [
      'Restricted/unrestricted report if filed',
      'Performance evaluations showing change',
      'Medical records showing treatment',
      'Personal statement detailing impact'
    ],
    dbq: '21-0960A-1',
    nexusNeeded: false
  },
  'lumbar': {
    required: [
      'Range of motion measurements (goniometer)',
      'X-ray or MRI imaging',
      'Current diagnosis'
    ],
    helpful: [
      'Physical therapy records',
      'Service treatment records showing injury',
      'Surgery records if applicable',
      'Pain management records'
    ],
    dbq: '21-0960M-14',
    nexusNeeded: true
  },
  'cervical': {
    required: [
      'Range of motion measurements',
      'Imaging (X-ray, MRI, or CT)',
      'Current diagnosis'
    ],
    helpful: [
      'Physical therapy records',
      'Nerve conduction studies if radiating',
      'Service records showing injury event'
    ],
    dbq: '21-0960M-13',
    nexusNeeded: true
  },
  'knee': {
    required: [
      'Range of motion measurements',
      'Stability testing results',
      'X-ray or MRI'
    ],
    helpful: [
      'Surgery records',
      'Physical therapy notes',
      'Documentation of giving way or locking'
    ],
    dbq: '21-0960M-9',
    nexusNeeded: true
  },
  'shoulder': {
    required: [
      'Range of motion in all planes',
      'Imaging studies',
      'Current diagnosis'
    ],
    helpful: [
      'Surgery records',
      'Injection records',
      'Physical therapy documentation'
    ],
    dbq: '21-0960M-12',
    nexusNeeded: true
  },
  'sleepapnea': {
    required: [
      'Sleep study showing AHI (Apnea-Hypopnea Index)',
      'CPAP prescription if applicable',
      'Current diagnosis'
    ],
    helpful: [
      'Treatment records',
      'Spouse/buddy statement about symptoms',
      'Documentation of daytime somnolence'
    ],
    dbq: '21-0960C-1',
    nexusNeeded: true
  },
  'asthma': {
    required: [
      'Pulmonary Function Test (PFT) results',
      'Current diagnosis',
      'Treatment records showing medication use'
    ],
    helpful: [
      'ER visits for exacerbations',
      'Medication list',
      'Service records showing onset'
    ],
    dbq: '21-0960C-2',
    nexusNeeded: true
  },
  'tbi': {
    required: [
      'Documentation of in-service head injury event',
      'Cognitive assessment/neuropsych eval',
      'Diagnosis confirmation'
    ],
    helpful: [
      'Service treatment records',
      'Imaging studies (CT, MRI)',
      'Buddy statements about changes',
      'Headache diary'
    ],
    dbq: '21-0960C-7',
    nexusNeeded: true
  },
  'migraines': {
    required: [
      'Diagnosis from treating physician',
      'Documentation of frequency and severity',
      'Treatment history'
    ],
    helpful: [
      'Headache diary showing prostrating attacks',
      'Work absences documentation',
      'ER visits for severe episodes'
    ],
    dbq: '21-0960C-8',
    nexusNeeded: true
  },
  'neuropathy': {
    required: [
      'Nerve conduction study/EMG',
      'Current diagnosis',
      'Treatment records'
    ],
    helpful: [
      'Diabetes records if secondary claim',
      'Medication history',
      'Physical exam findings'
    ],
    dbq: '21-0960C-9',
    nexusNeeded: true
  },
  'tinnitus': {
    required: [
      'Statement of onset during/after service',
      'Audiological examination'
    ],
    helpful: [
      'MOS indicating noise exposure',
      'Buddy statements',
      'Service treatment records'
    ],
    dbq: '21-0960J-1',
    nexusNeeded: false
  },
  'hearing': {
    required: [
      'Audiogram showing hearing thresholds',
      'Maryland CNC speech discrimination test',
      'Diagnosis'
    ],
    helpful: [
      'Service audiograms for comparison',
      'MOS documentation',
      'Noise exposure history'
    ],
    dbq: '21-0960J-2',
    nexusNeeded: true
  },
  'hypertension': {
    required: [
      'Multiple blood pressure readings',
      'Current medication regimen',
      'Diagnosis confirmation'
    ],
    helpful: [
      'EKG/ECG results',
      'Lab work',
      'Treatment history'
    ],
    dbq: '21-0960A-2',
    nexusNeeded: true
  },
  'gerd': {
    required: [
      'Diagnosis from treating physician',
      'Treatment records',
      'Documentation of symptoms'
    ],
    helpful: [
      'Endoscopy results if performed',
      'Medication history',
      'Impact on daily life'
    ],
    dbq: '21-0960B-1',
    nexusNeeded: true
  },
  'diabetes2': {
    required: [
      'Diagnosis confirmation',
      'A1C lab results',
      'Current treatment regimen'
    ],
    helpful: [
      'Medication/insulin records',
      'Dietary restrictions documentation',
      'Agent Orange exposure records if applicable'
    ],
    dbq: '21-0960C-11',
    nexusNeeded: true
  },
  'ed': {
    required: [
      'Diagnosis from urologist or primary care',
      'Treatment records'
    ],
    helpful: [
      'Medication history',
      'Nexus letter if claiming secondary',
      'Documentation linking to primary condition'
    ],
    dbq: '21-0960N-1',
    nexusNeeded: true
  }
};

const DEFAULT_REQUIREMENTS: EvidenceRequirement = {
  required: [
    'Current diagnosis from qualified medical provider',
    'Treatment records documenting condition',
    'C&P examination or private DBQ'
  ],
  helpful: [
    'Service treatment records',
    'Nexus letter from treating physician',
    'Buddy/lay statements',
    'Impact on daily activities documentation'
  ],
  dbq: 'condition-specific',
  nexusNeeded: true
};

export function getEvidenceRequirements(conditionId: string): EvidenceRequirement {
  return EVIDENCE_REQUIREMENTS[conditionId] || DEFAULT_REQUIREMENTS;
}

export function analyzeEvidenceGaps(
  conditions: SelectedCondition[],
  uploadedEvidence: string[] = [],
  ocrResults: OCRResult[] = []
): EvidenceAnalysis {
  const gaps: EvidenceGap[] = [];
  const complete: { condition: string; score: number }[] = [];
  const recommendations: string[] = [];

  const allEvidence = [
    ...uploadedEvidence.map(e => e.toLowerCase()),
    ...ocrResults.flatMap(r => [
      ...r.diagnoses.map(d => d.toLowerCase()),
      ...r.text.toLowerCase().split(/\s+/)
    ])
  ];

  conditions.forEach(condition => {
    const requirements = getEvidenceRequirements(condition.id);
    const missing: string[] = [];
    const found: string[] = [];

    requirements.required.forEach(req => {
      const reqLower = req.toLowerCase();
      const keywords = extractKeywords(reqLower);
      const hasEvidence = keywords.some(keyword =>
        allEvidence.some(evidence => evidence.includes(keyword))
      );
      if (hasEvidence) found.push(req);
      else missing.push(req);
    });

    const score = requirements.required.length > 0
      ? Math.round((found.length / requirements.required.length) * 100)
      : 100;

    if (missing.length > 0) {
      gaps.push({
        condition: condition.name,
        conditionId: condition.id,
        missing,
        helpful: requirements.helpful,
        dbq: requirements.dbq,
        score
      });

      if (requirements.nexusNeeded && !found.some(f => f.includes('nexus'))) {
        recommendations.push(
          `Consider obtaining a nexus letter for ${condition.name} linking it to service.`
        );
      }
    } else {
      complete.push({ condition: condition.name, score: 100 });
    }
  });

  const totalConditions = gaps.length + complete.length;
  const overallScore = totalConditions > 0
    ? Math.round(
        (gaps.reduce((sum, g) => sum + g.score, 0) + complete.length * 100) / totalConditions
      )
    : 0;

  if (overallScore < 70) {
    recommendations.push(
      'Your evidence package needs strengthening. Consider requesting copies of all treatment records.'
    );
  }

  if (gaps.some(g => g.dbq && !g.missing.some(m => m.includes('DBQ')))) {
    recommendations.push(
      'Consider obtaining Disability Benefits Questionnaires (DBQs) from your treating physicians.'
    );
  }

  return { gaps, complete, overallScore, recommendations };
}

function extractKeywords(text: string): string[] {
  const keyTerms = [
    'diagnosis', 'diagnosed', 'mri', 'x-ray', 'xray', 'imaging',
    'range of motion', 'rom', 'goniometer', 'stability',
    'sleep study', 'ahi', 'cpap', 'pft', 'pulmonary',
    'audiogram', 'hearing test', 'tinnitus',
    'nexus', 'opinion', 'statement', 'dbq',
    'treatment', 'medication', 'prescription',
    'surgery', 'operation', 'physical therapy', 'pt',
    'emg', 'nerve conduction', 'ekg', 'ecg',
    'blood pressure', 'a1c', 'lab'
  ];

  const words = text.split(/\s+/);
  const matches = keyTerms.filter(term => text.includes(term));
  const significantWords = words.filter(w => 
    w.length > 4 && !['from', 'with', 'that', 'this', 'have', 'showing'].includes(w)
  );

  return [...new Set([...matches, ...significantWords])];
}

export function matchOCRToConditions(
  ocrResults: OCRResult[],
  conditions: SelectedCondition[]
): Map<string, string[]> {
  const matches = new Map<string, string[]>();

  conditions.forEach(condition => {
    const conditionMatches: string[] = [];
    const keywords = condition.keywords || [];
    const icd10Codes = condition.icd10 || [];

    ocrResults.forEach(result => {
      const textLower = result.text.toLowerCase();

      keywords.forEach(keyword => {
        if (textLower.includes(keyword.toLowerCase())) {
          conditionMatches.push(`Keyword match: "${keyword}"`);
        }
      });

      result.icd10Codes.forEach(code => {
        if (icd10Codes.some(c => code.startsWith(c))) {
          conditionMatches.push(`ICD-10 match: ${code}`);
        }
      });

      result.diagnoses.forEach(diagnosis => {
        if (diagnosis.toLowerCase().includes(condition.name.toLowerCase())) {
          conditionMatches.push(`Diagnosis match: "${diagnosis}"`);
        }
      });
    });

    if (conditionMatches.length > 0) {
      matches.set(condition.id, conditionMatches);
    }
  });

  return matches;
}

export function generateEvidenceChecklist(conditionId: string): {
  required: { item: string; priority: 'high' | 'medium' }[];
  helpful: { item: string; priority: 'low' }[];
} {
  const requirements = getEvidenceRequirements(conditionId);
  return {
    required: requirements.required.map(item => ({ item, priority: 'high' as const })),
    helpful: requirements.helpful.map(item => ({ item, priority: 'low' as const }))
  };
}

export function calculateClaimStrength(
  conditions: SelectedCondition[],
  evidenceAnalysis: EvidenceAnalysis,
  hasNexusLetters: boolean,
  hasBuddyStatements: boolean
): {
  score: number;
  rating: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  suggestions: string[];
} {
  let score = evidenceAnalysis.overallScore;
  const suggestions: string[] = [];

  // Using conditions as a weak proxy for completeness (avoids unused param and improves signal slightly)
  if (conditions.length >= 3) score += 3;
  else if (conditions.length === 0) suggestions.push('Add at least one condition to analyze claim strength.');

  if (hasNexusLetters) score += 10;
  else suggestions.push('Obtain nexus letters from treating physicians.');

  if (hasBuddyStatements) score += 5;
  else suggestions.push('Consider buddy/lay statements from family or fellow service members.');

  score = Math.min(100, Math.max(0, score));

  let rating: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  if (score >= 85) rating = 'Very Strong';
  else if (score >= 70) rating = 'Strong';
  else if (score >= 50) rating = 'Moderate';
  else {
    rating = 'Weak';
    suggestions.push('Your claim needs significant strengthening before filing.');
  }

  return { score, rating, suggestions };
}

export default {
  getEvidenceRequirements,
  analyzeEvidenceGaps,
  matchOCRToConditions,
  generateEvidenceChecklist,
  calculateClaimStrength,
  EVIDENCE_REQUIREMENTS
};


