/**
 * VDIO Narrative Engine — C&P Exam Pre-Brief Generator
 * Phase 5: Prepare the veteran for their Compensation & Pension exam.
 *
 * Maps conditions to DBQs and generates personalized exam preparation sheets.
 *
 * @vault-feature VDIO-EPB-001 Exam Preparation Briefing
 */
import type { SelectedCondition } from '../types';
import type { OCRIndexEntry, ExamPreBrief } from '../stores/narrativeStore';
import { formatIndexCitation } from './ocrSchema';
import { DBQ_TEMPLATES } from './legalCitations';

// ═══════════════════════════════════════════════════════════════════
// DBQ MAPPINGS
// ═══════════════════════════════════════════════════════════════════

interface DBQMapping {
  conditionPatterns: string[];
  dbqFormNumber: string;
  dbqName: string;
  keyQuestions: string[];
  measurementsNeeded: string[];
  examTips: string[];
}

const DBQ_MAPPINGS: DBQMapping[] = [
  // Mental Health
  {
    conditionPatterns: ['ptsd', 'mst', 'trauma'],
    dbqFormNumber: '21-0960P-3',
    dbqName: 'PTSD DBQ',
    keyQuestions: [
      'What was the stressor event?',
      'How often do you experience intrusive memories or flashbacks?',
      'Do you have difficulty sleeping? Nightmares?',
      'Do you avoid reminders of the trauma?',
      'How has your condition affected your work and relationships?',
    ],
    measurementsNeeded: [
      'DSM-5 diagnostic criteria assessment',
      'Occupational and social impairment level',
      'GAF or equivalent functional score',
    ],
    examTips: [
      'Describe your WORST days, not your average',
      'Be honest about symptoms—don\'t minimize',
      'Mention if symptoms have worsened recently',
      'Bring a list of all medications you take',
      'Consider having a family member present if allowed',
    ],
  },
  {
    conditionPatterns: ['mdd', 'depression', 'depressive'],
    dbqFormNumber: '21-0960P-2',
    dbqName: 'Mental Disorders (other than PTSD and Eating Disorders) DBQ',
    keyQuestions: [
      'When did your depression symptoms start?',
      'How often do you feel depressed?',
      'Do you have difficulty with concentration, memory, or motivation?',
      'Have you had thoughts of self-harm?',
      'How does depression affect your daily functioning?',
    ],
    measurementsNeeded: [
      'DSM-5 criteria evaluation',
      'PHQ-9 or similar depression screening',
      'Functional impairment assessment',
    ],
    examTips: [
      'Describe symptoms over the past 6-12 months',
      'Mention any hospitalizations or crisis episodes',
      'Explain impact on employment if applicable',
    ],
  },
  {
    conditionPatterns: ['gad', 'anxiety'],
    dbqFormNumber: '21-0960P-2',
    dbqName: 'Mental Disorders (other than PTSD and Eating Disorders) DBQ',
    keyQuestions: [
      'What triggers your anxiety?',
      'Do you have panic attacks? How often?',
      'How does anxiety affect your sleep?',
      'Do you avoid situations due to anxiety?',
    ],
    measurementsNeeded: [
      'DSM-5 criteria for GAD',
      'GAD-7 or similar screening',
      'Panic disorder assessment if applicable',
    ],
    examTips: [
      'Describe frequency and severity of symptoms',
      'Mention all medications tried',
      'Explain if symptoms limit your activities',
    ],
  },
  
  // Musculoskeletal - Spine
  {
    conditionPatterns: ['lumbar', 'cervical', 'thoracic', 'spine', 'back', 'neck'],
    dbqFormNumber: '21-0960M-14',
    dbqName: 'Back (Thoracolumbar Spine) Conditions DBQ',
    keyQuestions: [
      'Where exactly is your pain located?',
      'Does the pain radiate to your legs or arms?',
      'Do you have numbness, tingling, or weakness?',
      'What makes the pain better or worse?',
      'Have you had any surgery on your spine?',
    ],
    measurementsNeeded: [
      'Range of motion (forward flexion, extension, lateral flexion, rotation)',
      'Pain on movement (degrees where pain begins)',
      'Repeated use testing (3 repetitions)',
      'Flare-up impact assessment',
      'Neurological examination',
    ],
    examTips: [
      'DO NOT push through pain during ROM testing',
      'Stop and say "PAIN" when you feel it',
      'Describe your WORST flare-ups and how often they occur',
      'Mention if you use a brace, cane, or TENS unit',
      'Arrive at your worst—don\'t take extra pain meds before',
    ],
  },
  
  // Musculoskeletal - Joints
  {
    conditionPatterns: ['knee', 'meniscus'],
    dbqFormNumber: '21-0960M-9',
    dbqName: 'Knee and Lower Leg Conditions DBQ',
    keyQuestions: [
      'Do you have instability or giving way?',
      'Does your knee lock or catch?',
      'Do you use a knee brace?',
      'How far can you walk before pain stops you?',
    ],
    measurementsNeeded: [
      'Range of motion (flexion and extension in degrees)',
      'Stability testing (Lachman, McMurray)',
      'Weight-bearing capability',
      'Repetitive use testing',
    ],
    examTips: [
      'Wear shorts to the exam for easy access',
      'Stop ROM testing when you feel pain—don\'t push through',
      'Mention any clicking, popping, or grinding',
      'Describe activities you can no longer do',
    ],
  },
  {
    conditionPatterns: ['shoulder'],
    dbqFormNumber: '21-0960M-13',
    dbqName: 'Shoulder and Arm Conditions DBQ',
    keyQuestions: [
      'Can you raise your arm overhead?',
      'Do you have pain reaching behind your back?',
      'Does your shoulder feel weak or unstable?',
    ],
    measurementsNeeded: [
      'Range of motion (abduction, flexion, rotation)',
      'Pain-free motion in degrees',
      'Hawkins, Neer, and Empty Can tests',
    ],
    examTips: [
      'Demonstrate limitations honestly',
      'Mention if you avoid certain movements',
      'Describe how condition affects work tasks',
    ],
  },
  
  // Auditory
  {
    conditionPatterns: ['tinnitus'],
    dbqFormNumber: '21-0960N-1',
    dbqName: 'Ear Conditions DBQ',
    keyQuestions: [
      'When did you first notice ringing in your ears?',
      'Is it constant or intermittent?',
      'Does it affect your concentration or sleep?',
      'What noise exposure did you have in service?',
    ],
    measurementsNeeded: [
      'Subjective description of tinnitus',
      'Impact on daily activities',
      'Audiological evaluation',
    ],
    examTips: [
      'Describe the sound (ringing, buzzing, hissing)',
      'Explain how it affects your daily life and sleep',
      'Document your MOS and noise exposure',
    ],
  },
  {
    conditionPatterns: ['hearing', 'loss'],
    dbqFormNumber: '21-0960N-6',
    dbqName: 'Hearing Loss and Tinnitus DBQ',
    keyQuestions: [
      'Do you have difficulty understanding speech?',
      'Do you wear hearing aids?',
      'What was your noise exposure in service?',
    ],
    measurementsNeeded: [
      'Pure tone audiometry',
      'Speech discrimination (Maryland CNC)',
      'Comparison with baseline audiograms',
    ],
    examTips: [
      'Don\'t guess during speech recognition testing',
      'If you don\'t understand, say "I don\'t know"',
      'Bring any previous audiograms if available',
    ],
  },
  
  // Respiratory
  {
    conditionPatterns: ['sleepapnea', 'sleep', 'apnea'],
    dbqFormNumber: '21-0960J-2',
    dbqName: 'Sleep Apnea DBQ',
    keyQuestions: [
      'Have you had a sleep study?',
      'Do you use a CPAP or BiPAP?',
      'How often do you use it per night?',
      'Do you have excessive daytime sleepiness?',
    ],
    measurementsNeeded: [
      'Polysomnography (sleep study) results',
      'AHI (apnea-hypopnea index)',
      'CPAP compliance records',
    ],
    examTips: [
      'Bring your sleep study report',
      'Bring CPAP compliance data (download from machine)',
      'Describe daytime symptoms (fatigue, concentration issues)',
    ],
  },
  {
    conditionPatterns: ['asthma', 'bronchitis', 'copd', 'respiratory'],
    dbqFormNumber: '21-0960L-1',
    dbqName: 'Respiratory Conditions DBQ',
    keyQuestions: [
      'How often do you use an inhaler?',
      'Have you been hospitalized for breathing issues?',
      'What triggers your breathing problems?',
    ],
    measurementsNeeded: [
      'Pulmonary function test (PFT)',
      'FEV1, FVC, FEV1/FVC ratio, DLCO',
      'Frequency of exacerbations',
    ],
    examTips: [
      'PFT requires maximum effort—don\'t hold back',
      'Bring list of all respiratory medications',
      'Document frequency of doctor visits for this condition',
    ],
  },
  
  // Neurological
  {
    conditionPatterns: ['tbi', 'traumatic brain'],
    dbqFormNumber: '21-0960C-1',
    dbqName: 'Traumatic Brain Injury (TBI) DBQ',
    keyQuestions: [
      'How did your head injury occur?',
      'Did you lose consciousness? For how long?',
      'Do you have memory or concentration problems?',
      'Do you have headaches? How often?',
    ],
    measurementsNeeded: [
      'Cognitive function assessment',
      'Memory and concentration testing',
      'Headache frequency and severity',
      'Emotional/behavioral changes',
    ],
    examTips: [
      'Describe all symptoms—memory, headaches, irritability',
      'Bring records of the original injury if available',
      'Have family member corroborate behavioral changes',
    ],
  },
  {
    conditionPatterns: ['migraine', 'headache'],
    dbqFormNumber: '21-0960C-8',
    dbqName: 'Headaches (Including Migraine Headaches) DBQ',
    keyQuestions: [
      'How often do you get headaches?',
      'How long do they last?',
      'What symptoms accompany them? (aura, nausea, light sensitivity)',
      'Do you miss work due to headaches?',
    ],
    measurementsNeeded: [
      'Frequency (times per month)',
      'Duration of attacks',
      'Prostrating vs. non-prostrating classification',
      'Economic impact (work missed)',
    ],
    examTips: [
      'Keep a headache diary leading up to the exam',
      'Count prostrating headaches (bed rest required)',
      'Document ALL missed work or activities',
    ],
  },
  {
    conditionPatterns: ['radiculopathy', 'neuropathy', 'nerve'],
    dbqFormNumber: '21-0960C-4',
    dbqName: 'Peripheral Nerves Conditions DBQ',
    keyQuestions: [
      'Where do you feel numbness or tingling?',
      'Do you have weakness in any muscles?',
      'Is the condition getting worse?',
    ],
    measurementsNeeded: [
      'EMG/NCV study results',
      'Sensory examination',
      'Motor strength testing',
      'Reflex testing',
    ],
    examTips: [
      'Describe exactly where symptoms occur',
      'Mention if symptoms are constant or intermittent',
      'Bring any nerve conduction study results',
    ],
  },
  
  // Default for unmapped conditions
  {
    conditionPatterns: [],
    dbqFormNumber: 'General',
    dbqName: 'General Medical Examination',
    keyQuestions: [
      'When did your condition begin?',
      'How has it changed over time?',
      'What treatments have you tried?',
      'How does it affect your daily activities?',
    ],
    measurementsNeeded: [
      'Complete medical history',
      'Physical examination',
      'Relevant diagnostic testing',
    ],
    examTips: [
      'Be thorough and honest about symptoms',
      'Describe your WORST days',
      'Bring all relevant medical records',
      'List all medications and treatments tried',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAPPING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function findDBQMapping(conditionId: string, conditionName: string): DBQMapping {
  const searchTerms = [conditionId.toLowerCase(), conditionName.toLowerCase()];
  
  for (const mapping of DBQ_MAPPINGS) {
    for (const pattern of mapping.conditionPatterns) {
      if (searchTerms.some(term => term.includes(pattern))) {
        return mapping;
      }
    }
  }
  
  // Return default mapping
  return DBQ_MAPPINGS[DBQ_MAPPINGS.length - 1];
}

// ═══════════════════════════════════════════════════════════════════
// PRE-BRIEF GENERATOR
// ═══════════════════════════════════════════════════════════════════

export function generateExamPreBrief(
  condition: SelectedCondition,
  ocrEntries: OCRIndexEntry[]
): ExamPreBrief {
  const mapping = findDBQMapping(condition.id, condition.name);
  
  // Find relevant documents to mention from OCR index
  const relevantDocs = ocrEntries
    .filter(e => 
      e.taggedCondition === condition.id ||
      e.taggedCondition.toLowerCase().includes(condition.id.toLowerCase())
    )
    .slice(0, 5)
    .map(e => formatIndexCitation(e));
  
  return {
    conditionId: condition.id,
    conditionName: condition.name,
    dbqForm: `${mapping.dbqFormNumber} - ${mapping.dbqName}`,
    keyQuestions: mapping.keyQuestions,
    measurementsNeeded: mapping.measurementsNeeded,
    documentsToMention: relevantDocs.length > 0 
      ? relevantDocs 
      : ['No specific documents indexed. Bring any records you have.'],
    tipsForVeteran: mapping.examTips,
  };
}

/**
 * Generate exam pre-briefs for all conditions
 */
export function generateAllExamPreBriefs(
  conditions: SelectedCondition[],
  ocrIndex: OCRIndexEntry[]
): ExamPreBrief[] {
  return conditions.map(condition => {
    const relevantEntries = ocrIndex.filter(e => 
      e.taggedCondition === condition.id ||
      e.taggedCondition.toLowerCase().includes(condition.id.toLowerCase())
    );
    
    return generateExamPreBrief(condition, relevantEntries);
  });
}

// ═══════════════════════════════════════════════════════════════════
// FORMATTED OUTPUT
// ═══════════════════════════════════════════════════════════════════

export function formatExamPreBriefText(preBrief: ExamPreBrief): string {
  return `
C&P EXAM PREPARATION SHEET
${'═'.repeat(60)}

CONDITION: ${preBrief.conditionName}
DBQ FORM: ${preBrief.dbqForm}

${'─'.repeat(60)}
QUESTIONS THE EXAMINER SHOULD ASK:
${'─'.repeat(60)}
${preBrief.keyQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

${'─'.repeat(60)}
MEASUREMENTS/TESTS REQUIRED:
${'─'.repeat(60)}
${preBrief.measurementsNeeded.map((m) => `• ${m}`).join('\n')}

${'─'.repeat(60)}
DOCUMENTS IN YOUR FILE TO REFERENCE:
${'─'.repeat(60)}
${preBrief.documentsToMention.map((d, i) => `${i + 1}. ${d}`).join('\n')}

${'─'.repeat(60)}
EXAM TIPS:
${'─'.repeat(60)}
${preBrief.tipsForVeteran.map((t) => `★ ${t}`).join('\n')}

${'═'.repeat(60)}
`;
}

/**
 * Generate a complete exam preparation package
 */
export function generateExamPackageText(preBriefs: ExamPreBrief[]): string {
  const date = new Date().toLocaleDateString();
  
  let text = `
${'═'.repeat(60)}
C&P EXAMINATION PREPARATION PACKAGE
${'═'.repeat(60)}
Generated by VAULT DEM Engine
Date: ${date}

TOTAL CONDITIONS: ${preBriefs.length}

GENERAL EXAM TIPS:
─────────────────
1. Arrive at your WORST, not your best
2. Don't take extra pain medication before the exam
3. Don't push through pain during testing—stop and say so
4. Describe your worst days, not your average
5. Bring a list of all medications
6. Consider bringing a support person
7. Take breaks if needed

`;
  
  for (let i = 0; i < preBriefs.length; i++) {
    text += `\n${i + 1}/${preBriefs.length}: `;
    text += formatExamPreBriefText(preBriefs[i]);
  }
  
  text += `
${'═'.repeat(60)}
END OF EXAM PREPARATION PACKAGE
${'═'.repeat(60)}

IMPORTANT: This is a preparation guide only. The actual exam may 
vary based on your specific circumstances. Answer all questions 
honestly and thoroughly.
`;
  
  return text;
}

/**
 * Get DBQ form info for templates integration
 */
export function getDBQForCondition(conditionId: string, conditionName: string): {
  formNumber: string;
  formName: string;
  url?: string;
} {
  const mapping = findDBQMapping(conditionId, conditionName);
  const template = DBQ_TEMPLATES.find(t => 
    t.name.toLowerCase().includes(mapping.dbqName.toLowerCase()) ||
    mapping.conditionPatterns.some(p => t.name.toLowerCase().includes(p))
  );
  
  return {
    formNumber: mapping.dbqFormNumber,
    formName: mapping.dbqName,
    url: template?.pdfUrl,
  };
}

export default {
  generateExamPreBrief,
  generateAllExamPreBriefs,
  formatExamPreBriefText,
  generateExamPackageText,
  getDBQForCondition,
};

