/**
 * VAULT DEM Engine — Legal Citations Library
 * Congressional Law, VA Policy, and VBA Policy references for veteran claims
 *
 * @vault-feature VAULT-F-LC-001 Legal Citation Machine
 * @legal-authority 38 U.S.C. (Veterans' Benefits)
 * @legal-authority 38 CFR (Code of Federal Regulations)
 * @legal-authority VBA Manual M21-1
 */

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type CitationType = 'statute' | 'regulation' | 'policy' | 'case_law';
export type CitationCategory = 
  | 'service_connection'
  | 'rating'
  | 'evidence'
  | 'procedure'
  | 'presumptive'
  | 'secondary'
  | 'tdiu'
  | 'smc'
  | 'combined_rating'
  | 'lay_evidence'
  | 'nexus'
  | 'dbq';

export interface LegalCitation {
  id: string;
  type: CitationType;
  category: CitationCategory;
  title: string;
  shortTitle: string;
  reference: string;
  url?: string;
  summary: string;
  applicableConditions?: string[];
  keywords: string[];
}

export interface EvidenceRecord {
  id: string;
  fileName: string;
  type: 'c_file' | 'blue_button' | 'private_medical' | 'military_medical' | 'buddy_statement' | 'nexus' | 'dbq' | 'other';
  uploadedAt: string;
  processedAt?: string;
  extractedData?: {
    dates: string[];
    diagnoses: string[];
    providers: string[];
    icd10Codes: string[];
  };
  linkedConditions: string[];
  linkedCitations: string[];
  provenanceChain: ProvenanceEntry[];
}

export interface ProvenanceEntry {
  timestamp: string;
  event: 'uploaded' | 'processed' | 'linked' | 'verified' | 'cited';
  detail: string;
  citationId?: string;
}

// ═══════════════════════════════════════════════════════════════════
// CONGRESSIONAL LAW (38 U.S.C.)
// ═══════════════════════════════════════════════════════════════════

export const CONGRESSIONAL_STATUTES: LegalCitation[] = [
  {
    id: 'USC-1110',
    type: 'statute',
    category: 'service_connection',
    title: 'Basic Entitlement to Disability Compensation',
    shortTitle: '38 U.S.C. § 1110',
    reference: '38 U.S.C. § 1110',
    url: 'https://www.law.cornell.edu/uscode/text/38/1110',
    summary: 'Establishes entitlement to compensation for service-connected disabilities for veterans who served during wartime.',
    keywords: ['service connection', 'wartime', 'disability', 'compensation', 'basic entitlement']
  },
  {
    id: 'USC-1131',
    type: 'statute',
    category: 'service_connection',
    title: 'Peacetime Disability Compensation',
    shortTitle: '38 U.S.C. § 1131',
    reference: '38 U.S.C. § 1131',
    url: 'https://www.law.cornell.edu/uscode/text/38/1131',
    summary: 'Extends disability compensation to veterans with service-connected disabilities incurred during peacetime service.',
    keywords: ['peacetime', 'service connection', 'disability', 'compensation']
  },
  {
    id: 'USC-1116',
    type: 'statute',
    category: 'presumptive',
    title: 'Presumption of Service Connection — Agent Orange',
    shortTitle: '38 U.S.C. § 1116',
    reference: '38 U.S.C. § 1116',
    url: 'https://www.law.cornell.edu/uscode/text/38/1116',
    summary: 'Establishes presumptive service connection for veterans exposed to herbicide agents (Agent Orange) in Vietnam and other locations.',
    applicableConditions: ['Type 2 Diabetes', 'Ischemic Heart Disease', 'Prostate Cancer', 'Lung Cancer', 'Parkinson\'s Disease', 'Peripheral Neuropathy'],
    keywords: ['agent orange', 'herbicide', 'presumptive', 'vietnam', 'toxic exposure']
  },
  {
    id: 'USC-1117',
    type: 'statute',
    category: 'presumptive',
    title: 'Presumption — Gulf War Veterans',
    shortTitle: '38 U.S.C. § 1117',
    reference: '38 U.S.C. § 1117',
    url: 'https://www.law.cornell.edu/uscode/text/38/1117',
    summary: 'Provides presumptive service connection for undiagnosed illnesses and medically unexplained chronic multisymptom illness in Gulf War veterans.',
    keywords: ['gulf war', 'persian gulf', 'presumptive', 'undiagnosed illness']
  },
  {
    id: 'USC-1118',
    type: 'statute',
    category: 'presumptive',
    title: 'Presumption — Burn Pit Exposure (PACT Act)',
    shortTitle: '38 U.S.C. § 1118',
    reference: '38 U.S.C. § 1118 (as amended by P.L. 117-168)',
    url: 'https://www.congress.gov/bill/117th-congress/house-bill/3967',
    summary: 'The PACT Act (2022) expands presumptive conditions for veterans exposed to burn pits and toxic substances in Southwest Asia and other locations.',
    applicableConditions: ['Asthma', 'Rhinitis', 'Sinusitis', 'Bronchitis', 'COPD', 'Constrictive Bronchiolitis', 'Interstitial Lung Disease', 'Pulmonary Fibrosis'],
    keywords: ['burn pit', 'pact act', 'toxic exposure', 'presumptive', 'southwest asia']
  },
  {
    id: 'USC-1114',
    type: 'statute',
    category: 'smc',
    title: 'Special Monthly Compensation (SMC) Rates',
    shortTitle: '38 U.S.C. § 1114',
    reference: '38 U.S.C. § 1114',
    url: 'https://www.law.cornell.edu/uscode/text/38/1114',
    summary: 'Establishes the rates and eligibility criteria for Special Monthly Compensation (SMC-K through SMC-S), including loss of use, aid and attendance, and housebound benefits.',
    keywords: ['smc', 'special monthly compensation', 'aid attendance', 'housebound', 'loss of use']
  },
  {
    id: 'USC-1155',
    type: 'statute',
    category: 'rating',
    title: 'Authority for Schedule of Ratings',
    shortTitle: '38 U.S.C. § 1155',
    reference: '38 U.S.C. § 1155',
    url: 'https://www.law.cornell.edu/uscode/text/38/1155',
    summary: 'Authorizes the VA to adopt and apply a schedule for rating disabilities (VASRD), based on average impairment of earning capacity.',
    keywords: ['rating schedule', 'vasrd', 'earning capacity', 'disability rating']
  },
  {
    id: 'USC-5107',
    type: 'statute',
    category: 'evidence',
    title: 'Benefit of the Doubt Rule',
    shortTitle: '38 U.S.C. § 5107(b)',
    reference: '38 U.S.C. § 5107(b)',
    url: 'https://www.law.cornell.edu/uscode/text/38/5107',
    summary: 'When evidence is in approximate balance (50/50), the benefit of the doubt shall be given to the claimant. This is a fundamental principle protecting veterans.',
    keywords: ['benefit of doubt', 'equipoise', 'evidence', 'balance', 'claimant']
  },
  {
    id: 'USC-5103A',
    type: 'statute',
    category: 'evidence',
    title: 'Duty to Assist',
    shortTitle: '38 U.S.C. § 5103A',
    reference: '38 U.S.C. § 5103A',
    url: 'https://www.law.cornell.edu/uscode/text/38/5103A',
    summary: 'Requires the VA to make reasonable efforts to assist claimants in obtaining evidence necessary to substantiate claims, including medical examinations.',
    keywords: ['duty to assist', 'evidence', 'va obligation', 'medical examination']
  }
];

// ═══════════════════════════════════════════════════════════════════
// CODE OF FEDERAL REGULATIONS (38 CFR)
// ═══════════════════════════════════════════════════════════════════

export const CFR_REGULATIONS: LegalCitation[] = [
  {
    id: 'CFR-3.303',
    type: 'regulation',
    category: 'service_connection',
    title: 'Principles Relating to Service Connection',
    shortTitle: '38 CFR § 3.303',
    reference: '38 CFR § 3.303',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR2e4021d8c6b06f3/section-3.303',
    summary: 'Establishes the fundamental principles for service connection: disease or injury incurred or aggravated during service with current disability and nexus.',
    keywords: ['service connection', 'principles', 'incurred', 'aggravated', 'nexus']
  },
  {
    id: 'CFR-3.310',
    type: 'regulation',
    category: 'secondary',
    title: 'Secondary Service Connection',
    shortTitle: '38 CFR § 3.310',
    reference: '38 CFR § 3.310',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR2e4021d8c6b06f3/section-3.310',
    summary: 'Allows service connection for disabilities that are proximately due to or aggravated by an already service-connected disability.',
    keywords: ['secondary', 'aggravation', 'proximately due', 'caused by']
  },
  {
    id: 'CFR-4.25',
    type: 'regulation',
    category: 'combined_rating',
    title: 'Combined Ratings Table',
    shortTitle: '38 CFR § 4.25',
    reference: '38 CFR § 4.25',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25',
    summary: 'Prescribes the "whole person" theory for combining multiple disability ratings using the Combined Ratings Table (VA math).',
    keywords: ['combined rating', 'va math', 'whole person', 'table']
  },
  {
    id: 'CFR-4.26',
    type: 'regulation',
    category: 'combined_rating',
    title: 'Bilateral Factor',
    shortTitle: '38 CFR § 4.26',
    reference: '38 CFR § 4.26',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26',
    summary: 'Provides an additional 10% factor applied to combined bilateral disabilities affecting paired extremities (arms, legs, etc.).',
    keywords: ['bilateral', 'bilateral factor', 'paired extremities', '10 percent']
  },
  {
    id: 'CFR-3.159',
    type: 'regulation',
    category: 'evidence',
    title: 'Competency and Credibility of Evidence',
    shortTitle: '38 CFR § 3.159',
    reference: '38 CFR § 3.159',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR2e4021d8c6b06f3/section-3.159',
    summary: 'Defines types of evidence (lay and medical), competency requirements, and the VA\'s duty to assist in claims development.',
    keywords: ['evidence', 'competency', 'lay evidence', 'medical evidence', 'duty to assist']
  },
  {
    id: 'CFR-3.156',
    type: 'regulation',
    category: 'procedure',
    title: 'New and Material Evidence',
    shortTitle: '38 CFR § 3.156',
    reference: '38 CFR § 3.156',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR2e4021d8c6b06f3/section-3.156',
    summary: 'Establishes requirements for reopening previously denied claims with new and material evidence not previously considered.',
    keywords: ['new and material', 'reopen', 'previously denied', 'supplemental claim']
  },
  {
    id: 'CFR-4.16',
    type: 'regulation',
    category: 'tdiu',
    title: 'Total Disability Rating for Individual Unemployability (TDIU)',
    shortTitle: '38 CFR § 4.16',
    reference: '38 CFR § 4.16',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.16',
    summary: 'Allows a 100% rating for veterans whose service-connected disabilities prevent substantially gainful employment. Requires 60% single or 70% combined with one at 40%.',
    keywords: ['tdiu', 'unemployability', 'substantially gainful', '100 percent', 'iu']
  },
  {
    id: 'CFR-3.309',
    type: 'regulation',
    category: 'presumptive',
    title: 'Presumptive Service Connection — Chronic Diseases',
    shortTitle: '38 CFR § 3.309',
    reference: '38 CFR § 3.309',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR2e4021d8c6b06f3/section-3.309',
    summary: 'Lists chronic diseases that may be presumptively service-connected if manifested within one year (or longer for certain conditions) of separation.',
    keywords: ['presumptive', 'chronic disease', 'one year', 'manifestation']
  },
  {
    id: 'CFR-3.303-d',
    type: 'regulation',
    category: 'nexus',
    title: 'Post-Service Diagnosis Service Connection',
    shortTitle: '38 CFR § 3.303(d)',
    reference: '38 CFR § 3.303(d)',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/subject-group-ECFR2e4021d8c6b06f3/section-3.303',
    summary: 'Allows service connection even when a condition is first diagnosed after service, if the evidence establishes it was incurred or aggravated in service.',
    keywords: ['post-service', 'first diagnosed', 'nexus', 'after separation']
  }
];

// ═══════════════════════════════════════════════════════════════════
// VBA POLICY (M21-1 Manual)
// ═══════════════════════════════════════════════════════════════════

export const VBA_POLICY: LegalCitation[] = [
  {
    id: 'M21-1-IV.ii.1.A',
    type: 'policy',
    category: 'service_connection',
    title: 'General Information on Service Connection',
    shortTitle: 'M21-1 IV.ii.1.A',
    reference: 'VBA Manual M21-1, Part IV, Subpart ii, Chapter 1, Section A',
    url: 'https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018/content/554400000014205/M21-1-Part-IV-Subpart-ii-Chapter-1-Section-A-General-Information-on-Service-Connection-SC',
    summary: 'Provides comprehensive guidance on establishing service connection including the three required elements: current disability, in-service event, and nexus.',
    keywords: ['service connection', 'guidance', 'three elements', 'current disability']
  },
  {
    id: 'M21-1-IV.ii.2.D',
    type: 'policy',
    category: 'secondary',
    title: 'Secondary Service Connection Claims',
    shortTitle: 'M21-1 IV.ii.2.D',
    reference: 'VBA Manual M21-1, Part IV, Subpart ii, Chapter 2, Section D',
    summary: 'Detailed procedures for evaluating secondary service connection claims including aggravation theory and medical opinion requirements.',
    keywords: ['secondary', 'aggravation', 'medical opinion', 'procedures']
  },
  {
    id: 'M21-1-III.iv.3.A',
    type: 'policy',
    category: 'lay_evidence',
    title: 'Considering Lay Evidence',
    shortTitle: 'M21-1 III.iv.3.A',
    reference: 'VBA Manual M21-1, Part III, Subpart iv, Chapter 3, Section A',
    summary: 'Establishes that lay evidence (buddy statements, personal statements) is competent evidence of observable symptoms and must be considered by raters.',
    keywords: ['lay evidence', 'buddy statement', 'competent', 'observable', 'symptoms']
  },
  {
    id: 'M21-1-III.iv.4.B',
    type: 'policy',
    category: 'dbq',
    title: 'Disability Benefits Questionnaires (DBQs)',
    shortTitle: 'M21-1 III.iv.4.B',
    reference: 'VBA Manual M21-1, Part III, Subpart iv, Chapter 4, Section B',
    summary: 'Guidance on using DBQs for medical examinations, including when private DBQs are acceptable and what information they must contain.',
    keywords: ['dbq', 'medical examination', 'private dbq', 'questionnaire']
  },
  {
    id: 'M21-1-IV.ii.2.C',
    type: 'policy',
    category: 'nexus',
    title: 'Evaluating Nexus Opinions',
    shortTitle: 'M21-1 IV.ii.2.C',
    reference: 'VBA Manual M21-1, Part IV, Subpart ii, Chapter 2, Section C',
    summary: 'Standards for evaluating medical nexus opinions including "at least as likely as not" (50% or greater probability) standard.',
    keywords: ['nexus', 'medical opinion', 'at least as likely', 'probability', '50 percent']
  },
  {
    id: 'M21-1-IV.ii.1.C',
    type: 'policy',
    category: 'evidence',
    title: 'Evidence Requirements for Service Connection',
    shortTitle: 'M21-1 IV.ii.1.C',
    reference: 'VBA Manual M21-1, Part IV, Subpart ii, Chapter 1, Section C',
    summary: 'Specifies the types of evidence required to establish service connection, including service treatment records, private medical records, and nexus statements.',
    keywords: ['evidence', 'service treatment records', 'medical records', 'requirements']
  }
];

// ═══════════════════════════════════════════════════════════════════
// EVIDENCE TYPE CITATIONS
// ═══════════════════════════════════════════════════════════════════

export const EVIDENCE_TYPE_CITATIONS: Record<string, LegalCitation[]> = {
  c_file: [
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.159')! },
    { ...VBA_POLICY.find(c => c.id === 'M21-1-IV.ii.1.C')! }
  ],
  blue_button: [
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.159')! },
    { ...CONGRESSIONAL_STATUTES.find(c => c.id === 'USC-5103A')! }
  ],
  private_medical: [
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.159')! },
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.303-d')! }
  ],
  military_medical: [
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.303')! },
    { ...VBA_POLICY.find(c => c.id === 'M21-1-IV.ii.1.A')! }
  ],
  buddy_statement: [
    { ...VBA_POLICY.find(c => c.id === 'M21-1-III.iv.3.A')! },
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.159')! }
  ],
  nexus: [
    { ...VBA_POLICY.find(c => c.id === 'M21-1-IV.ii.2.C')! },
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.303')! },
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.310')! }
  ],
  dbq: [
    { ...VBA_POLICY.find(c => c.id === 'M21-1-III.iv.4.B')! },
    { ...CFR_REGULATIONS.find(c => c.id === 'CFR-3.159')! }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function getAllCitations(): LegalCitation[] {
  return [...CONGRESSIONAL_STATUTES, ...CFR_REGULATIONS, ...VBA_POLICY];
}

export function getCitationById(id: string): LegalCitation | undefined {
  return getAllCitations().find(c => c.id === id);
}

export function getCitationsByCategory(category: CitationCategory): LegalCitation[] {
  return getAllCitations().filter(c => c.category === category);
}

export function getCitationsForEvidenceType(type: EvidenceRecord['type']): LegalCitation[] {
  return EVIDENCE_TYPE_CITATIONS[type] || [];
}

export function getCitationsForCondition(conditionName: string): LegalCitation[] {
  const lowered = conditionName.toLowerCase();
  return getAllCitations().filter(c => 
    c.applicableConditions?.some(ac => ac.toLowerCase().includes(lowered) || lowered.includes(ac.toLowerCase())) ||
    c.keywords.some(k => lowered.includes(k))
  );
}

export function searchCitations(query: string): LegalCitation[] {
  const lowered = query.toLowerCase();
  return getAllCitations().filter(c =>
    c.title.toLowerCase().includes(lowered) ||
    c.reference.toLowerCase().includes(lowered) ||
    c.summary.toLowerCase().includes(lowered) ||
    c.keywords.some(k => k.includes(lowered))
  );
}

export function formatCitationForDocument(citation: LegalCitation): string {
  return `${citation.reference} — ${citation.title}`;
}

export function formatCitationsBlock(citations: LegalCitation[]): string {
  if (!citations.length) return '';
  
  const grouped = {
    statute: citations.filter(c => c.type === 'statute'),
    regulation: citations.filter(c => c.type === 'regulation'),
    policy: citations.filter(c => c.type === 'policy')
  };

  let block = '\n\nLEGAL AUTHORITY\n' + '─'.repeat(50) + '\n\n';

  if (grouped.statute.length) {
    block += 'Congressional Law (38 U.S.C.):\n';
    grouped.statute.forEach(c => {
      block += `  • ${c.reference}: ${c.title}\n`;
    });
    block += '\n';
  }

  if (grouped.regulation.length) {
    block += 'VA Regulations (38 CFR):\n';
    grouped.regulation.forEach(c => {
      block += `  • ${c.reference}: ${c.title}\n`;
    });
    block += '\n';
  }

  if (grouped.policy.length) {
    block += 'VBA Policy (M21-1):\n';
    grouped.policy.forEach(c => {
      block += `  • ${c.reference}: ${c.title}\n`;
    });
    block += '\n';
  }

  return block;
}

// ═══════════════════════════════════════════════════════════════════
// DBQ TEMPLATES
// ═══════════════════════════════════════════════════════════════════

export interface DBQTemplate {
  id: string;
  formNumber: string;
  name: string;
  bodySystem: string;
  description: string;
  pdfUrl: string;
  requiredForConditions: string[];
  keyFields: string[];
}

export const DBQ_TEMPLATES: DBQTemplate[] = [
  {
    id: 'dbq-mental',
    formNumber: '21-0960A-1',
    name: 'Mental Disorders (except PTSD and Eating Disorders)',
    bodySystem: 'mental',
    description: 'For conditions including depression, anxiety, bipolar, adjustment disorder, and other mental health conditions excluding PTSD.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960P-1-ARE.pdf',
    requiredForConditions: ['mdd', 'gad', 'bipolar', 'adjustment', 'ocd', 'insomnia', 'mst'],
    keyFields: ['Diagnosis', 'Occupational Impairment', 'Social Impairment', 'Symptoms', 'GAF Score (if applicable)']
  },
  {
    id: 'dbq-ptsd',
    formNumber: '21-0960P-3',
    name: 'Review Post Traumatic Stress Disorder (PTSD)',
    bodySystem: 'mental',
    description: 'Specifically for PTSD diagnosis and rating, including stressor verification.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960P-3-ARE.pdf',
    requiredForConditions: ['ptsd'],
    keyFields: ['Diagnosis', 'Stressor', 'Criterion A-F', 'Occupational Impairment', 'Social Impairment']
  },
  {
    id: 'dbq-back',
    formNumber: '21-0960M-14',
    name: 'Back (Thoracolumbar Spine) Conditions',
    bodySystem: 'musculoskeletal',
    description: 'For lumbar and thoracic spine conditions including degenerative disc disease, stenosis, and strain.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960M-14-ARE.pdf',
    requiredForConditions: ['lumbar', 'thoracic'],
    keyFields: ['Range of Motion', 'Pain on Motion', 'IVDS Episodes', 'Neurological Abnormalities', 'Functional Loss']
  },
  {
    id: 'dbq-neck',
    formNumber: '21-0960M-13',
    name: 'Neck (Cervical Spine) Conditions',
    bodySystem: 'musculoskeletal',
    description: 'For cervical spine conditions including degenerative changes and radiculopathy.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960M-13-ARE.pdf',
    requiredForConditions: ['cervical'],
    keyFields: ['Range of Motion', 'Pain on Motion', 'IVDS Episodes', 'Neurological Abnormalities']
  },
  {
    id: 'dbq-knee',
    formNumber: '21-0960M-9',
    name: 'Knee and Lower Leg Conditions',
    bodySystem: 'musculoskeletal',
    description: 'For knee conditions including meniscus tears, instability, and degenerative changes.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960M-9-ARE.pdf',
    requiredForConditions: ['knee'],
    keyFields: ['Range of Motion', 'Instability', 'Meniscal Conditions', 'Pain', 'Functional Loss']
  },
  {
    id: 'dbq-sleep-apnea',
    formNumber: '21-0960C-1',
    name: 'Sleep Apnea',
    bodySystem: 'respiratory',
    description: 'For obstructive, central, or mixed sleep apnea diagnosis and severity rating.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960C-1-ARE.pdf',
    requiredForConditions: ['sleepapnea'],
    keyFields: ['Sleep Study Results', 'CPAP/BiPAP Required', 'Persistent Daytime Hypersomnolence']
  },
  {
    id: 'dbq-tbi',
    formNumber: '21-0960C-7',
    name: 'Traumatic Brain Injury (TBI)',
    bodySystem: 'neurological',
    description: 'For TBI residuals including cognitive, emotional, and physical symptoms.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960C-7-ARE.pdf',
    requiredForConditions: ['tbi'],
    keyFields: ['Facets of TBI', 'Memory/Concentration', 'Executive Function', 'Subjective Symptoms']
  },
  {
    id: 'dbq-hearing',
    formNumber: '21-0960J-2',
    name: 'Hearing Loss and Tinnitus',
    bodySystem: 'auditory',
    description: 'For hearing loss and tinnitus, requires audiometric testing.',
    pdfUrl: 'https://www.vba.va.gov/pubs/forms/VBA-21-0960J-2-ARE.pdf',
    requiredForConditions: ['hearing', 'tinnitus'],
    keyFields: ['Puretone Thresholds', 'Speech Discrimination', 'Tinnitus Recurrence']
  }
];

// ═══════════════════════════════════════════════════════════════════
// NEXUS LETTER TEMPLATE
// ═══════════════════════════════════════════════════════════════════

export interface NexusLetterTemplate {
  title: string;
  sections: {
    name: string;
    description: string;
    required: boolean;
    placeholder: string;
  }[];
  legalStandard: string;
  citations: LegalCitation[];
}

export const NEXUS_LETTER_TEMPLATE: NexusLetterTemplate = {
  title: 'Independent Medical Opinion / Nexus Letter',
  sections: [
    {
      name: 'Physician Credentials',
      description: 'Include full name, license number, specialty, and qualifications',
      required: true,
      placeholder: '[Dr. Full Name, MD/DO]\n[License # and State]\n[Board Certifications]\n[Years of Practice]'
    },
    {
      name: 'Review of Records',
      description: 'List all records reviewed including service treatment records, VA records, and private records',
      required: true,
      placeholder: '• Service Treatment Records (dates)\n• VA Medical Records (dates)\n• C-File documentation\n• Private Medical Records (dates)'
    },
    {
      name: 'Veteran History',
      description: 'Summarize relevant military service, including dates, duties, and exposure events',
      required: true,
      placeholder: '[Veteran Name] served in [Branch] from [Start Date] to [End Date].\nMOS/Rate: [Military Occupation]\nDeployments: [Locations and Dates]\nRelevant in-service events: [Description]'
    },
    {
      name: 'Current Diagnosis',
      description: 'State the current diagnosis with ICD-10 code if applicable',
      required: true,
      placeholder: 'The veteran is diagnosed with [CONDITION] (ICD-10: [CODE]).\nThis diagnosis is based on [clinical findings, imaging, testing, etc.].'
    },
    {
      name: 'Nexus Opinion',
      description: 'The critical section linking current condition to service. Must use "at least as likely as not" standard.',
      required: true,
      placeholder: 'It is my medical opinion that the veteran\'s [CONDITION] is AT LEAST AS LIKELY AS NOT (50% probability or greater) caused by OR aggravated by [in-service event/service-connected condition].'
    },
    {
      name: 'Medical Rationale',
      description: 'Detailed explanation supporting the nexus opinion with medical literature and reasoning',
      required: true,
      placeholder: 'This opinion is based on the following rationale:\n\n1. The veteran\'s service records document [in-service event/injury/exposure].\n2. Medical literature supports [cite relevant studies].\n3. The clinical timeline demonstrates [continuity of symptoms].\n4. [Additional supporting evidence].'
    },
    {
      name: 'Signature Block',
      description: 'Physician signature, date, and contact information',
      required: true,
      placeholder: '____________________________\n[Physician Name, Credentials]\nDate: ____________\nContact: [Phone/Email]'
    }
  ],
  legalStandard: 'The "at least as likely as not" standard requires a 50% or greater probability that the condition is related to service. This is the applicable standard per 38 CFR § 3.102 and VBA Manual M21-1.',
  citations: [
    CFR_REGULATIONS.find(c => c.id === 'CFR-3.303')!,
    CFR_REGULATIONS.find(c => c.id === 'CFR-3.310')!,
    VBA_POLICY.find(c => c.id === 'M21-1-IV.ii.2.C')!,
    CONGRESSIONAL_STATUTES.find(c => c.id === 'USC-5107')!
  ]
};

export function getDBQForCondition(conditionId: string): DBQTemplate | undefined {
  return DBQ_TEMPLATES.find(dbq => dbq.requiredForConditions.includes(conditionId));
}

export function getDBQsByBodySystem(systemId: string): DBQTemplate[] {
  return DBQ_TEMPLATES.filter(dbq => dbq.bodySystem === systemId);
}

export default {
  CONGRESSIONAL_STATUTES,
  CFR_REGULATIONS,
  VBA_POLICY,
  DBQ_TEMPLATES,
  NEXUS_LETTER_TEMPLATE,
  getAllCitations,
  getCitationById,
  getCitationsByCategory,
  getCitationsForEvidenceType,
  getCitationsForCondition,
  searchCitations,
  formatCitationForDocument,
  formatCitationsBlock,
  getDBQForCondition,
  getDBQsByBodySystem
};

