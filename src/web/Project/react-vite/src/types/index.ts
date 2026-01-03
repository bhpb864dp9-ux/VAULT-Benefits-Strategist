/**
 * VAULT DEM Engine — Type Definitions
 * Comprehensive types for the entire application
 */

// ═══════════════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════════════

export type MissionType = 'INITIAL' | 'INCREASE' | 'SECONDARY' | 'SUPPLEMENTAL' | 'HLR' | 'BDD';

export type BodySystemId = 
  | 'mental' | 'musculoskeletal' | 'respiratory' | 'neurological'
  | 'auditory' | 'cardiovascular' | 'digestive' | 'genitourinary'
  | 'endocrine' | 'skin' | 'vision' | 'dental' | 'infectious'
  | 'hematologic' | 'gynecological';

export type IntentLevel = 0 | 1 | 2 | 3 | 4; // none, mild, moderate, severe, total

export type LimbSide = 'left' | 'right' | 'bilateral';

export type LimbType = 
  | 'arm' | 'leg' | 'hand' | 'foot' | 'knee' | 'hip' 
  | 'shoulder' | 'ankle' | 'elbow' | 'wrist';

// ═══════════════════════════════════════════════════════════════════
// CONDITION & BODY SYSTEM TYPES
// ═══════════════════════════════════════════════════════════════════

export interface Condition {
  id: string;
  name: string;
  dbq: string;
  ratings: number[];
  presumptive?: string[];
  secondary?: string[];
  keywords?: string[];
  icd10?: string[];
  bilateralEligible?: boolean;
  limbType?: LimbType;
}

export interface BodySystem {
  id: BodySystemId;
  name: string;
  icon: string;
  cfrSection: string;
  conditions: Condition[];
}

export interface SelectedCondition extends Condition {
  system: BodySystemId;
  selectedRating?: number;
  side?: LimbSide;
  isBilateral?: boolean;
  notes?: string;
  severity?: IntentLevel;  // REL-019: Severity level (0=none, 1=mild, 2=moderate, 3=severe)
}

// ═══════════════════════════════════════════════════════════════════
// IDENTITY & CLAIM DATA TYPES
// ═══════════════════════════════════════════════════════════════════

export interface VeteranIdentity {
  name: string;
  ssn?: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  branch?: 'Army' | 'Navy' | 'Air Force' | 'Marine Corps' | 'Coast Guard' | 'Space Force';
  rank?: string;
  mos?: string;
  entryDate?: string;
  separationDate?: string;
  serviceType?: 'Active Duty' | 'Reserve' | 'National Guard';
  combatVeteran?: boolean;
  deployments?: string[];
}

/**
 * Veteran Claims for Heroes & Hardship Program Eligibility
 * Used to determine free access qualifications
 */
export interface VeteranClaimsStatus {
  // Hardship indicators
  isHomeless?: boolean;
  rating?: number;
  isPermanentTotal?: boolean;
  isTDIU?: boolean;
  isGoldStarFamily?: boolean;

  // Valor awards (IDs match FREE_ACCESS_QUALIFICATIONS)
  awards?: string[];
}

export interface Dependents {
  spouse: boolean;
  spouseName?: string;
  children: number;
  childrenUnder18?: number;
  childrenInSchool?: number;
  dependentParents?: number;
}

export interface POAInfo {
  type: 'VSO' | 'Attorney' | 'Agent' | 'Family' | 'VBIO' | 'None';
  organizationName?: string;
  representativeName?: string;
  vaCode?: string;
  phone?: string;
  email?: string;
}

export interface BattleBuddyInfo {
  enabled: boolean;
  name?: string;
  relation?: string;
}

export type TimelineEventType = 'service' | 'medical' | 'life' | 'evidence';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date?: string; // YYYY-MM-DD (optional if unknown)
  title: string;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  value: string;
  phase?: number;
}

// ═══════════════════════════════════════════════════════════════════
// CALCULATOR TYPES
// ═══════════════════════════════════════════════════════════════════

export interface RatingInput {
  id: string;
  name: string;
  value: number;
  isBilateral?: boolean;
  side?: LimbSide;
  limbType?: LimbType;
}

export interface CombinedRatingResult {
  exactValue: number;
  combined: number;
  bilateralFactor: number;
  bilateralCombined: number;
  breakdown: {
    bilateral: RatingInput[];
    nonBilateral: RatingInput[];
  };
  steps: CalculationStep[];
}

export interface CalculationStep {
  description: string;
  value: number;
  remainingEfficiency: number;
}

export interface CompensationResult {
  monthly: number;
  annual: number;
  colaRate: number;
  colaYear: number;
  effectiveDate: string;
  breakdown: {
    base: number;
    spouse?: number;
    children?: number;
    parents?: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
// TDIU & SMC TYPES
// ═══════════════════════════════════════════════════════════════════

export type TDIUPathway = 'Single Condition' | 'Combined Conditions' | 'Extrascheduler';

export interface TDIUResult {
  eligible: boolean | 'extrascheduler';
  pathway: TDIUPathway | null;
  explanation: string;
  requirements: string[];
  forms: string[];
}

export type SMCType = 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'R1' | 'R2' | 'S' | 'T';

export interface SMCResult {
  type: `SMC-${SMCType}`;
  eligible: boolean;
  amount: number;
  reason: string;
  cfrReference: string;
  conditions?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// EVIDENCE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface EvidenceRequirement {
  required: string[];
  helpful: string[];
  dbq: string;
  nexusNeeded: boolean;
}

export interface EvidenceGap {
  condition: string;
  conditionId: string;
  missing: string[];
  helpful: string[];
  dbq: string;
  score: number;
}

export interface EvidenceAnalysis {
  gaps: EvidenceGap[];
  complete: { condition: string; score: number }[];
  overallScore: number;
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════════
// OCR TYPES
// ═══════════════════════════════════════════════════════════════════

export interface OCRResult {
  text: string;
  confidence: number;
  diagnoses: string[];
  dates: string[];
  icd10Codes: string[];
  medications: string[];
  providers: string[];
  processingTime: number;
}

export interface OCRProgress {
  status: 'idle' | 'loading' | 'recognizing' | 'complete' | 'error';
  progress: number;
  message: string;
}

// ═══════════════════════════════════════════════════════════════════
// FORM GENERATION TYPES
// ═══════════════════════════════════════════════════════════════════

export type VAFormId = 
  | '21-526EZ' | '21-4138' | '21-8940' | '20-0995' | '20-0996'
  | '21-2680' | '21-0781' | '21-0781a' | '21-22' | '21-22a';

export interface VAFormTemplate {
  id: VAFormId;
  name: string;
  description: string;
  pages: number;
  fields: string[];
}

export interface GeneratedForm {
  formId: VAFormId;
  formName: string;
  generatedAt: string;
  fields: Record<string, unknown>;
  completionPercentage: number;
  status: 'draft' | 'incomplete' | 'ready';
  pdfBlob?: Blob;
}

// ═══════════════════════════════════════════════════════════════════
// CLAIM STATE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ClaimData {
  id: string;
  createdAt: string;
  updatedAt: string;
  identity: VeteranIdentity;
  mission: MissionType | null;
  selectedConditions: SelectedCondition[];
  narrative: string;
  auditTrail: AuditEntry[];
  poa: POAInfo | null;
  battleBuddy: BattleBuddyInfo;
  timeline: TimelineEvent[];
  intentLevels: Record<string, IntentLevel>;
  dependents: Dependents;
  uploadedFiles: UploadedFile[];
  ocrResults: OCRResult[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  processed: boolean;
  ocrResult?: OCRResult;
}

// ═══════════════════════════════════════════════════════════════════
// UI STATE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Workflow phases are defined by `src/web/Shared/Core/Registry/featureRegistry.ts` (Mission→Review).
export type WorkflowPhase = 0 | 1 | 2 | 3 | 4;



