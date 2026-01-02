/**
 * VDIO Narrative Engine — Barrel Export
 * Centralizes all Narrative Engine modules for clean imports.
 *
 * @vault-feature VDIO-NE-001 Narrative Engine Core
 */

// Stores
export { useNarrativeStore } from '../stores/narrativeStore';
export type {
  OCRIndexEntry,
  GapResult,
  RedTeamFlag,
  LayEvidenceEntry,
  NarrativeBlock,
  ProbabilityResult,
  ExamPreBrief,
} from '../stores/narrativeStore';

// Phase 2: OCR & Ingestion
export {
  buildOCRIndex,
  buildIndexFromDiagnoses,
  searchIndexByCondition,
  getIndexedConditions,
  formatIndexCitation,
} from './ocrSchema';
export type { BuildIndexOptions } from './ocrSchema';

// Phase 3: Gap Analysis
export {
  analyzeGaps,
  getGapSummary,
  getConditionsNeedingLayEvidence,
  getConditionsNeedingRecords,
  generateRecordRequestList,
} from './gapAnalysis';

// Phase 3: Red Team Protocol
export {
  scanForContradictions,
  scanTextForContradictions,
  getRedTeamSummary,
  generateMitigationReport,
  getRiskKeywords,
} from './redTeamProtocol';

// Phase 4: Narrative Builder
export {
  buildNarrativeBlock,
  generateNarrativeBlocks,
  generateStatementInSupport,
  generateNexusArgument,
  runQualityAssurance,
  compileNarrativeDraft,
} from './narrativeBuilder';

// Phase 5: Probability Detector
export {
  calculateProbability,
  getConditionBaseline,
  getAllBaselines,
  getProbabilityColor,
  getProbabilityBgColor,
} from './probabilityDetector';

// Phase 5: Exam Pre-Brief
export {
  generateExamPreBrief,
  generateAllExamPreBriefs,
  formatExamPreBriefText,
  generateExamPackageText,
  getDBQForCondition,
} from './examPreBrief';

// Phase 5: PDF Generator
export {
  generateClaimPackage,
  downloadClaimPackage,
  estimatePageCount,
} from './pdfGenerator';
export type { ClaimPackageData } from './pdfGenerator';

// Legal Citations (re-export relevant items)
export {
  getAllCitations,
  getCitationsForCondition,
  getCitationsForEvidenceType,
  formatCitationsBlock,
  DBQ_TEMPLATES,
  NEXUS_LETTER_TEMPLATE,
} from './legalCitations';

