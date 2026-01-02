## VAULT Feature Plan (Theme → Epic → Feature → Functions)

- **Registry**: `VAULT-FEATURE-REGISTRY-IMMUTABLE-002`
- **Schema**: `1.0.0`
- **Checksum**: `78ceeeb2ba4b693a1a57b91e68acce13c42fbdb4c50cc84a28fc7629ea843dc6`
- **Generated**: `2026-01-01T18:43:43.103Z`

### Theme: **VAULT-TH-001** — Privacy-First, Offline by Default

- **Tagline**: Everything stays on device
- **Status**: ACTIVE

#### Epic: **VAULT-EP-001** (PF) — Profile & Service History

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: product

##### Feature: **VAULT-F-PF-001** — Identity Capture (Profile + Service History)

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 2
- **AC**:
  - `AC-009` **PASS** — Identity form captures name, DOB, contact info, and service dates
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

#### Epic: **VAULT-EP-006** (WF) — 7-Phase Workflow

- **Priority**: P0
- **Status**: ACTIVE
- **Owner**: product

##### Feature: **VAULT-UI-WF-001** — Interactive Body Map UI

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 3
- **AC**:
  - `AC-003` **PASS** — Clicking a body region cycles severity and persists selection
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Conditions/BodyMap.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Conditions/BodyMap.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Conditions/BodyMap.tsx`:
    - `BodyMap`
    - `cycleIntent`
    - `intentClass`
    - `togglePart`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

#### Epic: **VAULT-EP-007** (BB) — Blue Button Integration

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-F-BB-001** — Blue Button Upload → Identity Autofill

- **Status**: ADOPTED
- **Priority**: P0
- **Sprint**: 2
- **AC**:
  - `AC-001` **PASS** — User can upload a Blue Button file from Identity phase
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/lib/blueButton.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/lib/blueButton.ts`:
    - `extractIdentityFromBlueButton`
    - `normalizeDob`
    - `normalizePhone`
    - `tryParseXml`
    - `tryParseJson`
    - `tryParseText`
    - `matchFirst`

#### Epic: **VAULT-EP-008** (PW) — PWA & Offline

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-NF-PW-001** — PWA Offline Caching & Installability

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 1
- **AC**:
  - `AC-007` **PASS** — App provides PWA manifest and service worker integration
- **Primary componentPath**: `src/web/Project/react-vite/vite.config.ts`
- **Files**:
  - `src/web/Project/react-vite/vite.config.ts`
  - `src/web/Project/react-vite/src/main.tsx`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/vite.config.ts`:
    - _(none detected)_
  - `src/web/Project/react-vite/src/main.tsx`:
    - _(none detected)_

#### Epic: **VAULT-EP-012** (EI) — Edge Intelligence

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-F-EI-001** — Evidence OCR Intake (On-Device)

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 4
- **AC**:
  - `AC-002` **PASS** — User can upload evidence and receive OCR results locally
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Evidence/OCRIntake.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Evidence/OCRIntake.tsx`
  - `src/web/Project/react-vite/src/lib/ocrProcessor.ts`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Evidence/OCRIntake.tsx`:
    - `OCRIntake`
    - `makeId`
    - `formatBytes`
    - `startOCR`
  - `src/web/Project/react-vite/src/lib/ocrProcessor.ts`:
    - `validateFile`
    - `isOCRSupported`
    - `getOCRStatus`
    - `OCR_CONFIG`
    - `getCreateWorker`
    - `initializeOCR`
    - `terminateOCR`
    - `processDocument`
    - `extractDiagnoses`
    - `extractDates`
    - `extractICD10Codes`
    - `extractMedications`
    - `extractProviders`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

#### Epic: **VAULT-EP-013** (AC) — Accessibility

- **Priority**: P2
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-ACC-001** — Skip Link (Keyboard Navigation)

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 1
- **AC**:
  - `AC-008` **PASS** — Skip link is present and focusable
- **Primary componentPath**: `src/web/Project/react-vite/src/App.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/App.tsx`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/App.tsx`:
    - `App`
    - `NotFound`

#### Epic: **VAULT-EP-014** (VC) — VSO Collaboration

- **Priority**: P2
- **Status**: ACTIVE
- **Owner**: product

##### Feature: **VAULT-F-VC-001** — Representation (POA) Capture

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 3
- **AC**:
  - `AC-010` **PASS** — POA section supports choosing rep type and optional details
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

##### Feature: **VAULT-F-VC-002** — Battle Buddy Mode

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 3
- **AC**:
  - `AC-011` **PASS** — Toggle enables helper name/relationship capture
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

### Theme: **VAULT-TH-002** — Claim Quality & Evidence Strength

- **Tagline**: Make the claim legible, coherent, and complete
- **Status**: ACTIVE

#### Epic: **VAULT-EP-001** (PF) — Profile & Service History

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: product

##### Feature: **VAULT-F-PF-001** — Identity Capture (Profile + Service History)

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 2
- **AC**:
  - `AC-009` **PASS** — Identity form captures name, DOB, contact info, and service dates
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

#### Epic: **VAULT-EP-002** (MR) — Mind Reader Engine

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-F-MR-001** — Narrative Mind Reader (Keyword Detection)

- **Status**: ADOPTED
- **Priority**: P0
- **Sprint**: 5
- **AC**:
  - `AC-004` **PASS** — System suggests conditions based on narrative keywords
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseNarrative.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseNarrative.tsx`
  - `src/web/Project/react-vite/src/lib/narrativeIntel.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseNarrative.tsx`:
    - `PhaseNarrative`
    - `addSuggestedCondition`
    - `handleCopy`
    - `insertPrompt`
  - `src/web/Project/react-vite/src/lib/narrativeIntel.ts`:
    - `detectConditionsFromNarrative`
    - `suggestRelatedConditions`
    - `normalize`
    - `kws`

##### Feature: **VAULT-F-MR-002** — Pattern Predictor (Related Condition Suggestions)

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 5
- **AC**:
  - `AC-012` **PASS** — System suggests related conditions based on current selections
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseNarrative.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseNarrative.tsx`
  - `src/web/Project/react-vite/src/lib/narrativeIntel.ts`
  - `src/web/Project/react-vite/src/data/bodySystems.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseNarrative.tsx`:
    - `PhaseNarrative`
    - `addSuggestedCondition`
    - `handleCopy`
    - `insertPrompt`
  - `src/web/Project/react-vite/src/lib/narrativeIntel.ts`:
    - `detectConditionsFromNarrative`
    - `suggestRelatedConditions`
    - `normalize`
    - `kws`
  - `src/web/Project/react-vite/src/data/bodySystems.ts`:
    - `BODY_SYSTEMS`
    - `getAllConditions`
    - `getSystemById`
    - `getConditionById`
    - `searchConditions`

#### Epic: **VAULT-EP-005** (DG) — Document Generation

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-F-DG-001** — Buddy Statement Generator

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 4
- **AC**:
  - `AC-005` **PASS** — User can download a buddy statement as a local file
- **Primary componentPath**: `src/web/Project/react-vite/src/pages/Tools.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/pages/Tools.tsx`
  - `src/web/Project/react-vite/src/lib/download.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/pages/Tools.tsx`:
    - `Tools`
    - `generateBuddyStatement`
    - `addEvent`
    - `exportTimeline`
  - `src/web/Project/react-vite/src/lib/download.ts`:
    - `downloadTextFile`

##### Feature: **VAULT-F-DG-002** — Service Timeline Builder + Export

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 4
- **AC**:
  - `AC-006` **PASS** — User can add timeline events and export a timeline file
- **Primary componentPath**: `src/web/Project/react-vite/src/pages/Tools.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/pages/Tools.tsx`
  - `src/web/Project/react-vite/src/lib/artifacts.ts`
  - `src/web/Project/react-vite/src/lib/download.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/pages/Tools.tsx`:
    - `Tools`
    - `generateBuddyStatement`
    - `addEvent`
    - `exportTimeline`
  - `src/web/Project/react-vite/src/lib/artifacts.ts`:
    - `safeFilenamePart`
    - `buildBuddyStatementText`
    - `buildTimelineText`
    - `trimmed`
    - `date`
    - `conditionLines`
    - `generatedAt`
  - `src/web/Project/react-vite/src/lib/download.ts`:
    - `downloadTextFile`

#### Epic: **VAULT-EP-006** (WF) — 7-Phase Workflow

- **Priority**: P0
- **Status**: ACTIVE
- **Owner**: product

##### Feature: **VAULT-UI-WF-001** — Interactive Body Map UI

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 3
- **AC**:
  - `AC-003` **PASS** — Clicking a body region cycles severity and persists selection
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Conditions/BodyMap.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Conditions/BodyMap.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Conditions/BodyMap.tsx`:
    - `BodyMap`
    - `cycleIntent`
    - `intentClass`
    - `togglePart`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

#### Epic: **VAULT-EP-007** (BB) — Blue Button Integration

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-F-BB-001** — Blue Button Upload → Identity Autofill

- **Status**: ADOPTED
- **Priority**: P0
- **Sprint**: 2
- **AC**:
  - `AC-001` **PASS** — User can upload a Blue Button file from Identity phase
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/lib/blueButton.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/lib/blueButton.ts`:
    - `extractIdentityFromBlueButton`
    - `normalizeDob`
    - `normalizePhone`
    - `tryParseXml`
    - `tryParseJson`
    - `tryParseText`
    - `matchFirst`

#### Epic: **VAULT-EP-012** (EI) — Edge Intelligence

- **Priority**: P1
- **Status**: ACTIVE
- **Owner**: engineering

##### Feature: **VAULT-F-EI-001** — Evidence OCR Intake (On-Device)

- **Status**: ADOPTED
- **Priority**: P1
- **Sprint**: 4
- **AC**:
  - `AC-002` **PASS** — User can upload evidence and receive OCR results locally
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Evidence/OCRIntake.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Evidence/OCRIntake.tsx`
  - `src/web/Project/react-vite/src/lib/ocrProcessor.ts`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Evidence/OCRIntake.tsx`:
    - `OCRIntake`
    - `makeId`
    - `formatBytes`
    - `startOCR`
  - `src/web/Project/react-vite/src/lib/ocrProcessor.ts`:
    - `validateFile`
    - `isOCRSupported`
    - `getOCRStatus`
    - `OCR_CONFIG`
    - `getCreateWorker`
    - `initializeOCR`
    - `terminateOCR`
    - `processDocument`
    - `extractDiagnoses`
    - `extractDates`
    - `extractICD10Codes`
    - `extractMedications`
    - `extractProviders`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

#### Epic: **VAULT-EP-014** (VC) — VSO Collaboration

- **Priority**: P2
- **Status**: ACTIVE
- **Owner**: product

##### Feature: **VAULT-F-VC-001** — Representation (POA) Capture

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 3
- **AC**:
  - `AC-010` **PASS** — POA section supports choosing rep type and optional details
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

##### Feature: **VAULT-F-VC-002** — Battle Buddy Mode

- **Status**: ADOPTED
- **Priority**: P2
- **Sprint**: 3
- **AC**:
  - `AC-011` **PASS** — Toggle enables helper name/relationship capture
- **Primary componentPath**: `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
- **Files**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`

- **Key functions/components (auto-extracted)**:
  - `src/web/Project/react-vite/src/components/Workflow/PhaseIdentity.tsx`:
    - `PhaseIdentity`
    - `handleChange`
    - `handleBlueButtonUpload`
  - `src/web/Project/react-vite/src/stores/claimStore.ts`:
    - `useClaimStore`
    - `useIdentity`
    - `useMission`
    - `useConditions`
    - `useNarrative`
    - `useCurrentPhase`
    - `useToasts`
    - `useSelectedSystems`
    - `useAuditTrail`
    - `usePOA`
    - `useBattleBuddy`
    - `useTimeline`
    - `useIntentLevels`
    - `generateId`
    - `createInitialClaimData`

### Registry Totals

- **Themes**: 2
- **Epics**: 9
- **Features**: 12
- **Acceptance Criteria**: 12
- **Adoption rate**: 100%
