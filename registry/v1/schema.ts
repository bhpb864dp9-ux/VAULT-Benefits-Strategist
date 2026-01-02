/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * VAULT IMMUTABLE FEATURE REGISTRY SCHEMA
 * Version 1.0.0
 *
 * Schema ID: VAULT-SCHEMA-REGISTRY-001
 */

// ═══════════════════════════════════════════════════════════════════════════
// ENUMERATIONS
// ═══════════════════════════════════════════════════════════════════════════

export enum CategoryCode {
  THEME = 'TH',
  EPIC = 'EP',
  FEATURE = 'F',
  AR_FEATURE = 'AR',
  TECHNICAL = 'TC',
  ACCESSIBILITY = 'ACC',
  SECURITY = 'SEC',
  NON_FUNCTIONAL = 'NF',
  INTEGRATION = 'INT',
  UI_COMPONENT = 'UI'
}

export enum EpicCode {
  PROFILE = 'PF',
  MIND_READER = 'MR',
  LAWYER = 'LW',
  STRATEGIST = 'ST',
  DOCUMENTS = 'DG',
  WORKFLOW = 'WF',
  BLUE_BUTTON = 'BB',
  PWA = 'PW',
  LICENSING = 'LC',
  THE_DOCTOR = 'TD',
  SPATIAL = 'SV',
  EDGE = 'EI',
  ACCESSIBILITY = 'AC',
  VSO = 'VC',
  DEV_EXPERIENCE = 'DX',
  QA = 'QA'
}

export enum FeatureStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
  ADOPTED = 'ADOPTED',
  REJECTED = 'REJECTED',
  DEFERRED = 'DEFERRED',
  SUPERSEDED = 'SUPERSEDED',
  CANCELLED = 'CANCELLED',
  DEPRECATED = 'DEPRECATED'
}

export enum Priority {
  P0_CRITICAL = 'P0',
  P1_HIGH = 'P1',
  P2_MEDIUM = 'P2',
  P3_LOW = 'P3',
  P4_FUTURE = 'P4'
}

export enum CriteriaStatus {
  PENDING = 'PENDING',
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  SKIPPED = 'SKIPPED'
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  PRIORITY_CHANGE = 'PRIORITY_CHANGE',
  ADOPTION = 'ADOPTION',
  DEPRECATION = 'DEPRECATION',
  SPLIT = 'SPLIT',
  MERGE = 'MERGE'
}

// ═══════════════════════════════════════════════════════════════════════════
// BRANDED TYPES (for type safety)
// ═══════════════════════════════════════════════════════════════════════════

export type ThemeId = string & { readonly __brand: 'ThemeId' };
export type EpicId = string & { readonly __brand: 'EpicId' };
export type FeatureId = string & { readonly __brand: 'FeatureId' };
export type CriteriaId = string & { readonly __brand: 'CriteriaId' };
export type AuditId = string & { readonly __brand: 'AuditId' };

// ═══════════════════════════════════════════════════════════════════════════
// CORE ENTITIES
// ═══════════════════════════════════════════════════════════════════════════

export interface Theme {
  readonly id: ThemeId;
  name: string;
  tagline: string;
  vision: string;
  principles: string[];
  successMetrics: SuccessMetric[];
  status: FeatureStatus;
  schemaVersion: string;
  metadata: RecordMetadata;
}

export interface Epic {
  readonly id: EpicId;
  readonly code: EpicCode;
  name: string;
  description: string;
  owner: string;
  themeIds: ThemeId[];
  priority: Priority;
  status: FeatureStatus;
  sprintRange: { start: number; end: number };
  featureStats: {
    total: number;
    adopted: number;
    active: number;
    planned: number;
    deprecated: number;
  };
  schemaVersion: string;
  metadata: RecordMetadata;
}

export interface Feature {
  readonly id: FeatureId;
  readonly category: CategoryCode;
  readonly epicId: EpicId;
  name: string;
  description: string;
  userStory: UserStory;
  priority: Priority;
  status: FeatureStatus;
  adopted: boolean;
  adoptedAt: string | null;
  sprint: number | null;
  acceptanceCriteria: AcceptanceCriterion[];
  implementation: ImplementationSpec | null;
  dependencies: DependencyRef[];
  traceability: TraceabilityRef[];
  deprecation: DeprecationInfo | null;
  lineage: LineageInfo | null;
  schemaVersion: string;
  metadata: RecordMetadata;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUPPORTING TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UserStory {
  role: string;
  action: string;
  benefit: string;
  emotion: string;
}

export interface AcceptanceCriterion {
  readonly id: CriteriaId;
  requirement: string;
  validation: string;
  testSpec: string | null;
  status: CriteriaStatus;
  verifiedAt: string | null;
  verifiedBy: string | null;
}

export interface ImplementationSpec {
  componentPath: string;
  filePaths: string[];
  store: string | null;
  notes: string | null;
  testCoverage: number | null;
}

export interface DependencyRef {
  type: 'blocks' | 'blocked_by' | 'relates_to';
  featureId: FeatureId;
  description: string | null;
}

export interface TraceabilityRef {
  type: 'theme' | 'requirement' | 'regulation';
  refId: string;
  description: string | null;
}

export interface DeprecationInfo {
  deprecatedAt: string;
  reason: string;
  replacementId: FeatureId | null;
  type: 'rejected' | 'superseded' | 'cancelled' | 'deferred';
}

export interface LineageInfo {
  type: 'split_from' | 'split_into' | 'merged_from' | 'merged_into';
  relatedIds: FeatureId[];
  occurredAt: string;
  reason: string;
}

export interface SuccessMetric {
  name: string;
  target: string | number;
  current: string | number | null;
  unit: string | null;
}

export interface RecordMetadata {
  readonly createdAt: string;
  readonly createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
  checksum: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT TRAIL
// ═══════════════════════════════════════════════════════════════════════════

export interface AuditEntry {
  readonly id: AuditId;
  readonly entityId: ThemeId | EpicId | FeatureId;
  readonly entityType: 'theme' | 'epic' | 'feature';
  readonly action: AuditAction;
  readonly timestamp: string;
  readonly actor: string;
  readonly previousState: string | null;
  readonly newState: string;
  readonly description: string;
  readonly context: Record<string, unknown> | null;
  readonly checksum: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY CONTAINER
// ═══════════════════════════════════════════════════════════════════════════

export interface FeatureRegistry {
  meta: {
    id: string;
    name: string;
    schemaVersion: string;
    exportedAt: string;
    exportedBy: string;
    checksum: string;
  };
  themes: Theme[];
  epics: Epic[];
  features: Feature[];
  auditLog?: AuditEntry[];
  statistics: RegistryStatistics;
}

export interface RegistryStatistics {
  totals: {
    themes: number;
    epics: number;
    features: number;
    acceptanceCriteria: number;
  };
  byStatus: Record<FeatureStatus, number>;
  byPriority: Record<Priority, number>;
  byEpic: Record<string, number>;
  adoptionRate: number;
  completionRate: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function createThemeId(sequence: number): ThemeId {
  return `VAULT-TH-${String(sequence).padStart(3, '0')}` as ThemeId;
}

export function createEpicId(sequence: number): EpicId {
  return `VAULT-EP-${String(sequence).padStart(3, '0')}` as EpicId;
}

export function createFeatureId(category: CategoryCode, epicCode: EpicCode, sequence: number): FeatureId {
  return `VAULT-${category}-${epicCode}-${String(sequence).padStart(3, '0')}` as FeatureId;
}

export function isValidThemeId(id: string): id is ThemeId {
  return /^VAULT-TH-\d{3}$/.test(id);
}

export function isValidEpicId(id: string): id is EpicId {
  return /^VAULT-EP-\d{3}$/.test(id);
}

export function isValidFeatureId(id: string): id is FeatureId {
  return /^(VAULT-(F|AR|TC|INT|UI)-[A-Z]{2}-\d{3}|VAULT-ACC-\d{3}|VAULT-SEC-[A-Z]{2,3}-\d{3}|VAULT-NF-[A-Z]{2,3}-\d{3})$/.test(
    id
  );
}

export function isValidCriteriaId(id: string): id is CriteriaId {
  return /^AC-\d{3}$/.test(id);
}

export function parseFeatureId(id: FeatureId): {
  product: 'VAULT';
  category: CategoryCode;
  epicCode: EpicCode | null;
  sequence: number;
} {
  // Patterns:
  // - VAULT-[CATEGORY]-[EPIC]-[SEQ] (F/AR/TC/INT/UI)
  // - VAULT-ACC-[SEQ]
  // - VAULT-SEC-[TYPE]-[SEQ]
  // - VAULT-NF-[TYPE]-[SEQ]
  const full = id.match(/^(VAULT)-([A-Z]+)-([A-Z]{2,3})-(\d{3})$/);
  if (full) {
    return {
      product: 'VAULT',
      category: full[2] as CategoryCode,
      epicCode: (full[2] === 'ACC' || full[2] === 'SEC' || full[2] === 'NF') ? null : (full[3] as EpicCode),
      sequence: parseInt(full[4], 10)
    };
  }

  const acc = id.match(/^(VAULT)-(ACC)-(\d{3})$/);
  if (acc) {
    return {
      product: 'VAULT',
      category: CategoryCode.ACCESSIBILITY,
      epicCode: null,
      sequence: parseInt(acc[3], 10)
    };
  }

  throw new Error(`Invalid feature ID: ${id}`);
}


