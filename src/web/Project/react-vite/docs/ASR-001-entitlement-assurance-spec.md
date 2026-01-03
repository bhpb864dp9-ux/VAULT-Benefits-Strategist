/**
 * VAULT Entitlement Assurance System — Technical Specification
 *
 * CONFIDENTIAL — TRADE SECRET
 * © 2025 VAULT LLC, a Northstar|Insight Inc. corporation
 * All Rights Reserved
 *
 * Engineer: Alfred Hull
 * Classification: Patent Pending / Trade Secret
 * Document Version: 1.0.0
 * Created: 2026-01-03
 *
 * This document contains proprietary information and trade secrets.
 * Unauthorized disclosure, copying, or distribution is prohibited.
 */

# ASR-001: VAULT Entitlement Assurance System

## Technical Specification

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Data Models](#3-data-models)
4. [Algorithms](#4-algorithms)
5. [API Contracts](#5-api-contracts)
6. [User Interface Specification](#6-user-interface-specification)
7. [Security & Privacy](#7-security--privacy)
8. [Regulatory Compliance](#8-regulatory-compliance)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Patent Considerations](#10-patent-considerations)

---

## 1. Executive Summary

### 1.1 Problem Statement

Veterans preparing VA disability claims face a critical gap between evidence collection and final submission. Current tools offer:

- **Passive data collection** without validation
- **No cross-referencing** between medical records and claimed conditions
- **No optimization guidance** for rating severity selection
- **No pre-submission quality assurance**
- **No audit trail** for veteran review decisions

This results in:
- Under-claimed conditions (veterans leaving entitlements on the table)
- Over-claimed conditions without supporting evidence (denial risk)
- Missing nexus documentation (service connection failures)
- Inconsistent narratives that contradict medical evidence

### 1.2 Solution Overview

The **VAULT Entitlement Assurance System (VEAS)** is a pre-certification validation layer that:

1. **Aggregates** all upstream data from Phases 1-3 (OCR extractions, selected conditions, severity ratings, evidence documents)
2. **Validates** for completeness against regulatory requirements
3. **Optimizes** by identifying rating upgrade opportunities and missing bilateral factors
4. **Presents** a Decision Support Interface for veteran review
5. **Certifies** with digital signature and immutable audit trail
6. **Passes** a certified, validated package to Phase 5 for final generation

### 1.3 Key Innovations

| Innovation | Description | Patent Relevance |
|------------|-------------|------------------|
| **Multi-Source Evidence Correlation** | Links OCR extractions across STRs, C-File, PMRs, Blue Button to claimed conditions | Novel method claim |
| **Proactive Rating Optimization** | Identifies conditions where evidence supports higher severity than selected | Novel algorithm claim |
| **Evidence Gap Detection** | Flags conditions without supporting documentation with remediation paths | Novel system claim |
| **Human-in-the-Loop Certification** | Legal-grade audit trail with cryptographic signing | Novel apparatus claim |
| **Claim Readiness Score** | Quantified probability of success based on evidence completeness | Novel calculation claim |
| **Zero-Transmission Architecture** | All processing local — no cloud, no data transmission | Novel privacy claim |

---

## 2. System Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        VAULT ENTITLEMENT ASSURANCE SYSTEM                        │
│                                   (Phase 4)                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        UPSTREAM DATA AGGREGATOR                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │ OCR Results  │  │ Selected     │  │ DEM Calc     │  │ Evidence     │   │ │
│  │  │ (Phase 2)    │  │ Conditions   │  │ Results      │  │ Documents    │   │ │
│  │  │              │  │ (Phase 3)    │  │ (Ratings)    │  │ (Uploaded)   │   │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │ │
│  │         │                 │                 │                 │           │ │
│  │         └─────────────────┴─────────────────┴─────────────────┘           │ │
│  │                                    │                                       │ │
│  │                                    ▼                                       │ │
│  │                    ┌───────────────────────────────┐                      │ │
│  │                    │   UNIFIED CLAIM DATA MODEL    │                      │ │
│  │                    │   (ClaimAssuranceContext)     │                      │ │
│  │                    └───────────────┬───────────────┘                      │ │
│  └────────────────────────────────────┼────────────────────────────────────────┘ │
│                                       │                                          │
│  ┌────────────────────────────────────┼────────────────────────────────────────┐ │
│  │                         VALIDATION ENGINE                                   │ │
│  │                                    │                                        │ │
│  │  ┌─────────────────────────────────┼─────────────────────────────────────┐ │ │
│  │  │                                 ▼                                      │ │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │ │ │
│  │  │  │ Evidence Gap │  │ Nexus        │  │ Form Field   │                 │ │ │
│  │  │  │ Detector     │  │ Validator    │  │ Completeness │                 │ │ │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘                 │ │ │
│  │  │                                                                        │ │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │ │ │
│  │  │  │ Rating       │  │ Bilateral    │  │ Secondary    │                 │ │ │
│  │  │  │ Optimizer    │  │ Factor Check │  │ Condition    │                 │ │ │
│  │  │  │              │  │              │  │ Inference    │                 │ │ │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘                 │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                    │                                        │ │
│  │                                    ▼                                        │ │
│  │                    ┌───────────────────────────────┐                       │ │
│  │                    │   VALIDATION RESULTS          │                       │ │
│  │                    │   (AssuranceReport)           │                       │ │
│  │                    └───────────────┬───────────────┘                       │ │
│  └────────────────────────────────────┼────────────────────────────────────────┘ │
│                                       │                                          │
│  ┌────────────────────────────────────┼────────────────────────────────────────┐ │
│  │                    DECISION SUPPORT INTERFACE                               │ │
│  │                                    │                                        │ │
│  │                                    ▼                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │ │
│  │  │                     CLAIM READINESS DASHBOARD                         │  │ │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐      │  │ │
│  │  │  │ Readiness  │  │ Critical   │  │ Optimize   │  │ Verified   │      │  │ │
│  │  │  │ Score      │  │ Gaps       │  │ Opportun.  │  │ Complete   │      │  │ │
│  │  │  │ (78%)      │  │ (Red)      │  │ (Yellow)   │  │ (Green)    │      │  │ │
│  │  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘      │  │ │
│  │  └──────────────────────────────────────────────────────────────────────┘  │ │
│  │                                    │                                        │ │
│  │                                    ▼                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │ │
│  │  │                     VETERAN ACTION CENTER                             │  │ │
│  │  │  • Accept/Reject Recommendations                                      │  │ │
│  │  │  • Upload Additional Evidence                                         │  │ │
│  │  │  • Modify Condition Selections                                        │  │ │
│  │  │  • Add Lay Statements                                                 │  │ │
│  │  └──────────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────┼────────────────────────────────────────┘ │
│                                       │                                          │
│  ┌────────────────────────────────────┼────────────────────────────────────────┐ │
│  │                     CERTIFICATION PORTAL                                    │ │
│  │                                    │                                        │ │
│  │                                    ▼                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  ☐ I have reviewed all conditions and evidence                        │  │ │
│  │  │  ☐ I certify this information is true and complete                    │  │ │
│  │  │  ☐ I understand this does not guarantee VA approval                   │  │ │
│  │  │                                                                        │  │ │
│  │  │  Signature: [____________________]  Date: [Auto]                       │  │ │
│  │  │                                                                        │  │ │
│  │  │  [CERTIFY & GENERATE PACKAGE →]                                        │  │ │
│  │  └──────────────────────────────────────────────────────────────────────┘  │ │
│  │                                    │                                        │ │
│  │                                    ▼                                        │ │
│  │                    ┌───────────────────────────────┐                       │ │
│  │                    │   CERTIFICATION RECORD        │                       │ │
│  │                    │   (ClaimIntegrityCertificate) │                       │ │
│  │                    └───────────────┬───────────────┘                       │ │
│  └────────────────────────────────────┼────────────────────────────────────────┘ │
│                                       │                                          │
│                                       ▼                                          │
│                          ┌─────────────────────────┐                            │
│                          │   OUTPUT TO PHASE 5     │                            │
│                          │   (CertifiedClaimPackage)│                           │
│                          └─────────────────────────┘                            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  PHASE 1    │     │  PHASE 2    │     │  PHASE 3    │     │  PHASE 4    │
│  Identity   │────▶│  Evidence   │────▶│  Conditions │────▶│  Assurance  │
│             │     │  OCR        │     │  Selection  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
      ┌─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW WITHIN PHASE 4                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   INPUT STREAMS                                                              │
│   ─────────────                                                              │
│                                                                              │
│   ┌─────────────────┐                                                        │
│   │ OCR Extractions │──┐                                                     │
│   │ • Diagnoses     │  │                                                     │
│   │ • Dates         │  │                                                     │
│   │ • Providers     │  │     ┌─────────────────────┐                        │
│   │ • Treatments    │  ├────▶│ Data Aggregation    │                        │
│   └─────────────────┘  │     │ Service             │                        │
│                        │     │                     │                        │
│   ┌─────────────────┐  │     │ • Merge by condition│                        │
│   │ Selected        │──┤     │ • Link evidence     │                        │
│   │ Conditions      │  │     │ • Build lineage     │                        │
│   │ • Condition ID  │  │     └──────────┬──────────┘                        │
│   │ • Severity      │  │                │                                    │
│   │ • Side (L/R/B)  │  │                ▼                                    │
│   └─────────────────┘  │     ┌─────────────────────┐                        │
│                        │     │ Unified Claim       │                        │
│   ┌─────────────────┐  │     │ Data Model          │                        │
│   │ DEM Calculations│──┤     │                     │                        │
│   │ • Combined %    │  │     │ ClaimAssurance      │                        │
│   │ • Bilateral     │  │     │ Context             │                        │
│   │ • Compensation  │  │     └──────────┬──────────┘                        │
│   └─────────────────┘  │                │                                    │
│                        │                ▼                                    │
│   ┌─────────────────┐  │     ┌─────────────────────┐                        │
│   │ Evidence Docs   │──┘     │ Validation Engine   │                        │
│   │ • File refs     │        │                     │                        │
│   │ • Document type │        │ • Gap Detection     │                        │
│   │ • Page numbers  │        │ • Optimization      │                        │
│   └─────────────────┘        │ • Compliance Check  │                        │
│                              └──────────┬──────────┘                        │
│                                         │                                    │
│   PROCESSING                            ▼                                    │
│   ──────────          ┌─────────────────────────────────────────────────┐   │
│                       │              ASSURANCE REPORT                    │   │
│                       │                                                  │   │
│                       │  ┌─────────────────────────────────────────────┐│   │
│                       │  │ CRITICAL GAPS (Severity: BLOCK)             ││   │
│                       │  │ • PTSD: No STR documentation                ││   │
│                       │  │ • Tinnitus: No audiogram found              ││   │
│                       │  └─────────────────────────────────────────────┘│   │
│                       │                                                  │   │
│                       │  ┌─────────────────────────────────────────────┐│   │
│                       │  │ OPTIMIZATION OPPORTUNITIES (Severity: WARN) ││   │
│                       │  │ • Lumbar: Evidence supports MODERATE        ││   │
│                       │  │ • Bilateral factor: +1.9% available         ││   │
│                       │  └─────────────────────────────────────────────┘│   │
│                       │                                                  │   │
│                       │  ┌─────────────────────────────────────────────┐│   │
│                       │  │ VERIFIED COMPLETE (Severity: OK)            ││   │
│                       │  │ • Hearing Loss: DBQ + audiogram attached    ││   │
│                       │  │ • Sleep Apnea: Sleep study documented       ││   │
│                       │  └─────────────────────────────────────────────┘│   │
│                       │                                                  │   │
│                       │  CLAIM READINESS SCORE: 78%                      │   │
│                       └──────────────────────────┬──────────────────────┘   │
│                                                  │                          │
│   OUTPUT                                         ▼                          │
│   ──────              ┌─────────────────────────────────────────────────┐   │
│                       │           DECISION SUPPORT UI                    │   │
│                       │                                                  │   │
│                       │  Veteran Reviews → Takes Actions → Certifies     │   │
│                       └──────────────────────────┬──────────────────────┘   │
│                                                  │                          │
│                                                  ▼                          │
│                       ┌─────────────────────────────────────────────────┐   │
│                       │        CERTIFIED CLAIM PACKAGE                   │   │
│                       │                                                  │   │
│                       │  • All conditions with evidence links            │   │
│                       │  • Veteran decisions logged                      │   │
│                       │  • Cryptographic signature                       │   │
│                       │  • Claim Integrity Certificate                   │   │
│                       └──────────────────────────┬──────────────────────┘   │
│                                                  │                          │
└──────────────────────────────────────────────────┼──────────────────────────┘
                                                   │
                                                   ▼
                                          ┌───────────────┐
                                          │   PHASE 5     │
                                          │   Package     │
                                          │   Generation  │
                                          └───────────────┘
```

### 2.3 Integration with Phases 1-3 and Phase 5

#### Phase 1 → Phase 4 (Identity)
```typescript
interface Phase1Output {
  veteran: {
    firstName: string;
    lastName: string;
    ssn: string;          // Last 4 only in memory
    dob: Date;
    serviceInfo: ServicePeriod[];
  };
}
```

#### Phase 2 → Phase 4 (Evidence/OCR)
```typescript
interface Phase2Output {
  documents: UploadedDocument[];
  ocrResults: OCRExtraction[];
  extractedDiagnoses: ExtractedDiagnosis[];
  extractedTreatments: ExtractedTreatment[];
  documentLineage: DocumentLineage[];
}
```

#### Phase 3 → Phase 4 (Conditions)
```typescript
interface Phase3Output {
  selectedConditions: SelectedCondition[];
  demCalculation: DEMResult;
  estimatedCompensation: CompensationEstimate;
}
```

#### Phase 4 → Phase 5 (Certified Package)
```typescript
interface Phase4Output {
  certifiedPackage: CertifiedClaimPackage;
  assuranceReport: AssuranceReport;
  claimIntegrityCertificate: ClaimIntegrityCertificate;
  veteranDecisions: VeteranDecision[];
  readinessScore: ClaimReadinessScore;
}
```

---

## 3. Data Models

### 3.1 Upstream Data Aggregation Schema

```typescript
/**
 * ClaimAssuranceContext
 * Unified data model aggregating all upstream phase outputs
 */
interface ClaimAssuranceContext {
  // Metadata
  contextId: string;                    // UUID
  createdAt: Date;
  lastModifiedAt: Date;

  // From Phase 1
  veteran: VeteranIdentity;

  // From Phase 2
  documents: {
    uploaded: UploadedDocument[];
    ocrResults: OCRExtraction[];
    lineage: DocumentLineage[];
  };

  // From Phase 3
  claim: {
    conditions: SelectedCondition[];
    demResult: DEMResult;
    compensation: CompensationEstimate;
  };

  // Evidence Correlation (computed)
  correlations: EvidenceCorrelation[];
}

interface EvidenceCorrelation {
  conditionId: string;
  conditionName: string;
  selectedSeverity: SeverityLevel;
  selectedRating: number;

  // Linked evidence
  supportingEvidence: EvidenceLink[];

  // Correlation quality
  evidenceStrength: 'strong' | 'moderate' | 'weak' | 'none';
  nexusStatus: 'established' | 'implied' | 'missing';

  // Source tracking
  sources: EvidenceSource[];
}

interface EvidenceLink {
  documentId: string;
  documentName: string;
  documentType: DocumentType;
  pageNumber?: number;
  lineNumber?: number;
  extractedText: string;
  confidence: number;           // 0-1 OCR confidence
  relevanceScore: number;       // 0-1 relevance to condition
}

interface EvidenceSource {
  sourceType: 'STR' | 'C-FILE' | 'PMR' | 'BLUE_BUTTON' | 'DBQ' | 'LAY_STATEMENT';
  documentId: string;
  extractionDate: Date;
  pageReferences: number[];
}
```

### 3.2 Validation Result Schema

```typescript
/**
 * AssuranceReport
 * Output of the validation engine
 */
interface AssuranceReport {
  reportId: string;
  generatedAt: Date;

  // Summary metrics
  totalConditions: number;
  criticalGaps: number;
  optimizationOpportunities: number;
  verifiedComplete: number;

  // Readiness score
  readinessScore: ClaimReadinessScore;

  // Detailed findings
  findings: AssuranceFinding[];

  // Regulatory compliance
  complianceStatus: ComplianceStatus;
}

interface AssuranceFinding {
  findingId: string;
  conditionId: string;
  conditionName: string;

  // Classification
  severity: 'critical' | 'warning' | 'info' | 'ok';
  category: FindingCategory;

  // Details
  title: string;
  description: string;
  impact: string;

  // Evidence
  sources: EvidenceSource[];
  citations: RegulatoryCitation[];

  // Remediation
  remediationOptions: RemediationOption[];

  // Veteran action tracking
  veteranAction?: VeteranAction;
}

type FindingCategory =
  | 'EVIDENCE_GAP'           // Missing documentation
  | 'NEXUS_DEFICIENCY'       // Missing service connection
  | 'RATING_OPTIMIZATION'    // Evidence supports higher rating
  | 'BILATERAL_OPPORTUNITY'  // Bilateral factor not applied
  | 'SECONDARY_OPPORTUNITY'  // Potential secondary condition
  | 'FORM_INCOMPLETE'        // Required field missing
  | 'NARRATIVE_CONFLICT'     // Statement conflicts with evidence
  | 'VERIFIED_COMPLETE';     // All requirements met

interface RemediationOption {
  optionId: string;
  label: string;
  description: string;
  actionType: 'UPLOAD' | 'MODIFY' | 'REMOVE' | 'ADD' | 'ACCEPT' | 'DECLINE';
  impact: string;
}
```

### 3.3 Optimization Recommendation Schema

```typescript
/**
 * OptimizationRecommendation
 * Proactive suggestions to maximize entitlements
 */
interface OptimizationRecommendation {
  recommendationId: string;
  conditionId: string;

  // Type
  type: OptimizationType;

  // Current vs Recommended
  current: {
    severity?: SeverityLevel;
    rating?: number;
    isBilateral?: boolean;
  };

  recommended: {
    severity?: SeverityLevel;
    rating?: number;
    isBilateral?: boolean;
  };

  // Impact
  ratingImpact: number;           // Change in individual rating
  combinedImpact: number;         // Change in combined rating
  compensationImpact: number;     // Change in monthly compensation

  // Justification
  evidenceBasis: EvidenceLink[];
  regulatoryCitation: RegulatoryCitation;

  // Confidence
  confidence: number;             // 0-1
  riskLevel: 'low' | 'medium' | 'high';
}

type OptimizationType =
  | 'SEVERITY_UPGRADE'
  | 'BILATERAL_FACTOR'
  | 'SECONDARY_CONDITION'
  | 'MISSING_CONDITION'
  | 'EFFECTIVE_DATE_OPTIMIZATION';

interface RegulatoryCitation {
  regulation: string;             // e.g., "38 CFR § 4.71a"
  diagnosticCode: string;         // e.g., "DC 5237"
  section: string;
  text: string;
  url?: string;
}
```

### 3.4 Certification Record Schema

```typescript
/**
 * ClaimIntegrityCertificate
 * Cryptographic proof of veteran review and certification
 */
interface ClaimIntegrityCertificate {
  certificateId: string;          // UUID
  version: string;                // "1.0"

  // Timestamps
  createdAt: Date;
  certifiedAt: Date;

  // Veteran identification (hashed)
  veteranIdentifier: string;      // SHA-256 of SSN + DOB

  // Claim summary
  claimSummary: {
    totalConditions: number;
    combinedRating: number;
    estimatedCompensation: number;
    readinessScore: number;
  };

  // Certification statements
  certificationStatements: CertificationStatement[];

  // Veteran decisions log
  decisionsHash: string;          // SHA-256 of all decisions

  // Digital signature
  signature: {
    type: 'CLICK_TO_SIGN';
    timestamp: Date;
    ipHash: string;               // Hashed IP for audit
    userAgent: string;
    acknowledged: boolean;
  };

  // Integrity verification
  dataHash: string;               // SHA-256 of entire claim data
  previousHash?: string;          // For amendment tracking
}

interface CertificationStatement {
  statementId: string;
  text: string;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}
```

### 3.5 Claim Readiness Score Model

```typescript
/**
 * ClaimReadinessScore
 * Quantified probability of claim success
 */
interface ClaimReadinessScore {
  // Overall score
  overall: number;                // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';

  // Component scores
  components: {
    evidenceCompleteness: ComponentScore;
    nexusStrength: ComponentScore;
    narrativeCoherence: ComponentScore;
    formCompleteness: ComponentScore;
    regulatoryCompliance: ComponentScore;
  };

  // Breakdown by condition
  conditionScores: ConditionReadinessScore[];

  // Improvement potential
  maxPossibleScore: number;
  improvementActions: ImprovementAction[];
}

interface ComponentScore {
  score: number;                  // 0-100
  weight: number;                 // Contribution to overall (0-1)
  issues: string[];
  recommendations: string[];
}

interface ConditionReadinessScore {
  conditionId: string;
  conditionName: string;
  score: number;
  status: 'ready' | 'needs_attention' | 'critical';
  blockers: string[];
}

interface ImprovementAction {
  action: string;
  impact: number;                 // Score improvement if completed
  effort: 'low' | 'medium' | 'high';
  priority: number;
}
```

---

## 4. Algorithms

### 4.1 Evidence Gap Detection Algorithm

```typescript
/**
 * Evidence Gap Detection Algorithm
 * Identifies conditions without adequate supporting documentation
 *
 * Input: ClaimAssuranceContext
 * Output: AssuranceFinding[] where category = 'EVIDENCE_GAP'
 */

function detectEvidenceGaps(context: ClaimAssuranceContext): AssuranceFinding[] {
  const findings: AssuranceFinding[] = [];

  for (const condition of context.claim.conditions) {
    // Step 1: Find all evidence linked to this condition
    const linkedEvidence = findLinkedEvidence(condition, context.documents);

    // Step 2: Evaluate evidence sufficiency
    const sufficiency = evaluateEvidenceSufficiency(condition, linkedEvidence);

    // Step 3: Generate finding based on sufficiency
    if (sufficiency.level === 'NONE') {
      findings.push(createCriticalGapFinding(condition, sufficiency));
    } else if (sufficiency.level === 'WEAK') {
      findings.push(createWarningGapFinding(condition, sufficiency));
    }
  }

  return findings;
}

function findLinkedEvidence(
  condition: SelectedCondition,
  documents: DocumentContext
): EvidenceLink[] {
  const links: EvidenceLink[] = [];

  // Strategy 1: Direct OCR match
  for (const ocr of documents.ocrResults) {
    const matches = findConditionMentions(condition.name, ocr.extractedText);
    for (const match of matches) {
      links.push({
        documentId: ocr.documentId,
        documentName: ocr.documentName,
        documentType: ocr.documentType,
        pageNumber: match.page,
        extractedText: match.text,
        confidence: ocr.confidence,
        relevanceScore: calculateRelevance(condition, match)
      });
    }
  }

  // Strategy 2: ICD-10/SNOMED code matching
  const conditionCodes = getConditionCodes(condition);
  for (const ocr of documents.ocrResults) {
    const codeMatches = findCodeMatches(conditionCodes, ocr.extractedText);
    // ... add code-based links
  }

  // Strategy 3: Symptom keyword matching
  const symptoms = getConditionSymptoms(condition);
  // ... add symptom-based links

  return links;
}

function evaluateEvidenceSufficiency(
  condition: SelectedCondition,
  evidence: EvidenceLink[]
): EvidenceSufficiency {
  // Minimum requirements per evidence type
  const requirements = getEvidenceRequirements(condition);

  let score = 0;
  const missingTypes: string[] = [];

  // Check each requirement
  for (const req of requirements) {
    const matchingEvidence = evidence.filter(e =>
      e.documentType === req.documentType &&
      e.relevanceScore >= req.minRelevance
    );

    if (matchingEvidence.length >= req.minCount) {
      score += req.weight;
    } else {
      missingTypes.push(req.documentType);
    }
  }

  // Determine sufficiency level
  const level = score >= 0.8 ? 'STRONG' :
                score >= 0.5 ? 'MODERATE' :
                score >= 0.2 ? 'WEAK' : 'NONE';

  return { level, score, missingTypes };
}
```

### 4.2 Rating Optimization Algorithm

```typescript
/**
 * Rating Optimization Algorithm
 * Identifies conditions where evidence supports higher severity than selected
 *
 * Input: ClaimAssuranceContext
 * Output: OptimizationRecommendation[]
 */

function findRatingOptimizations(
  context: ClaimAssuranceContext
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  for (const condition of context.claim.conditions) {
    // Step 1: Get current selection
    const currentSeverity = condition.severity;
    const currentRating = condition.selectedRating;

    // Step 2: Analyze evidence for severity indicators
    const evidenceIndicators = extractSeverityIndicators(
      condition,
      context.correlations
    );

    // Step 3: Map indicators to VASRD criteria
    const evidenceSupportedSeverity = mapToVASRDCriteria(
      condition.conditionId,
      evidenceIndicators
    );

    // Step 4: Compare and generate recommendation
    if (severityIsHigher(evidenceSupportedSeverity, currentSeverity)) {
      const impact = calculateImpact(
        condition,
        currentSeverity,
        evidenceSupportedSeverity,
        context.claim.demResult
      );

      recommendations.push({
        recommendationId: generateId(),
        conditionId: condition.id,
        type: 'SEVERITY_UPGRADE',
        current: { severity: currentSeverity, rating: currentRating },
        recommended: {
          severity: evidenceSupportedSeverity.level,
          rating: evidenceSupportedSeverity.rating
        },
        ratingImpact: impact.ratingDelta,
        combinedImpact: impact.combinedDelta,
        compensationImpact: impact.compensationDelta,
        evidenceBasis: evidenceIndicators.sources,
        regulatoryCitation: getVASRDCitation(condition.conditionId),
        confidence: evidenceIndicators.confidence,
        riskLevel: assessRiskLevel(evidenceIndicators)
      });
    }
  }

  return recommendations;
}

function extractSeverityIndicators(
  condition: SelectedCondition,
  correlations: EvidenceCorrelation[]
): SeverityIndicators {
  const correlation = correlations.find(c => c.conditionId === condition.id);
  if (!correlation) return { indicators: [], confidence: 0, sources: [] };

  const indicators: SeverityIndicator[] = [];

  // Extract quantitative measurements
  for (const evidence of correlation.supportingEvidence) {
    // ROM measurements for musculoskeletal
    const romMatches = extractROMMeasurements(evidence.extractedText);
    for (const rom of romMatches) {
      indicators.push({
        type: 'ROM_MEASUREMENT',
        value: rom.degrees,
        joint: rom.joint,
        direction: rom.direction,
        source: evidence
      });
    }

    // Frequency indicators for recurring conditions
    const frequencyMatches = extractFrequency(evidence.extractedText);
    // ... add frequency indicators

    // Functional impact keywords
    const impactKeywords = extractFunctionalImpact(evidence.extractedText);
    // ... add impact indicators
  }

  return {
    indicators,
    confidence: calculateIndicatorConfidence(indicators),
    sources: correlation.supportingEvidence
  };
}

function mapToVASRDCriteria(
  conditionId: string,
  indicators: SeverityIndicators
): VASRDMapping {
  // Get VASRD schedule for this condition
  const schedule = getVASRDSchedule(conditionId);

  // Match indicators to rating criteria
  let bestMatch = { level: 'none' as SeverityLevel, rating: 0, confidence: 0 };

  for (const criterion of schedule.ratings) {
    const matchScore = scoreIndicatorMatch(indicators, criterion);
    if (matchScore > bestMatch.confidence) {
      bestMatch = {
        level: criterion.level,
        rating: criterion.rating,
        confidence: matchScore
      };
    }
  }

  return bestMatch;
}
```

### 4.3 Claim Readiness Score Calculation

```typescript
/**
 * Claim Readiness Score Calculation
 *
 * Formula:
 * Overall = Σ(Component_i × Weight_i) × (1 - Penalty)
 *
 * Components:
 * - Evidence Completeness (30%)
 * - Nexus Strength (25%)
 * - Narrative Coherence (15%)
 * - Form Completeness (15%)
 * - Regulatory Compliance (15%)
 *
 * Penalty: 10% per critical gap
 */

function calculateClaimReadinessScore(
  context: ClaimAssuranceContext,
  report: AssuranceReport
): ClaimReadinessScore {

  // Component weights
  const WEIGHTS = {
    evidenceCompleteness: 0.30,
    nexusStrength: 0.25,
    narrativeCoherence: 0.15,
    formCompleteness: 0.15,
    regulatoryCompliance: 0.15
  };

  // Calculate each component
  const components = {
    evidenceCompleteness: calculateEvidenceScore(context),
    nexusStrength: calculateNexusScore(context),
    narrativeCoherence: calculateNarrativeScore(context),
    formCompleteness: calculateFormScore(context),
    regulatoryCompliance: calculateComplianceScore(context, report)
  };

  // Calculate weighted sum
  let weightedSum = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    weightedSum += components[key as keyof typeof components].score * weight;
  }

  // Apply penalty for critical gaps
  const criticalGapPenalty = Math.min(
    report.criticalGaps * 0.10,  // 10% per gap
    0.50                         // Max 50% penalty
  );

  const overall = Math.round(weightedSum * (1 - criticalGapPenalty));

  // Determine grade
  const grade = overall >= 90 ? 'A' :
                overall >= 80 ? 'B' :
                overall >= 70 ? 'C' :
                overall >= 60 ? 'D' : 'F';

  return {
    overall,
    grade,
    components,
    conditionScores: calculateConditionScores(context, report),
    maxPossibleScore: calculateMaxPossible(context, report),
    improvementActions: generateImprovementActions(context, report)
  };
}

function calculateEvidenceScore(context: ClaimAssuranceContext): ComponentScore {
  let totalScore = 0;
  let totalWeight = 0;
  const issues: string[] = [];
  const recommendations: string[] = [];

  for (const condition of context.claim.conditions) {
    const correlation = context.correlations.find(
      c => c.conditionId === condition.id
    );

    if (!correlation) {
      issues.push(`${condition.name}: No evidence found`);
      recommendations.push(`Upload documentation for ${condition.name}`);
      continue;
    }

    // Score based on evidence strength
    const strengthScore = {
      'strong': 100,
      'moderate': 75,
      'weak': 40,
      'none': 0
    }[correlation.evidenceStrength];

    totalScore += strengthScore;
    totalWeight += 1;

    if (correlation.evidenceStrength === 'weak') {
      issues.push(`${condition.name}: Evidence is weak`);
      recommendations.push(`Strengthen evidence for ${condition.name}`);
    }
  }

  return {
    score: totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0,
    weight: 0.30,
    issues,
    recommendations
  };
}
```

### 4.4 Bilateral Factor Detection

```typescript
/**
 * Bilateral Factor Detection
 * Per 38 CFR § 4.26
 *
 * Bilateral conditions affecting paired extremities receive
 * an additional 10% bonus applied to the combined bilateral rating
 */

function detectBilateralOpportunities(
  context: ClaimAssuranceContext
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // Group conditions by body system and limb type
  const limbGroups = groupByLimbType(context.claim.conditions);

  for (const [limbType, conditions] of limbGroups.entries()) {
    // Check if both sides are affected
    const leftSide = conditions.filter(c => c.side === 'left');
    const rightSide = conditions.filter(c => c.side === 'right');
    const bilateral = conditions.filter(c => c.side === 'bilateral');

    // Skip if already marked bilateral
    if (bilateral.length > 0) continue;

    // Bilateral opportunity if both sides affected
    if (leftSide.length > 0 && rightSide.length > 0) {
      // Calculate bilateral factor bonus
      const bilateralRatings = [...leftSide, ...rightSide]
        .map(c => c.selectedRating ?? 0);

      const combinedBilateral = combineRatings(bilateralRatings);
      const bilateralBonus = Math.round(combinedBilateral * 0.10);

      // Calculate impact on overall combined rating
      const currentCombined = context.claim.demResult.combined;
      const withBilateral = recalculateWithBilateral(
        context.claim.conditions,
        limbType
      );

      recommendations.push({
        recommendationId: generateId(),
        conditionId: `bilateral-${limbType}`,
        type: 'BILATERAL_FACTOR',
        current: { isBilateral: false },
        recommended: { isBilateral: true },
        ratingImpact: bilateralBonus,
        combinedImpact: withBilateral - currentCombined,
        compensationImpact: calculateCompensationDelta(
          currentCombined,
          withBilateral
        ),
        evidenceBasis: [...leftSide, ...rightSide].flatMap(c =>
          getConditionEvidence(c, context)
        ),
        regulatoryCitation: {
          regulation: '38 CFR § 4.26',
          diagnosticCode: 'N/A',
          section: 'Bilateral factor',
          text: 'When a partial disability results from disease or injury of both arms, both legs, or paired skeletal muscles, the ratings for the disabilities of the right and left sides will be combined and 10% of this value will be added before proceeding with further combinations.'
        },
        confidence: 0.95,
        riskLevel: 'low'
      });
    }
  }

  return recommendations;
}

// Limb types eligible for bilateral factor
const BILATERAL_ELIGIBLE_LIMBS = [
  'knee', 'hip', 'ankle', 'foot',
  'shoulder', 'elbow', 'wrist', 'hand',
  'arm', 'leg', 'ear', 'eye'
] as const;

function groupByLimbType(
  conditions: SelectedCondition[]
): Map<string, SelectedCondition[]> {
  const groups = new Map<string, SelectedCondition[]>();

  for (const condition of conditions) {
    if (!condition.limbType) continue;
    if (!BILATERAL_ELIGIBLE_LIMBS.includes(condition.limbType as any)) continue;

    if (!groups.has(condition.limbType)) {
      groups.set(condition.limbType, []);
    }
    groups.get(condition.limbType)!.push(condition);
  }

  return groups;
}
```

### 4.5 Secondary Condition Inference

```typescript
/**
 * Secondary Condition Inference Engine
 * Identifies potential secondary conditions based on medical relationships
 *
 * Uses a rules engine with established medical causation patterns
 */

// Medical causation rules database
const SECONDARY_CONDITION_RULES: SecondaryConditionRule[] = [
  {
    primaryCondition: 'ptsd',
    secondaryConditions: ['sleep-apnea', 'migraine', 'hypertension', 'depression', 'anxiety'],
    evidenceRequirements: ['diagnosis', 'nexus-statement'],
    confidence: 'high'
  },
  {
    primaryCondition: 'lumbar-strain',
    secondaryConditions: ['radiculopathy', 'sciatica', 'gait-abnormality'],
    evidenceRequirements: ['mri', 'nerve-conduction-study'],
    confidence: 'high'
  },
  {
    primaryCondition: 'diabetes-type-2',
    secondaryConditions: ['peripheral-neuropathy', 'erectile-dysfunction', 'diabetic-retinopathy', 'hypertension'],
    evidenceRequirements: ['diagnosis', 'blood-test'],
    confidence: 'high'
  },
  {
    primaryCondition: 'tbi',
    secondaryConditions: ['headaches', 'cognitive-disorder', 'depression', 'tinnitus', 'balance-disorder'],
    evidenceRequirements: ['neuropsych-eval', 'mri'],
    confidence: 'high'
  },
  {
    primaryCondition: 'hearing-loss',
    secondaryConditions: ['tinnitus'],
    evidenceRequirements: ['audiogram'],
    confidence: 'very-high'
  }
  // ... additional rules
];

function inferSecondaryConditions(
  context: ClaimAssuranceContext
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];
  const claimedConditionIds = new Set(
    context.claim.conditions.map(c => c.conditionId)
  );

  for (const condition of context.claim.conditions) {
    // Find applicable rules
    const rules = SECONDARY_CONDITION_RULES.filter(
      r => r.primaryCondition === condition.conditionId
    );

    for (const rule of rules) {
      for (const secondaryId of rule.secondaryConditions) {
        // Skip if already claimed
        if (claimedConditionIds.has(secondaryId)) continue;

        // Check if evidence exists for secondary condition
        const evidenceCheck = checkSecondaryEvidence(
          secondaryId,
          rule.evidenceRequirements,
          context.documents
        );

        if (evidenceCheck.found) {
          recommendations.push({
            recommendationId: generateId(),
            conditionId: secondaryId,
            type: 'SECONDARY_CONDITION',
            current: {},
            recommended: {
              severity: evidenceCheck.suggestedSeverity,
              rating: getDefaultRating(secondaryId, evidenceCheck.suggestedSeverity)
            },
            ratingImpact: getDefaultRating(secondaryId, evidenceCheck.suggestedSeverity),
            combinedImpact: estimateCombinedImpact(
              context.claim.demResult,
              secondaryId,
              evidenceCheck.suggestedSeverity
            ),
            compensationImpact: estimateCompensationImpact(
              context.claim.compensation,
              secondaryId,
              evidenceCheck.suggestedSeverity
            ),
            evidenceBasis: evidenceCheck.evidence,
            regulatoryCitation: getSecondaryConnectionCitation(
              condition.conditionId,
              secondaryId
            ),
            confidence: getConfidenceScore(rule.confidence, evidenceCheck),
            riskLevel: 'medium'
          });
        }
      }
    }
  }

  return recommendations;
}

function checkSecondaryEvidence(
  conditionId: string,
  requirements: string[],
  documents: DocumentContext
): SecondaryEvidenceCheck {
  const conditionKeywords = getConditionKeywords(conditionId);
  const foundEvidence: EvidenceLink[] = [];

  for (const ocr of documents.ocrResults) {
    for (const keyword of conditionKeywords) {
      if (ocr.extractedText.toLowerCase().includes(keyword.toLowerCase())) {
        foundEvidence.push({
          documentId: ocr.documentId,
          documentName: ocr.documentName,
          documentType: ocr.documentType,
          extractedText: extractContext(ocr.extractedText, keyword),
          confidence: ocr.confidence,
          relevanceScore: 0.7
        });
      }
    }
  }

  return {
    found: foundEvidence.length > 0,
    evidence: foundEvidence,
    suggestedSeverity: inferSeverity(foundEvidence),
    requirementsMet: checkRequirementsMet(requirements, documents)
  };
}
```

---

## 5. API Contracts

### 5.1 Input: What Phase 4 Receives from Phases 1-3

```typescript
/**
 * AssuranceInputContract
 * Data received from upstream phases
 */

// From claimStore (Zustand)
interface AssuranceInput {
  // Phase 1: Identity
  veteran: {
    firstName: string;
    lastName: string;
    ssnLast4: string;
    dob: string;                  // ISO date
    serviceHistory: ServicePeriod[];
    contactInfo: ContactInfo;
  };

  // Phase 2: Evidence
  evidence: {
    documents: UploadedDocument[];
    ocrResults: OCRExtractionResult[];
    extractedConditions: ExtractedCondition[];
    documentLineage: LineageRecord[];
  };

  // Phase 3: Conditions
  claim: {
    selectedConditions: SelectedCondition[];
    demCalculation: DEMCalculationResult;
    compensationEstimate: CompensationEstimate;
    narrativeDrafts?: NarrativeDraft[];
  };

  // Metadata
  sessionId: string;
  lastUpdated: Date;
}

interface ServicePeriod {
  branch: MilitaryBranch;
  startDate: string;
  endDate: string;
  characterOfDischarge: DischargeType;
  primaryMOS: string;
}

interface UploadedDocument {
  documentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  documentType: DocumentType;
  status: 'pending' | 'processed' | 'failed';
  ocrResultId?: string;
}

interface OCRExtractionResult {
  resultId: string;
  documentId: string;
  extractedText: string;
  confidence: number;
  structuredData?: {
    diagnoses: DiagnosisExtraction[];
    dates: DateExtraction[];
    providers: ProviderExtraction[];
    medications: MedicationExtraction[];
  };
  processedAt: Date;
}

interface SelectedCondition {
  id: string;
  conditionId: string;
  name: string;
  category: string;
  severity: SeverityLevel;
  selectedRating: number | null;
  side?: 'left' | 'right' | 'bilateral';
  limbType?: LimbType;
  isBilateral?: boolean;
  onsetDate?: string;
  serviceConnected: boolean;
  evidenceDocIds: string[];
}
```

### 5.2 Output: What Phase 4 Passes to Phase 5

```typescript
/**
 * AssuranceOutputContract
 * Data passed to Phase 5 for final package generation
 */

interface AssuranceOutput {
  // Certified claim package
  certifiedPackage: {
    // Veteran info (verified)
    veteran: VerifiedVeteranInfo;

    // Conditions (validated and certified)
    conditions: CertifiedCondition[];

    // Evidence (correlated)
    evidence: CorrelatedEvidence[];

    // Calculations (final)
    calculations: {
      combinedRating: number;
      roundedRating: number;
      bilateralFactor: number;
      monthlyCompensation: number;
      annualCompensation: number;
    };
  };

  // Assurance report
  assuranceReport: AssuranceReport;

  // Certification
  certification: ClaimIntegrityCertificate;

  // Veteran decisions (audit trail)
  decisions: VeteranDecision[];

  // Readiness score
  readinessScore: ClaimReadinessScore;

  // Form-ready data
  formData: {
    form21526EZ: Form21526EZData;
    dbqs: DBQData[];
    layStatements: LayStatementData[];
  };
}

interface CertifiedCondition {
  conditionId: string;
  name: string;
  diagnosticCode: string;
  severity: SeverityLevel;
  rating: number;

  // Evidence links
  supportingEvidence: {
    documentId: string;
    documentName: string;
    relevantPages: number[];
    excerpts: string[];
  }[];

  // Regulatory basis
  regulatoryCitation: string;

  // Certification status
  status: 'certified' | 'certified-with-warning' | 'not-certified';
  warnings?: string[];

  // Veteran acknowledgment
  veteranAcknowledged: boolean;
  acknowledgedAt: Date;
}

interface VeteranDecision {
  decisionId: string;
  timestamp: Date;
  findingId: string;
  findingType: FindingCategory;
  action: 'ACCEPT' | 'REJECT' | 'MODIFY' | 'DEFER';
  details?: {
    originalValue?: any;
    newValue?: any;
    reason?: string;
  };
}
```

### 5.3 Internal Services and Interfaces

```typescript
/**
 * Internal Service Interfaces
 * Services that power the Assurance system
 */

// Aggregation Service
interface IDataAggregationService {
  aggregate(input: AssuranceInput): Promise<ClaimAssuranceContext>;
  correlateEvidence(context: ClaimAssuranceContext): Promise<EvidenceCorrelation[]>;
  buildLineage(context: ClaimAssuranceContext): Promise<DocumentLineage[]>;
}

// Validation Engine
interface IValidationEngine {
  validate(context: ClaimAssuranceContext): Promise<AssuranceReport>;
  detectGaps(context: ClaimAssuranceContext): Promise<AssuranceFinding[]>;
  checkCompliance(context: ClaimAssuranceContext): Promise<ComplianceStatus>;
}

// Optimization Engine
interface IOptimizationEngine {
  findOptimizations(context: ClaimAssuranceContext): Promise<OptimizationRecommendation[]>;
  detectBilateral(context: ClaimAssuranceContext): Promise<OptimizationRecommendation[]>;
  inferSecondary(context: ClaimAssuranceContext): Promise<OptimizationRecommendation[]>;
}

// Readiness Calculator
interface IReadinessCalculator {
  calculate(
    context: ClaimAssuranceContext,
    report: AssuranceReport
  ): Promise<ClaimReadinessScore>;

  projectImprovement(
    current: ClaimReadinessScore,
    actions: string[]
  ): Promise<ClaimReadinessScore>;
}

// Certification Service
interface ICertificationService {
  createCertificate(
    context: ClaimAssuranceContext,
    decisions: VeteranDecision[],
    signature: SignatureData
  ): Promise<ClaimIntegrityCertificate>;

  verifyCertificate(certificate: ClaimIntegrityCertificate): Promise<boolean>;

  hashClaimData(context: ClaimAssuranceContext): Promise<string>;
}

// Form Mapping Service
interface IFormMappingService {
  mapToForm21526EZ(output: AssuranceOutput): Promise<Form21526EZData>;
  mapToDBQ(condition: CertifiedCondition): Promise<DBQData>;
  generateLayStatement(condition: CertifiedCondition): Promise<LayStatementData>;
}
```

---

## 6. User Interface Specification

### 6.1 Wireframes

#### 6.1.1 Assurance Dashboard (Main View)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 of 5: ASSURANCE                                    [← Back] [Next →]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                         CLAIM READINESS SCORE                               │ │
│  │                                                                             │ │
│  │   ████████████████████████████░░░░░░░░░░░░  78%                            │ │
│  │                                                                             │ │
│  │   Grade: C+                                                                 │ │
│  │   3 critical issues • 2 optimization opportunities • 5 verified complete   │ │
│  │                                                                             │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │ │
│  │   │ Evidence    │  │ Nexus       │  │ Forms       │  │ Compliance  │       │ │
│  │   │ ████████░░  │  │ ██████░░░░  │  │ ████████████│  │ ████████░░  │       │ │
│  │   │ 82%         │  │ 65%         │  │ 100%        │  │ 85%         │       │ │
│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  🔴 CRITICAL GAPS — Must Resolve (3)                              [Expand] │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                             │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  ⚠️  PTSD — No service treatment record documentation found           │ │ │
│  │  │                                                                        │ │ │
│  │  │  Why this matters:                                                     │ │ │
│  │  │  Claims without STR documentation have 60% higher denial rate.         │ │ │
│  │  │                                                                        │ │ │
│  │  │  Sources checked:                                                      │ │ │
│  │  │  • STRs_Complete.pdf (no mention of PTSD/mental health)               │ │ │
│  │  │  • BlueButton_2024.pdf (civilian treatment only)                      │ │ │
│  │  │                                                                        │ │ │
│  │  │  Regulatory requirement: 38 CFR § 3.304(f)                            │ │ │
│  │  │                                                                        │ │ │
│  │  │  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐             │ │ │
│  │  │  │ Upload STR     │ │ Add Lay        │ │ Remove         │             │ │ │
│  │  │  │ Evidence       │ │ Statement      │ │ Condition      │             │ │ │
│  │  │  └────────────────┘ └────────────────┘ └────────────────┘             │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                             │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  ⚠️  Tinnitus — No audiogram in uploaded evidence                     │ │ │
│  │  │  ... [collapsed]                                                       │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                             │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  ⚠️  Sleep Apnea — Missing nexus to service                           │ │ │
│  │  │  ... [collapsed]                                                       │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  🟡 OPTIMIZATION OPPORTUNITIES — Recommended (2)                  [Expand] │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                             │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  💡 Lumbar Strain — Evidence supports MODERATE (you selected MILD)    │ │ │
│  │  │                                                                        │ │ │
│  │  │  Your selection:  MILD (10%)                                          │ │ │
│  │  │  Evidence shows:  MODERATE (20%)                                      │ │ │
│  │  │                                                                        │ │ │
│  │  │  Evidence found:                                                       │ │ │
│  │  │  • Dr_Smith_Ortho.pdf, Page 3: "Limited ROM: 45° flexion"             │ │ │
│  │  │  • Per 38 CFR § 4.71a DC 5237: Forward flexion 30-60° = 20%           │ │ │
│  │  │                                                                        │ │ │
│  │  │  Impact if upgraded:                                                   │ │ │
│  │  │  • Combined rating: 62% → 66%                                         │ │ │
│  │  │  • Monthly compensation: +$147                                         │ │ │
│  │  │                                                                        │ │ │
│  │  │  ┌────────────────────────┐  ┌────────────────────────┐               │ │ │
│  │  │  │ ✓ Upgrade to Moderate  │  │   Keep as Mild        │               │ │ │
│  │  │  └────────────────────────┘  └────────────────────────┘               │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                             │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  💡 Bilateral Factor — Both knees claimed but factor not applied      │ │ │
│  │  │                                                                        │ │ │
│  │  │  Current: Left Knee (10%) + Right Knee (10%) = calculated separately   │ │ │
│  │  │  With bilateral factor: Combined bilateral + 10% bonus                 │ │ │
│  │  │                                                                        │ │ │
│  │  │  Impact: +1.9% to combined rating (~$27/month)                        │ │ │
│  │  │                                                                        │ │ │
│  │  │  Authority: 38 CFR § 4.26                                             │ │ │
│  │  │                                                                        │ │ │
│  │  │  ┌────────────────────────┐  ┌────────────────────────┐               │ │ │
│  │  │  │ ✓ Apply Bilateral      │  │   Decline              │               │ │ │
│  │  │  └────────────────────────┘  └────────────────────────┘               │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  🟢 VERIFIED COMPLETE (5)                                         [Expand] │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │  ✓ Hearing Loss (Bilateral) — DBQ complete, audiogram attached            │ │
│  │  ✓ Migraine Headaches — STR dated 2019-03-15, C&P exam scheduled          │ │
│  │  ✓ Left Knee Strain — MRI + orthopedic consult documented                 │ │
│  │  ✓ Right Knee Strain — MRI + orthopedic consult documented                │ │
│  │  ✓ Hypertension — Diagnosis + medication history documented               │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 6.1.2 Certification Portal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CERTIFICATION                                                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            FINAL REVIEW                                     │ │
│  │                                                                             │ │
│  │  You are claiming 8 conditions with a combined rating of 72%               │ │
│  │  Estimated monthly compensation: $1,716.28                                  │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │  │  Condition                  │ Rating │ Evidence │ Status            │   │ │
│  │  ├─────────────────────────────┼────────┼──────────┼───────────────────┤   │ │
│  │  │  PTSD                       │  50%   │ ⚠️ Weak  │ Proceed w/ risk   │   │ │
│  │  │  Lumbar Strain (Moderate)   │  20%   │ ✓ Strong │ Verified          │   │ │
│  │  │  Left Knee                  │  10%   │ ✓ Strong │ Verified          │   │ │
│  │  │  Right Knee                 │  10%   │ ✓ Strong │ Verified          │   │ │
│  │  │  Bilateral Factor           │  +2%   │ ✓ Auto   │ Applied           │   │ │
│  │  │  Hearing Loss (Bilateral)   │  10%   │ ✓ Strong │ Verified          │   │ │
│  │  │  Tinnitus                   │  10%   │ ⚠️ Weak  │ Proceed w/ risk   │   │ │
│  │  │  Hypertension               │  10%   │ ✓ Strong │ Verified          │   │ │
│  │  └─────────────────────────────┴────────┴──────────┴───────────────────┘   │ │
│  │                                                                             │ │
│  │  ⚠️ 2 conditions have weak evidence. You may proceed, but denial risk      │ │
│  │     is elevated. Consider adding documentation before submission.           │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                       CERTIFICATION STATEMENTS                              │ │
│  │                                                                             │ │
│  │  Please review and acknowledge each statement:                              │ │
│  │                                                                             │ │
│  │  ☑️ I have reviewed all conditions, severity levels, and evidence          │ │
│  │     correlations presented in this Assurance review.                        │ │
│  │                                                                             │ │
│  │  ☑️ I certify that the information provided is true and complete to the    │ │
│  │     best of my knowledge and belief.                                        │ │
│  │                                                                             │ │
│  │  ☑️ I understand that this tool assists with claim preparation but does    │ │
│  │     not guarantee VA approval of any claimed condition.                     │ │
│  │                                                                             │ │
│  │  ☑️ I acknowledge that I may request help from a VA-accredited             │ │
│  │     representative (VSO, attorney, or claims agent) at any time.            │ │
│  │                                                                             │ │
│  │  ☑️ I understand that willfully providing false information may result     │ │
│  │     in penalties under 18 U.S.C. § 1001.                                    │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                         DIGITAL SIGNATURE                                   │ │
│  │                                                                             │ │
│  │  By typing your name below, you are electronically signing this             │ │
│  │  certification under the Electronic Signatures in Global and National       │ │
│  │  Commerce Act (E-SIGN Act, 15 U.S.C. § 7001).                               │ │
│  │                                                                             │ │
│  │  Full Legal Name: [_________________________________________]               │ │
│  │                                                                             │ │
│  │  Date: January 3, 2026 (auto-filled)                                        │ │
│  │                                                                             │ │
│  │                                                                             │ │
│  │            ┌─────────────────────────────────────────────────┐              │ │
│  │            │                                                 │              │ │
│  │            │      CERTIFY & GENERATE CLAIM PACKAGE  →        │              │ │
│  │            │                                                 │              │ │
│  │            └─────────────────────────────────────────────────┘              │ │
│  │                                                                             │ │
│  │  🔒 Your data remains on your device. Nothing is transmitted.               │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Decision Support Interface Components

```typescript
// Component hierarchy
AssurancePage
├── ClaimReadinessCard
│   ├── ReadinessGauge (circular progress)
│   ├── GradeDisplay
│   ├── IssueSummary
│   └── ComponentScoreGrid
│       ├── EvidenceScore
│       ├── NexusScore
│       ├── FormScore
│       └── ComplianceScore
│
├── FindingsAccordion
│   ├── CriticalGapsSection (collapsible)
│   │   └── GapCard[] (expandable)
│   │       ├── GapHeader (icon, title, condition)
│   │       ├── GapDetails (why, sources, regulation)
│   │       └── RemediationActions (buttons)
│   │
│   ├── OptimizationSection (collapsible)
│   │   └── OptimizationCard[] (expandable)
│   │       ├── OptHeader (icon, title)
│   │       ├── ComparisonView (current vs recommended)
│   │       ├── ImpactAnalysis (rating, compensation)
│   │       └── ActionButtons (accept, decline)
│   │
│   └── VerifiedSection (collapsible)
│       └── VerifiedItem[] (compact list)
│
├── CertificationPortal
│   ├── FinalReviewTable
│   ├── CertificationStatements (checkboxes)
│   ├── SignatureInput
│   └── CertifyButton
│
└── NavigationFooter
    ├── BackButton
    ├── SaveProgressButton
    └── NextButton (disabled until certified)
```

### 6.3 Error States and Edge Cases

| Scenario | UI Behavior |
|----------|-------------|
| No conditions selected | Redirect to Phase 3 with message |
| All conditions have critical gaps | Allow proceed with prominent warning modal |
| OCR failed for all documents | Show manual entry fallback option |
| Certification checkbox not checked | Disable Certify button, highlight missing |
| Signature doesn't match veteran name | Warn but allow (typo tolerance) |
| Browser closed mid-certification | Restore from IndexedDB on return |
| Readiness score = 0% | Block progress, require minimum evidence |

---

## 7. Security & Privacy

### 7.1 Zero-Transmission Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ZERO-TRANSMISSION ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                          VETERAN'S DEVICE                                │   │
│   │                                                                          │   │
│   │   ┌──────────────────┐                                                  │   │
│   │   │    Browser       │                                                  │   │
│   │   │   ┌────────────────────────────────────────────────────────────┐   │   │
│   │   │   │                    VAULT Application                        │   │   │
│   │   │   │                                                             │   │   │
│   │   │   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │   │   │
│   │   │   │   │ IndexedDB   │  │ Web Crypto  │  │ Local       │        │   │   │
│   │   │   │   │ (Storage)   │  │ API (Hash)  │  │ OCR Engine  │        │   │   │
│   │   │   │   └─────────────┘  └─────────────┘  └─────────────┘        │   │   │
│   │   │   │                                                             │   │   │
│   │   │   │   ┌─────────────────────────────────────────────────────┐  │   │   │
│   │   │   │   │              Assurance Engine                        │  │   │   │
│   │   │   │   │  • Aggregation   • Validation   • Optimization      │  │   │   │
│   │   │   │   │  • Certification  • Scoring                         │  │   │   │
│   │   │   │   └─────────────────────────────────────────────────────┘  │   │   │
│   │   │   │                                                             │   │   │
│   │   │   │   ════════════════════════════════════════════════════════ │   │   │
│   │   │   │   ║  NO DATA LEAVES THIS BOUNDARY                        ║ │   │   │
│   │   │   │   ════════════════════════════════════════════════════════ │   │   │
│   │   │   │                                                             │   │   │
│   │   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │   │                                                                      │   │
│   │   └──────────────────────────────────────────────────────────────────────┘   │
│   │                                                                          │   │
│   │   ┌────────────────────────────────────────────────────────────────┐    │   │
│   │   │  Local File System (for exports only, veteran-initiated)       │    │   │
│   │   │  • PDF exports                                                  │    │   │
│   │   │  • Form packages                                                │    │   │
│   │   └────────────────────────────────────────────────────────────────┘    │   │
│   │                                                                          │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ════════════════════════════════════════════════════════════════════════════   │
│   ║                    NO NETWORK TRANSMISSION                               ║   │
│   ════════════════════════════════════════════════════════════════════════════   │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │   Cloud/Server   │  ← VAULT DOES NOT USE THIS                               │
│   │   (Not Used)     │                                                          │
│   └──────────────────┘                                                          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Local Cryptographic Signing

```typescript
/**
 * Local Cryptographic Operations
 * All crypto performed client-side using Web Crypto API
 */

async function generateClaimHash(
  context: ClaimAssuranceContext
): Promise<string> {
  // Serialize claim data deterministically
  const serialized = JSON.stringify(context, Object.keys(context).sort());

  // Hash using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(serialized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

async function createSignature(
  veteranName: string,
  timestamp: Date,
  claimHash: string
): Promise<SignatureData> {
  // Create signature payload
  const payload = {
    name: veteranName,
    timestamp: timestamp.toISOString(),
    claimHash,
    type: 'CLICK_TO_SIGN'
  };

  // Hash the signature payload
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const signatureHash = await crypto.subtle.digest('SHA-256', data);

  return {
    type: 'CLICK_TO_SIGN',
    timestamp,
    signatureHash: arrayBufferToHex(signatureHash),
    acknowledged: true
  };
}
```

### 7.3 Audit Trail Requirements

```typescript
/**
 * Audit Trail Schema
 * Every veteran action is logged immutably
 */

interface AuditEntry {
  entryId: string;
  timestamp: Date;
  sessionId: string;

  // Action details
  action: AuditAction;
  category: 'NAVIGATION' | 'DATA_CHANGE' | 'DECISION' | 'CERTIFICATION';

  // Before/after state
  previousState?: any;
  newState?: any;

  // Context
  findingId?: string;
  conditionId?: string;

  // Integrity
  previousEntryHash: string;
  entryHash: string;
}

type AuditAction =
  | 'ENTERED_ASSURANCE_PHASE'
  | 'VIEWED_FINDING'
  | 'ACCEPTED_RECOMMENDATION'
  | 'DECLINED_RECOMMENDATION'
  | 'MODIFIED_CONDITION'
  | 'UPLOADED_EVIDENCE'
  | 'REMOVED_CONDITION'
  | 'ACKNOWLEDGED_STATEMENT'
  | 'PROVIDED_SIGNATURE'
  | 'COMPLETED_CERTIFICATION'
  | 'EXPORTED_PACKAGE';

// Audit trail is stored in IndexedDB with hash chain
class AuditTrailService {
  async logAction(action: Omit<AuditEntry, 'entryId' | 'previousEntryHash' | 'entryHash'>): Promise<void> {
    const previousEntry = await this.getLastEntry();
    const previousHash = previousEntry?.entryHash ?? 'GENESIS';

    const entry: AuditEntry = {
      ...action,
      entryId: generateId(),
      previousEntryHash: previousHash,
      entryHash: '' // Calculated below
    };

    entry.entryHash = await this.hashEntry(entry);
    await this.store(entry);
  }

  async verifyIntegrity(): Promise<boolean> {
    const entries = await this.getAllEntries();
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].previousEntryHash !== entries[i - 1].entryHash) {
        return false; // Chain broken
      }
    }
    return true;
  }
}
```

---

## 8. Regulatory Compliance

### 8.1 38 CFR Part 4 Integration Points

```typescript
/**
 * VASRD Regulatory Database
 * Local copy of 38 CFR Part 4 rating criteria
 */

interface VASRDSchedule {
  diagnosticCode: string;
  condition: string;
  bodySystem: string;
  cfrSection: string;
  ratings: VASRDRatingCriterion[];
  generalRatingFormula?: string;
}

// Example: Lumbar Spine
const DC_5237: VASRDSchedule = {
  diagnosticCode: '5237',
  condition: 'Lumbosacral or Cervical Strain',
  bodySystem: 'Musculoskeletal - Spine',
  cfrSection: '38 CFR § 4.71a',
  ratings: [
    {
      level: 'total',
      rating: 100,
      criteria: 'Unfavorable ankylosis of the entire spine',
      measurements: { ankylosis: 'entire-spine-unfavorable' }
    },
    {
      level: 'severe',
      rating: 50,
      criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine',
      measurements: { ankylosis: 'thoracolumbar-unfavorable' }
    },
    {
      level: 'moderately-severe',
      rating: 40,
      criteria: 'Forward flexion of the thoracolumbar spine 30 degrees or less; or, favorable ankylosis of the entire thoracolumbar spine',
      measurements: { forwardFlexion: { max: 30 } }
    },
    {
      level: 'moderate',
      rating: 20,
      criteria: 'Forward flexion of the thoracolumbar spine greater than 30 degrees but not greater than 60 degrees',
      measurements: { forwardFlexion: { min: 31, max: 60 } }
    },
    {
      level: 'mild',
      rating: 10,
      criteria: 'Forward flexion of the thoracolumbar spine greater than 60 degrees but not greater than 85 degrees',
      measurements: { forwardFlexion: { min: 61, max: 85 } }
    }
  ],
  generalRatingFormula: 'General Rating Formula for Diseases and Injuries of the Spine'
};

// Rating lookup function
function getApplicableRating(
  diagnosticCode: string,
  indicators: SeverityIndicators
): VASRDRatingCriterion | null {
  const schedule = getVASRDSchedule(diagnosticCode);
  if (!schedule) return null;

  for (const criterion of schedule.ratings) {
    if (indicatorsMeetCriteria(indicators, criterion.measurements)) {
      return criterion;
    }
  }

  return null;
}
```

### 8.2 M21-1 Adjudication Manual References

```typescript
/**
 * M21-1 Adjudication Manual Citations
 * Evidence sufficiency standards
 */

const M21_1_EVIDENCE_STANDARDS = {
  'service-connection': {
    reference: 'M21-1, Part IV, Subpart ii, Chapter 1, Section A',
    requirements: [
      'Current disability (diagnosis)',
      'In-service event, injury, or disease',
      'Nexus between current disability and service'
    ]
  },
  'secondary-service-connection': {
    reference: 'M21-1, Part IV, Subpart ii, Chapter 1, Section H',
    requirements: [
      'Already service-connected primary disability',
      'Secondary condition diagnosis',
      'Medical evidence of causation or aggravation'
    ]
  },
  'lay-evidence': {
    reference: 'M21-1, Part III, Subpart iv, Chapter 5, Section A',
    acceptability: 'Lay evidence is competent to establish observable symptoms',
    limitations: 'Lay evidence alone generally cannot establish diagnosis requiring medical expertise'
  }
};

function checkM21Compliance(
  condition: SelectedCondition,
  evidence: EvidenceCorrelation
): ComplianceCheck {
  const standard = condition.isSecondary
    ? M21_1_EVIDENCE_STANDARDS['secondary-service-connection']
    : M21_1_EVIDENCE_STANDARDS['service-connection'];

  const met: string[] = [];
  const missing: string[] = [];

  for (const req of standard.requirements) {
    if (evidenceMeetsRequirement(evidence, req)) {
      met.push(req);
    } else {
      missing.push(req);
    }
  }

  return {
    standard: standard.reference,
    requirementsMet: met,
    requirementsMissing: missing,
    compliant: missing.length === 0
  };
}
```

### 8.3 VA Form Field Mappings

```typescript
/**
 * VA Form 21-526EZ Field Mappings
 * Maps VAULT data to official form fields
 */

interface Form21526EZMapping {
  sectionA: {
    veteranName: string;           // From Phase 1
    ssn: string;                   // From Phase 1
    dob: string;                   // From Phase 1
    vaFileNumber: string;          // From Phase 1 or derived
  };

  sectionB: {
    serviceInfo: ServiceInfoMapping[];
  };

  sectionC: {
    disabilities: DisabilityMapping[];
  };

  sectionD: {
    treatmentRecords: TreatmentRecordMapping[];
  };

  sectionE: {
    certification: CertificationMapping;
  };
}

interface DisabilityMapping {
  conditionName: string;           // From condition selection
  diagnosticCode: string;          // From VASRD lookup
  dateOfOnset: string;            // From Phase 1 or evidence
  causeOfDisability: 'service' | 'secondary' | 'aggravation';
  relatedToMilitaryService: boolean;
  secondaryTo?: string;            // If secondary claim

  // Evidence attachments
  attachedEvidence: string[];      // Document IDs
}

function mapToForm21526EZ(
  output: AssuranceOutput
): Form21526EZData {
  return {
    sectionA: {
      veteranName: `${output.certifiedPackage.veteran.lastName}, ${output.certifiedPackage.veteran.firstName}`,
      ssn: output.certifiedPackage.veteran.ssnLast4,
      dob: output.certifiedPackage.veteran.dob,
      vaFileNumber: output.certifiedPackage.veteran.vaFileNumber ?? ''
    },
    sectionB: {
      serviceInfo: output.certifiedPackage.veteran.serviceHistory.map(s => ({
        branch: s.branch,
        entryDate: s.startDate,
        releaseDate: s.endDate,
        characterOfDischarge: s.characterOfDischarge
      }))
    },
    sectionC: {
      disabilities: output.certifiedPackage.conditions.map(c => ({
        conditionName: c.name,
        diagnosticCode: c.diagnosticCode,
        dateOfOnset: c.supportingEvidence[0]?.relevantDates?.[0] ?? '',
        causeOfDisability: c.isSecondary ? 'secondary' : 'service',
        relatedToMilitaryService: true,
        attachedEvidence: c.supportingEvidence.map(e => e.documentId)
      }))
    },
    // ... additional sections
  };
}
```

---

## 9. Implementation Roadmap

### 9.1 Sub-Story Breakdown

| Story ID | Title | Fibonacci | Dependencies | Description |
|----------|-------|-----------|--------------|-------------|
| **ASR-001** | **Entitlement Assurance Engine (EPIC)** | **21** | — | Parent epic for Phase 4 rebuild |
| ASR-001a | Upstream Data Aggregation Service | 5 | REL-020 (OCR) | Merge Phase 1-3 data into unified context |
| ASR-001b | Evidence Gap Detection Algorithm | 8 | ASR-001a | Identify conditions without documentation |
| ASR-001c | Rating Optimization Engine | 8 | ASR-001a, DEM-013 | Find rating upgrade opportunities |
| ASR-001d | Decision Support UI Component | 8 | ASR-001b, ASR-001c | Render findings, handle actions |
| ASR-001e | Certification Portal with Digital Signature | 5 | ASR-001d | Legal certification workflow |
| ASR-001f | Claim Readiness Score Calculator | 5 | ASR-001b, ASR-001c | Quantified success probability |

### 9.2 Dependency Graph

```
                    ┌─────────────┐
                    │  REL-020    │
                    │  OCR Engine │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  ASR-001a   │
                    │  Aggregation│
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │  ASR-001b   │  │  ASR-001c   │  │  DEM-013    │
       │  Gap Detect │  │  Optimize   │◀─│  Calculator │
       └──────┬──────┘  └──────┬──────┘  └─────────────┘
              │                │
              └────────┬───────┘
                       │
                       ▼
                ┌─────────────┐
                │  ASR-001f   │
                │  Readiness  │
                │  Score      │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  ASR-001d   │
                │  Decision   │
                │  Support UI │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  ASR-001e   │
                │  Certify    │
                │  Portal     │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  Phase 5    │
                │  Package    │
                │  Generation │
                └─────────────┘
```

### 9.3 Estimated Effort

| Story | Complexity | Estimated Effort | Risk Level |
|-------|------------|------------------|------------|
| ASR-001a | Medium | 3-4 days | Low |
| ASR-001b | High | 5-7 days | Medium |
| ASR-001c | High | 5-7 days | Medium |
| ASR-001d | High | 5-7 days | Low |
| ASR-001e | Medium | 3-4 days | Low |
| ASR-001f | Medium | 3-4 days | Low |
| **Total** | — | **24-33 days** | — |

---

## 10. Patent Considerations

### 10.1 Novel Elements

| Element | Novelty Claim | Prior Art Differentiation |
|---------|---------------|---------------------------|
| **Multi-Source OCR Correlation** | Links OCR extractions from STRs, C-File, PMRs, Blue Button to specific claimed conditions with provenance tracking | Existing OCR systems extract but don't correlate across document types for VA claims |
| **Proactive Rating Optimization** | Automatically identifies when medical evidence supports higher severity than veteran selected | No existing system performs VASRD-specific rating optimization |
| **Evidence-to-Regulation Mapping** | Real-time lookup of 38 CFR diagnostic codes with criteria matching against extracted evidence | Generic legal document systems don't integrate VASRD criteria |
| **Human-in-the-Loop Certification** | Cryptographic certification with full audit trail of veteran decisions | Novel combination of e-signature with claim-specific decision logging |
| **Claim Readiness Score** | Quantified probability based on weighted component analysis (evidence, nexus, compliance) | No existing predictive scoring for veteran claims |
| **Zero-Transmission Architecture** | All processing including OCR, validation, certification performed locally | Novel privacy-preserving architecture for sensitive claim data |

### 10.2 Prior Art Differentiation

**Existing Solutions (Prior Art):**

1. **VA.gov eBenefits** — Basic form submission, no validation, no optimization
2. **VetPro / Claims Agent Tools** — Professional tools, cloud-based, no veteran self-service
3. **Generic Document Management (DocuSign, Adobe)** — No domain-specific intelligence
4. **Medical Record Systems (Epic, Cerner)** — No claim optimization, no VA-specific logic

**VAULT Differentiation:**

- **Domain-Specific AI** — Purpose-built for 38 CFR Part 4
- **Local Processing** — Zero cloud transmission
- **Veteran-Empowering** — Self-service with expert-level intelligence
- **Proactive Optimization** — Not just passive data collection
- **Full Auditability** — Every decision tracked and certified

### 10.3 Claims Preview

**Independent Claims:**

1. A computer-implemented method for optimizing disability compensation claims comprising: aggregating medical evidence from multiple document sources; correlating extracted diagnoses to claimed conditions; detecting evidence gaps; generating optimization recommendations; and certifying veteran review with cryptographic signature.

2. A system for automated disability claim validation comprising: an evidence correlation engine; a regulatory compliance validator; a rating optimization module; a decision support interface; and a certification portal with digital signature capture.

3. An apparatus for local processing of sensitive claim data comprising: a browser-based application; local OCR processing; client-side cryptographic operations; and zero-network-transmission architecture.

**Dependent Claims** (expand on specific features):
- Multi-source OCR integration
- VASRD rating schedule lookup
- Bilateral factor detection
- Secondary condition inference
- Claim readiness scoring
- Audit trail with hash chain
- Form field mapping

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-03 | Alfred Hull | Initial specification |

---

**END OF TECHNICAL SPECIFICATION**

/**
 * CONFIDENTIAL — TRADE SECRET
 * © 2025 VAULT LLC, a Northstar|Insight Inc. corporation
 * All Rights Reserved
 */
