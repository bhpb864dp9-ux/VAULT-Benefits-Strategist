# CURSOR AI RECONCILIATION DIRECTIVE
## VAULT LLC — A Northstar|Insight Inc. Company

---

## DIRECTIVE METADATA

| Field | Value |
|-------|-------|
| **Directive ID** | CURSOR-DIR-2026-001 |
| **Target System** | Cursor AI / Claude / GPT |
| **Registry Version** | VAULT-FEATURE-REGISTRY-IMMUTABLE-002 |
| **Execution Plan** | v6.1.0 |
| **Effective Date** | 2026-01-02 |

---

## PURPOSE

This directive instructs AI development agents to **reconcile against the authoritative VAULT registry** before executing any development tasks. All work must be **version-locked**.

---

## VERSION LOCK

```yaml
version_lock:
  executionPlan: "6.1.0"
  registryId: "VAULT-FEATURE-REGISTRY-IMMUTABLE-002"
  corporateEntity: "VAULT LLC"
  parentCorporation: "Northstar|Insight Inc."
```

---

## PRE-EXECUTION CHECKLIST

Before ANY development task:

1. ✅ Load `registry/VAULT-FEATURE-REGISTRY-IMMUTABLE-002.json`
2. ✅ Verify feature ID exists in registry
3. ✅ Confirm feature status is ACTIVE or PLANNED
4. ✅ Load acceptance criteria
5. ✅ Follow registered implementation paths

---

## FEATURE ID FORMAT

```
VAULT-[CATEGORY]-[EPIC_CODE]-[SEQUENCE]

Categories:
  F   = Functional Feature
  NF  = Non-Functional Feature
  UI  = UI Component
  ACC = Accessibility Feature
  QA  = Quality Assurance

Epic Codes:
  PF  = Profile & Service History
  MR  = Mind Reader Engine
  LW  = Lawyer Engine
  ST  = Strategist Engine
  DG  = Document Generation
  WF  = 7-Phase Workflow
  BB  = Blue Button Integration
  PW  = PWA & Offline
  EI  = Edge Intelligence
  EO  = Evidence Optimizer
  VN  = VBIO Network
  LC  = Licensing
  TD  = The Doctor AR
```

---

## ADOPTED FEATURES (DO NOT MODIFY)

| ID | Name | Epic |
|----|------|------|
| VAULT-F-BB-001 | Blue Button Upload → Identity Autofill | BB |
| VAULT-F-VC-002 | Battle Buddy Mode | VC |
| VAULT-F-EI-001 | Evidence OCR Intake (On-Device) | EI |
| VAULT-UI-WF-001 | Interactive Body Map UI | WF |
| VAULT-F-MR-001 | Narrative Mind Reader | MR |
| VAULT-F-DG-001 | Buddy Statement Generator | DG |
| VAULT-NF-PW-001 | PWA Offline Caching | PW |
| VAULT-ACC-001 | Skip Link Navigation | AC |

---

## ACTIVE FEATURES (Current Targets)

| ID | Name | Epic | Sprint |
|----|------|------|--------|
| VAULT-F-PF-001 | Identity Capture Complete | PF | 2 |
| VAULT-F-MR-002 | Pattern Predictor | MR | 5 |
| VAULT-F-DG-002 | Timeline Builder + Export | DG | 4 |
| VAULT-F-VC-001 | POA Capture | VC | 3 |

---

## PRIVACY MANDATE

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🔒 SECURITY BY ABSENCE™                                    ║
║                                                               ║
║   ABSOLUTELY PROHIBITED:                                      ║
║   ⛔ fetch() calls with user data                            ║
║   ⛔ Analytics/tracking scripts                              ║
║   ⛔ Cloud storage integrations                              ║
║   ⛔ Any network transmission of PII                         ║
║                                                               ║
║   ALL data MUST remain in:                                   ║
║   ✅ localStorage                                            ║
║   ✅ IndexedDB                                               ║
║   ✅ In-memory state (Zustand)                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## RECONCILIATION COMMANDS

### `VAULT_RECONCILE`
Load docs, verify version lock, prepare for work.

### `VAULT_STATUS`
Report registry statistics and milestone progress.

### `VAULT_IMPLEMENT [FEATURE_ID]`
Implement specific feature by canonical ID.

### `VAULT_ADOPT [FEATURE_ID]`
Mark feature as ADOPTED after AC verification.

---

## CORPORATE IDENTITY

All outputs must reference:

- **Product:** VAULT (Veterans Automated Universal Lookup Tool)
- **Owner:** VAULT LLC
- **Parent:** Northstar|Insight Inc.
- **Tagline:** "Security by Absence™"
- **Mission:** "You Served. You Sacrificed. You Deserve Better."

---

© 2026 VAULT LLC, A Northstar|Insight Inc. Company
