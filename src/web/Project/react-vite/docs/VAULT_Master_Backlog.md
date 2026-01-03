/**
 * VAULT Master Backlog
 *
 * © 2025 VAULT LLC, a Northstar|Insight Inc. corporation
 * All Rights Reserved
 *
 * Engineer: Alfred Hull
 * Last Updated: 2026-01-03
 */

# VAULT Master Backlog

## Backlog Overview

| Theme | Epic Count | Total Stories | Total Fib Points |
|-------|------------|---------------|------------------|
| VAULT-ASR (Assurance) | 1 | 6 | 39 |
| VAULT-LG (Liquid Glass) | — | — | — |
| VAULT-DEM (DEM Engine) | — | — | — |
| VAULT-OCR (Evidence OCR) | — | — | — |

---

## Theme: VAULT-ASR (Assurance)

### EPIC: ASR-001 — Phase 4 Entitlement Assurance Engine

**Story ID:** ASR-001
**Type:** EPIC
**Fibonacci:** 21 (aggregate of sub-stories: 5+8+8+8+5+5 = 39, capped at 21 for epic)
**Theme:** VAULT-ASR
**Status:** 🟡 Ready for Development

#### Description

Replace Phase 4 "Mind Reader/Narrative" with "Assurance" — a pre-certification validation layer that provides deterministic claim optimization with human-in-the-loop certification.

The Entitlement Assurance Engine:

1. **AGGREGATES** all upstream data:
   - OCR results from Phase 2 (STRs, C-File, PMRs, Blue Button)
   - Selected conditions from Phase 3
   - Severity ratings and DEM calculations
   - Any narrative drafts

2. **VALIDATES** for completeness:
   - Evidence gaps (conditions without documentation)
   - Nexus deficiencies (missing service connection)
   - Form field completeness

3. **OPTIMIZES** proactively:
   - Identifies conditions where evidence supports higher severity
   - Flags bilateral factor opportunities
   - Suggests secondary conditions based on medical relationships

4. **PRESENTS** Decision Support Interface:
   - Critical Gaps (must fix)
   - Optimization Opportunities (recommended)
   - Verified Complete (green checkmarks)
   - Claim Readiness Score (percentage)

5. **CERTIFIES** with legal acknowledgment:
   - Veteran reviews all items
   - Checks certification boxes
   - Digital signature with timestamp
   - Generates Claim Integrity Certificate

6. **PASSES** certified package to Phase 5 for final generation

#### Acceptance Criteria

- [ ] All upstream data (Phases 1-3) aggregated into unified context
- [ ] Evidence gap detection identifies 100% of conditions without documentation
- [ ] Rating optimization detects severity upgrade opportunities with VASRD citation
- [ ] Bilateral factor detection per 38 CFR § 4.26
- [ ] Claim Readiness Score calculated with component breakdown
- [ ] Decision Support UI renders all findings with action buttons
- [ ] Certification portal captures digital signature
- [ ] Claim Integrity Certificate generated with SHA-256 hash
- [ ] Zero data transmission (all processing local)
- [ ] 99% CI for critical path tests

#### Dependencies

- REL-020: OCR Engine (must be working)
- DEM-013: VASRD Calculator (must be complete)
- Phase 3 condition selection (must be complete)

#### Technical Specification

See: `docs/ASR-001-entitlement-assurance-spec.md`

#### Patent Documentation

See: `docs/PATENT-entitlement-assurance-system.md`

---

### SUB-STORY: ASR-001a — Upstream Data Aggregation Service

**Story ID:** ASR-001a
**Type:** Story
**Fibonacci:** 5
**Parent:** ASR-001
**Status:** 🔵 To Do

#### Description

Create a service that aggregates data from Phases 1-3 into a unified `ClaimAssuranceContext` data structure.

#### Tasks

- [ ] Define `ClaimAssuranceContext` TypeScript interface
- [ ] Create `useClaimAssuranceContext` hook
- [ ] Pull veteran identity from Phase 1 store
- [ ] Pull documents and OCR results from Phase 2 store
- [ ] Pull selected conditions and DEM results from Phase 3 store
- [ ] Merge into unified context with proper typing
- [ ] Add context validation (required fields present)
- [ ] Write unit tests for aggregation logic

#### Acceptance Criteria

- [ ] Context populated with all Phase 1-3 data
- [ ] TypeScript types match spec interfaces
- [ ] Handles missing/incomplete upstream data gracefully
- [ ] Unit test coverage > 80%

#### Dependencies

- Phase 1-3 stores must be complete

---

### SUB-STORY: ASR-001b — Evidence Gap Detection Algorithm

**Story ID:** ASR-001b
**Type:** Story
**Fibonacci:** 8
**Parent:** ASR-001
**Status:** 🔵 To Do

#### Description

Implement the Evidence Gap Detection Algorithm that identifies claimed conditions lacking adequate supporting documentation.

#### Tasks

- [ ] Create `EvidenceCorrelation` interface
- [ ] Implement `findLinkedEvidence()` function
  - [ ] Strategy 1: Direct text matching
  - [ ] Strategy 2: ICD-10/SNOMED code matching
  - [ ] Strategy 3: Symptom keyword matching
- [ ] Implement `evaluateEvidenceSufficiency()` function
- [ ] Implement `detectEvidenceGaps()` main function
- [ ] Create `AssuranceFinding` interface for gap findings
- [ ] Add remediation option generation
- [ ] Write unit tests with mock OCR data

#### Acceptance Criteria

- [ ] Detects conditions with no linked evidence
- [ ] Detects conditions with weak evidence
- [ ] Generates actionable remediation options
- [ ] Returns findings with source citations
- [ ] Unit test coverage > 80%

#### Dependencies

- ASR-001a (aggregated context required)

---

### SUB-STORY: ASR-001c — Rating Optimization Engine

**Story ID:** ASR-001c
**Type:** Story
**Fibonacci:** 8
**Parent:** ASR-001
**Status:** 🔵 To Do

#### Description

Implement the Rating Optimization Engine that identifies conditions where medical evidence supports a higher severity rating than the veteran selected.

#### Tasks

- [ ] Create `OptimizationRecommendation` interface
- [ ] Implement `extractSeverityIndicators()` function
  - [ ] ROM measurement extraction
  - [ ] Frequency indicator extraction
  - [ ] Functional impact keyword extraction
- [ ] Implement `mapToVASRDCriteria()` function
- [ ] Implement `findRatingOptimizations()` main function
- [ ] Implement `detectBilateralOpportunities()` function
- [ ] Implement `inferSecondaryConditions()` function
- [ ] Create VASRD criteria lookup database
- [ ] Create secondary condition rules database
- [ ] Calculate rating/compensation impact
- [ ] Write unit tests

#### Acceptance Criteria

- [ ] Detects severity upgrade opportunities
- [ ] Detects bilateral factor opportunities per 38 CFR § 4.26
- [ ] Infers secondary conditions from rules database
- [ ] Calculates accurate impact on combined rating
- [ ] Returns recommendations with evidence citations
- [ ] Unit test coverage > 80%

#### Dependencies

- ASR-001a (aggregated context required)
- DEM-013 (VASRD calculator for impact calculation)

---

### SUB-STORY: ASR-001d — Decision Support UI Component

**Story ID:** ASR-001d
**Type:** Story
**Fibonacci:** 8
**Parent:** ASR-001
**Status:** 🔵 To Do

#### Description

Create the Decision Support Interface that presents validation findings and optimization recommendations to the veteran with action capabilities.

#### Tasks

- [ ] Create `AssurancePage.tsx` main component
- [ ] Create `ClaimReadinessCard.tsx` with score gauge
- [ ] Create `FindingsAccordion.tsx` collapsible sections
- [ ] Create `GapCard.tsx` for critical gap display
- [ ] Create `OptimizationCard.tsx` for recommendations
- [ ] Create `VerifiedItem.tsx` for complete items
- [ ] Implement action handlers (accept, reject, modify)
- [ ] Connect to Zustand store for state management
- [ ] Apply Liquid Glass styling
- [ ] Add Framer Motion animations
- [ ] Write component tests

#### Acceptance Criteria

- [ ] Displays Claim Readiness Score with component breakdown
- [ ] Renders critical gaps with expand/collapse
- [ ] Renders optimization opportunities with accept/decline
- [ ] Renders verified complete items
- [ ] Actions update state correctly
- [ ] Responsive design (mobile-friendly)
- [ ] Accessibility compliant (WCAG 2.1 AA)
- [ ] Component test coverage > 70%

#### Dependencies

- ASR-001b (gap findings)
- ASR-001c (optimization recommendations)

---

### SUB-STORY: ASR-001e — Certification Portal with Digital Signature

**Story ID:** ASR-001e
**Type:** Story
**Fibonacci:** 5
**Parent:** ASR-001
**Status:** 🔵 To Do

#### Description

Create the Certification Portal that captures veteran acknowledgment and digital signature for legal certification.

#### Tasks

- [ ] Create `CertificationPortal.tsx` component
- [ ] Create `FinalReviewTable.tsx` summary display
- [ ] Create `CertificationStatements.tsx` checkbox list
- [ ] Create `SignatureInput.tsx` with validation
- [ ] Implement `ClaimIntegrityCertificate` generation
- [ ] Implement SHA-256 hash calculation using Web Crypto API
- [ ] Create audit trail entry for certification
- [ ] Block next step until all checkboxes checked and signed
- [ ] Store certificate in IndexedDB
- [ ] Write component and integration tests

#### Acceptance Criteria

- [ ] Displays final review summary
- [ ] Requires all certification statements acknowledged
- [ ] Captures typed name as digital signature
- [ ] Generates SHA-256 hash of claim data
- [ ] Creates ClaimIntegrityCertificate with timestamp
- [ ] Blocks progress until fully certified
- [ ] Certificate persisted locally
- [ ] Test coverage > 80%

#### Dependencies

- ASR-001d (must complete decisions before certification)

---

### SUB-STORY: ASR-001f — Claim Readiness Score Calculator

**Story ID:** ASR-001f
**Type:** Story
**Fibonacci:** 5
**Parent:** ASR-001
**Status:** 🔵 To Do

#### Description

Implement the Claim Readiness Score Calculator that generates a quantified probability of claim success.

#### Tasks

- [ ] Create `ClaimReadinessScore` interface
- [ ] Implement `calculateEvidenceScore()` component
- [ ] Implement `calculateNexusScore()` component
- [ ] Implement `calculateNarrativeScore()` component
- [ ] Implement `calculateFormScore()` component
- [ ] Implement `calculateComplianceScore()` component
- [ ] Implement `calculateClaimReadinessScore()` main function
- [ ] Apply component weights per spec
- [ ] Apply critical gap penalty
- [ ] Calculate condition-level scores
- [ ] Generate improvement actions
- [ ] Write unit tests

#### Acceptance Criteria

- [ ] Calculates overall score 0-100
- [ ] Assigns letter grade (A-F)
- [ ] Breaks down by component (evidence, nexus, form, compliance)
- [ ] Calculates per-condition scores
- [ ] Generates prioritized improvement actions
- [ ] Penalty applied for critical gaps
- [ ] Unit test coverage > 80%

#### Dependencies

- ASR-001b (gap findings for penalty)
- ASR-001c (optimization data for scoring)

---

## Backlog Prioritization

### Sprint Candidates (Next Sprint)

| Priority | Story ID | Title | Fib | Rationale |
|----------|----------|-------|-----|-----------|
| 1 | ASR-001a | Data Aggregation | 5 | Foundation for all other stories |
| 2 | ASR-001b | Gap Detection | 8 | Core validation capability |
| 3 | ASR-001f | Readiness Score | 5 | Needed for UI display |

### Future Sprints

| Priority | Story ID | Title | Fib | Rationale |
|----------|----------|-------|-----|-----------|
| 4 | ASR-001c | Rating Optimization | 8 | Value-add after core validation |
| 5 | ASR-001d | Decision Support UI | 8 | Display after backend ready |
| 6 | ASR-001e | Certification Portal | 5 | Final step in workflow |

---

## Completed Stories

| Story ID | Title | Completed | Notes |
|----------|-------|-----------|-------|
| — | — | — | — |

---

## Glossary

| Term | Definition |
|------|------------|
| **Fib** | Fibonacci points (1, 2, 3, 5, 8, 13, 21) |
| **EPIC** | Large story that contains sub-stories |
| **DEM** | Deterministic Entitlement Maximization |
| **VASRD** | VA Schedule for Rating Disabilities (38 CFR Part 4) |
| **STR** | Service Treatment Record |
| **C-File** | VA Claims File |
| **PMR** | Private Medical Record |
| **OCR** | Optical Character Recognition |
| **CI** | Confidence Interval (test coverage target) |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-03 | Alfred Hull | Initial backlog with ASR-001 EPIC |

---

/**
 * © 2025 VAULT LLC, a Northstar|Insight Inc. corporation
 * All Rights Reserved
 */
