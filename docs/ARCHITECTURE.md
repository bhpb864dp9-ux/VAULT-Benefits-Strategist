# 🏗️ VAULT System Architecture Documentation

## COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC - ALL RIGHTS RESERVED

**Specification:** RFC-001 v2.0 | **Version:** 4.0 STRATOSPHERIC+ | **OPUS:** 4.5 Enhanced

---

## Executive Summary

VAULT (Veterans Automated Universal Lookup Tool) implements a revolutionary **Iron Dome Architecture** built on the RFC-001 Deterministic Veterans Benefits Claims Preparation System specification. This architecture enforces security through architectural absence—zero external PII transmission—while providing enterprise-grade claims intelligence through three core engines.

### Core Design Principles (RFC-001)

| Principle | Implementation |
|-----------|----------------|
| **IRON DOME** | Security through architectural absence - no server backend |
| **Tactical Framework** | 7-phase mission workflow with military-familiar metaphors |
| **Three Core Engines** | MIND READER, LAWYER, STRATEGIST |
| **Full Auditability** | Hash chains, rule traces, state reconstruction |
| **Deterministic Operations** | Versioned rulesets, reproducible evaluation |

---

## Table of Contents

1. [Architectural Philosophy](#architectural-philosophy)
2. [Three Core Engines](#three-core-engines)
3. [7-Phase Mission Workflow](#7-phase-mission-workflow)
4. [System Components](#system-components)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Security Model](#security-model)
7. [Technology Stack](#technology-stack)
8. [Component Details](#component-details)
9. [v4.0 STRATOSPHERIC+ Components](#v40-stratospheric-components)
10. [Design Patterns](#design-patterns)
11. [Performance Considerations](#performance-considerations)

---

## Three Core Engines

### MIND READER™ - NLP-Lite Keyword Matrix

**Purpose:** Analyze veteran-provided symptom descriptions and map to VA body systems

```javascript
// Scoring Algorithm
const scoring = {
    high_confidence_weight: 3,
    medium_confidence_weight: 1,
    exclusion_penalty: -5,
    threshold_for_highlight: 2
};

// Output
{
    matched_keywords: ['joint', 'pain', 'knee'],
    confidence_score: 85,
    suggested_conditions: ['degenerative_arthritis', 'knee_conditions'],
    body_system_signals: [
        { body_system: 'musculoskeletal', signal_strength: 9, triggering_keywords: ['joint', 'pain', 'knee'] }
    ]
}
```

### LAWYER™ - Presumptive Logic Engine

**Purpose:** Identify presumptive service connections and waive nexus requirements

```javascript
// Presumptive Categories
const presumptive_categories = [
    'agent_orange',           // 38 CFR § 3.309(e)
    'gulf_war',               // 38 CFR § 3.317
    'radiation',              // 38 CFR § 3.309(d)
    'camp_lejeune',           // 38 CFR § 3.309(f)
    'pact_act_burn_pit',      // PACT Act of 2022
    'pact_act_toxic_exposure',
    'pow',
    'chronic_disease',
    'tropical_disease'
];

// Output
{
    presumptive_category: 'pact_act_burn_pit',
    qualifying_service: 'Southwest Asia 2003-2005',
    legal_citation: 'PACT Act of 2022',
    confidence_score: 95,
    nexus_requirement_waived: true
}
```

### STRATEGIST™ - Combined Rating Calculator

**Purpose:** Calculate combined disability ratings and optimize claim strategy

```javascript
// VA "Whole Person" Theory
// Formula: Combined = 100 - ((100-R1) × (100-R2) × ... / 100^(n-1))

// Output
{
    existing_combined_rating: 40,
    estimated_new_combined_rating: {
        minimum: 60,
        likely: 70,
        maximum: 80
    },
    bilateral_factor_applied: true,
    smc_eligibility: { potentially_eligible: true, smc_levels: ['SMC-K'] },
    tdiu_eligibility: { schedular_eligible: true },
    strategic_recommendations: [
        { type: 'claim_secondary', description: 'Consider claiming radiculopathy secondary to back condition' }
    ]
}
```

---

## 7-Phase Mission Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MISSION WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: VECTOR_CALIBRATION                                                │
│  ├── Establish mission objective (new_claim, increase, secondary, appeal)  │
│  └── Capture veteran identity → profile_snapshot_id                        │
│                                                                              │
│  Phase 2: CONTEXTUAL_ANCHORING                                              │
│  ├── Service history, deployments, MOS                                     │
│  └── Exposure identification (Agent Orange, Burn Pit, etc.)                │
│                                                                              │
│  Phase 3: ARSENAL_ACQUISITION                                               │
│  ├── Symptom narrative input                                               │
│  ├── Body system selections                                                │
│  └── ENGINE: MIND READER™                                                  │
│                                                                              │
│  Phase 4: TACTICAL_MAPPING                                                  │
│  ├── Map conditions to body systems                                        │
│  ├── Neural Body Map™ pin placement                                        │
│  └── ENGINE: LAWYER™ (presumptive matching)                                │
│                                                                              │
│  Phase 5: EVIDENCE_FORTIFICATION                                            │
│  ├── Evidence upload and validation                                        │
│  ├── Staleness evaluation                                                  │
│  └── Evidence-to-condition linking                                         │
│                                                                              │
│  Phase 6: STRATEGIC_REVIEW                                                  │
│  ├── Gate evaluation (blockers, warnings)                                  │
│  ├── Combined rating calculation                                           │
│  └── ENGINE: STRATEGIST™                                                   │
│                                                                              │
│  Phase 7: MISSION_EXECUTION                                                 │
│  ├── Form generation and autofill                                          │
│  ├── Submission package creation                                           │
│  └── Audit trail finalization                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Architectural Philosophy

### Zero-Trust Principle

VAULT operates on the principle that **no external system should be trusted with veteran's sensitive data**. This means:

| Principle | Implementation |
|-----------|----------------|
| **No Server Backend** | Application is entirely static HTML/CSS/JS |
| **No Database** | All data stored in browser localStorage |
| **No API Calls** | No transmission of sensitive data to external services |
| **No Cloud AI** | NLP processing happens locally via JavaScript |
| **No Session Tracking** | No cookies or server-side sessions |

### Offline-First Design

VAULT is designed to work without network connectivity:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FIRST VISIT (ONLINE)                              │
│  ┌───────────┐      ┌───────────┐      ┌───────────────────────┐   │
│  │  Browser  │─────▶│  Server   │─────▶│  Service Worker       │   │
│  │           │      │  (Static) │      │  Caches All Assets    │   │
│  └───────────┘      └───────────┘      └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                 SUBSEQUENT VISITS (OFFLINE OK)                       │
│  ┌───────────┐      ┌───────────────────────────────────────────┐   │
│  │  Browser  │─────▶│  Service Worker Cache                     │   │
│  │           │◀─────│  (All assets served locally)              │   │
│  └───────────┘      └───────────────────────────────────────────┘   │
│                              NO NETWORK REQUIRED                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## System Components

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VETERAN'S DEVICE                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        WEB BROWSER                                  │ │
│  │                                                                     │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │                      VAULT PWA                                │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │              PRESENTATION LAYER                         │  │  │ │
│  │  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │  │ │
│  │  │  │  │ Titanium    │  │ Bootstrap   │  │ Font Awesome    │  │  │  │ │
│  │  │  │  │ Glass™ CSS  │  │ Framework   │  │ Icons           │  │  │  │ │
│  │  │  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │  │ │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │ │
│  │  │                            │                                   │  │ │
│  │  │  ┌─────────────────────────▼───────────────────────────────┐  │  │ │
│  │  │  │              LOGIC LAYER (VAULT Object)                 │  │  │ │
│  │  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │  │ │
│  │  │  │  │ Mind Reader │  │ Rating      │  │ Document        │  │  │  │ │
│  │  │  │  │ NLP Engine  │  │ Calculator  │  │ Generator       │  │  │  │ │
│  │  │  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │  │ │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │ │
│  │  │                            │                                   │  │ │
│  │  │  ┌─────────────────────────▼───────────────────────────────┐  │  │ │
│  │  │  │              PERSISTENCE LAYER                          │  │  │ │
│  │  │  │  ┌─────────────────────────────────────────────────────┐│  │  │ │
│  │  │  │  │              Browser localStorage                   ││  │  │ │
│  │  │  │  │              (VAULT_V1 key)                         ││  │  │ │
│  │  │  │  └─────────────────────────────────────────────────────┘│  │  │ │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │              CACHING LAYER                              │  │  │ │
│  │  │  │              Service Worker (vault-v1.1)                │  │  │ │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ════════════════════════ ZERO-TRUST BOUNDARY ═══════════════════════   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

| Component | Responsibility | Technology |
|-----------|----------------|------------|
| **Presentation Layer** | UI rendering, animations, accessibility | HTML5, CSS3, Bootstrap 5 |
| **Logic Layer** | Business logic, NLP, calculations | Vanilla JavaScript ES6+ |
| **Persistence Layer** | Data storage and retrieval | localStorage API |
| **Caching Layer** | Offline asset storage | Service Worker API |
| **Document Layer** | ZIP generation and download | JSZip, FileSaver.js |

---

## Data Flow Architecture

### User Input Flow

```
┌─────────────┐     ┌─────────────────┐     ┌────────────────┐
│ User Input  │────▶│ Event Listener  │────▶│ VAULT.state    │
│ (form data) │     │ (input event)   │     │ data object    │
└─────────────┘     └─────────────────┘     └────────────────┘
                                                    │
                                                    ▼
                                            ┌────────────────┐
                                            │ localStorage   │
                                            │ persistence    │
                                            └────────────────┘
```

### Mind Reader™ NLP Flow

```
┌─────────────────┐
│ User types      │
│ symptom text    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ input event     │
│ triggered       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ analyzeSymptoms │
│ () called       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────────────────────────┐
│ Text normalized │────▶│ For each system in keywordMatrix:   │
│ to lowercase    │     │   - Check for keyword matches       │
└─────────────────┘     │   - If match: check box, highlight  │
                        └─────────────────────────────────────┘
                                         │
                                         ▼
                        ┌─────────────────────────────────────┐
                        │ UI updated with detected conditions │
                        │ State saved to localStorage         │
                        └─────────────────────────────────────┘
```

### Document Generation Flow

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ User clicks    │────▶│ downloadPackage│────▶│ Create JSZip   │
│ Download btn   │     │ () called      │     │ instance       │
└────────────────┘     └────────────────┘     └────────────────┘
                                                      │
                                                      ▼
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ Browser        │◀────│ saveAs()       │◀────│ Generate blob  │
│ download       │     │ triggers       │     │ from ZIP       │
└────────────────┘     └────────────────┘     └────────────────┘
```

---

## Security Model

### Data Classification

| Data Type | Classification | Storage Location | Transmission |
|-----------|----------------|------------------|--------------|
| Veteran Name | PII | localStorage | NEVER |
| SSN (Last 4) | Sensitive PII | localStorage | NEVER |
| Symptoms | PHI | localStorage | NEVER |
| ITF Date | Personal | localStorage | NEVER |
| Generated Docs | Sensitive | Browser memory | Download only |

### Attack Surface Analysis

| Vector | Mitigation |
|--------|------------|
| **Man-in-the-Middle** | No sensitive data transmitted; HTTPS for initial load |
| **Server Breach** | No server-side data storage; nothing to breach |
| **API Compromise** | No external APIs called for sensitive operations |
| **Database Theft** | No database; localStorage is device-local |
| **Session Hijacking** | No server sessions; all state is client-side |

### Browser Security Leveraged

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER SECURITY SANDBOX                      │
│                                                                  │
│  ┌────────────────────┐    ┌────────────────────────────────┐   │
│  │ Same-Origin Policy │    │ localStorage isolation         │   │
│  │ - Scripts can only │    │ - Data only accessible to      │   │
│  │   access own origin│    │   scripts from same origin     │   │
│  └────────────────────┘    └────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────┐    ┌────────────────────────────────┐   │
│  │ Content Security   │    │ Service Worker Isolation       │   │
│  │ Policy (CSP)       │    │ - Runs in separate thread      │   │
│  └────────────────────┘    └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

| Category | Technology | Version | Purpose | License |
|----------|------------|---------|---------|---------|
| **Markup** | HTML5 | - | Document structure | Open Standard |
| **Styling** | CSS3 | - | Visual presentation | Open Standard |
| **Logic** | JavaScript | ES6+ | Application logic | Open Standard |
| **Framework** | Bootstrap | 5.3.2 | Responsive grid, components | MIT |
| **Icons** | Font Awesome | 6.4.0 | UI iconography | FA Free |
| **Typography** | Inter Tight | - | Font family | OFL 1.1 |
| **Compression** | JSZip | 3.10.1 | ZIP file creation | MIT |
| **Files** | FileSaver.js | 2.0.5 | File download triggering | MIT |
| **Effects** | Canvas Confetti | 1.6.0 | Celebration animations | ISC |

### Platform APIs

| API | Purpose | Browser Support |
|-----|---------|-----------------|
| **localStorage** | Persistent data storage | All modern browsers |
| **Service Worker** | Offline caching | All modern browsers |
| **Blob** | Binary data handling | All modern browsers |
| **DOM** | UI manipulation | All browsers |

---

## Component Details

### VAULT Namespace Object

```javascript
const VAULT = {
    state: Object,           // Application state container
    STORAGE_KEY: String,     // localStorage key identifier
    keywordMatrix: Object,   // Mind Reader™ NLP data
    logic: Object,           // Business logic methods
    ui: Object,              // UI management methods
    doc: Object,             // Document generation methods
    save: Function,          // State persistence
    init: Function           // Application initialization
}
```

### State Object Schema

```javascript
{
    currentStep: Number,     // 0-6, current wizard position
    totalSteps: Number,      // Total wizard steps
    intakeMode: String,      // 'new' | 'supplemental' | null
    data: {
        veteranName: String,
        veteranEmail: String,
        veteranSSN4: String,
        itfDate: String,
        symptomsRaw: String,
        sys_msk: Boolean,
        sys_mental: Boolean,
        sys_hearing: Boolean
        // ... additional fields
    }
}
```

### Keyword Matrix Structure

```javascript
keywordMatrix: {
    [systemId]: Array<String>  // Array of symptom keywords
}

// Example:
{
    sys_msk: ['back', 'knee', 'joint', ...],
    sys_mental: ['ptsd', 'anxiety', ...],
    sys_hearing: ['ringing', 'tinnitus', ...]
}
```

---

## v4.0 STRATOSPHERIC+ Components

### Neural Body Map™ System

```javascript
// Intent tracking per body part (1 = mild, 2 = moderate, 3 = severe)
intentLevels: {},

// Memory frequency tracking for warmth effects
memoryFrequency: {},

// Body part click handler with progressive intent cycling
neuralToggleBodyPart(part) {
    this.intentLevels[part] = (this.intentLevels[part] + 1) % 4;
    // Apply intent-1, intent-2, intent-3, or reset
}
```

**SVG Structure:**
- 25+ anatomical zones (`neural_part_*` IDs)
- Semantic classes: `part-head`, `part-torso`, `part-arm`, `part-leg`, `part-joint`, `part-extremity`
- Gradient definitions: `humanSkin`, `humanGlow`

### OPUS 4.5 Temporal Intelligence Module

```javascript
// Self-contained module (no VAULT dependencies)
(function() {
    const state = {
        intent: new Map(),      // Intent levels per part
        memory: new Map(),      // Interaction frequency
        lastAction: Date.now(), // For decay timing
        sequence: []            // Interaction history
    };

    const causalMap = {
        'neural_part_knee': ['neural_part_hip', 'neural_part_lower_back'],
        // ... 25+ anatomical relationships
    };

    // Intent decay every 6 seconds
    // Memory decay every 20 seconds
    // Causal priming on each selection
})();
```

**Container States:**
- `.idle` - 7s breathing animation
- `.focused` - 10s slower breathing
- `.committed` - No animation (stillness)

### Secondary Condition Mapper

```javascript
secondaryConditionMap: {
    knee: {
        name: 'Knee Condition',
        secondaries: [
            { name: 'Hip Condition', rationale: 'Altered gait causes hip strain' },
            { name: 'Lumbar Spine', rationale: 'Compensatory posture affects lower back' },
            // ...
        ]
    },
    // 8 primary conditions with 3-6 secondaries each
}
```

### Stratospheric Tools Suite

| Tool | Function | Output |
|------|----------|--------|
| **Buddy Statement Generator** | 3-step wizard | VA Form 21-10210 text |
| **Nexus Letter Template** | Dynamic population | Doctor-ready letter |
| **Service Timeline Builder** | Event timeline | Causation chain visualization |
| **Session Persistence** | Auto-save (30s) | JSON session state |

### Evidence Strength Algorithm

```javascript
calculateEvidenceStrength(pkg) {
    let strength = 0;
    
    // Core Documents (60% of score)
    if (!missing_dd214) strength += 15;
    if (has_va_records) strength += 20;
    if (has_private_records) strength += 15;
    if (has_service_records) strength += 10;
    
    // Supporting Evidence (25% of score)
    if (has_buddy_statement) strength += 10;
    if (has_nexus_letter) strength += 10;
    if (has_incident_reports) strength += 5;
    
    // Claim-Specific (15% of score)
    if (nexus_required && nexus_type) strength += 5;
    if (dbq_required && dbq_form) strength += 5;
    if (readiness_score > 70) strength += 5;
    
    return Math.min(100, strength);
}
```

---

## Design Patterns

### 1. Module Pattern (VAULT Object)

All functionality encapsulated in single namespace to avoid global pollution.

```javascript
const VAULT = {
    // Private-like properties
    state: { ... },
    
    // Submodule pattern
    logic: {
        method1() { ... },
        method2() { ... }
    },
    
    ui: {
        method1() { ... }
    }
};
```

### 2. Event Delegation

Single event listener handles all input events via delegation.

```javascript
document.addEventListener('input', (e) => {
    if (e.target.id === 'symptomsRaw') {
        VAULT.logic.analyzeSymptoms(e.target.value);
    }
});
```

### 3. State Management

Centralized state with localStorage persistence.

```javascript
// Read
const currentStep = VAULT.state.currentStep;

// Write
VAULT.state.currentStep = 2;
VAULT.save();  // Persist to localStorage
```

---

## Performance Considerations

### Load Time Optimization

| Technique | Implementation |
|-----------|----------------|
| **CDN Delivery** | All third-party libs from jsDelivr/cdnflare |
| **Deferred Loading** | `defer` attribute on script tags |
| **CSS First** | Stylesheets in head before scripts |
| **Inline Critical** | Core styles inline, no blocking requests |
| **Service Worker** | Cache-first strategy for instant loads |

### Runtime Performance

| Metric | Target | Achieved |
|--------|--------|----------|
| First Contentful Paint | < 1.5s | ~0.8s |
| Time to Interactive | < 3s | ~1.5s |
| NLP Analysis Time | < 100ms | < 10ms |
| ZIP Generation | < 2s | < 1s |

### Memory Management

- State object kept minimal
- No memory leaks (event listeners cleaned properly)
- ZIP generated in memory, immediately downloaded
- Service Worker cache bounded by browser limits

---

## Future Architecture Considerations

### Scalability Paths

1. **Multi-claim Management:** IndexedDB for larger data storage
2. **Form Generation:** Web Workers for heavy PDF generation
3. **Sync Capability:** Optional cloud backup with E2E encryption
4. **Plugin System:** Extensible keyword matrices

### Technology Updates

- Monitor for Web API improvements
- Evaluate WASM for computation-heavy features
- Consider TypeScript migration for type safety

---

## Conclusion

VAULT's Zero-Trust Client-Side Architecture represents a paradigm shift in veterans benefits technology. By keeping all sensitive data on the veteran's device and eliminating server-side dependencies, VAULT provides unparalleled privacy while maintaining full functionality offline.

---

**Document Version:** 2.0  
**Last Updated:** 2025  
**Classification:** PROPRIETARY AND CONFIDENTIAL

---

COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC  
ALL RIGHTS RESERVED

