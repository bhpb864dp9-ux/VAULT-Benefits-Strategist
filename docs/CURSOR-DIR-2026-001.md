╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    CURSOR AI RECONCILIATION DIRECTIVE                        ║
║                                                                              ║
║                          VAULT LLC                                           ║
║                  A Northstar|Insight Inc. Company                            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

---

## Directive Metadata

| Field | Value |
|-------|-------|
| **Directive ID** | CURSOR-DIR-2026-001 |
| **Target System** | Cursor AI / GPT-52 / Claude |
| **Reference Document** | VAULT-Master-Execution-Plan-v6.0.0 |
| **Registry Version** | VAULT-FEATURE-REGISTRY-IMMUTABLE-001 |
| **Effective Date** | 2026-01-01 |
| **Status** | ACTIVE |
| **Owner** | VAULT LLC, A Northstar|Insight Inc. Company |

---

## Purpose

Before executing ANY VAULT development task, the agent MUST reconcile against:

1. **VAULT-Master-Execution-Plan-v6.0.0** (highest authority)
2. **VAULT-FEATURE-REGISTRY-IMMUTABLE-001** (`registry/v1/feature-registry.v1.0.0.json`)
3. **VAULT Feature Registry Schema** (`registry/v1/schema.ts`)

This keeps all work **version-locked** to the canonical plan and registry.

---

## Version Lock Assertion (must match exactly)

```ts
const VERSION_LOCK = {
  executionPlan: "6.0.0",
  registryId: "VAULT-FEATURE-REGISTRY-IMMUTABLE-001",
  registryChecksum: "6a57635e745b821259a89d6e210fd03e3c4cdac95108c292ab40610808c5461a",
  schemaVersion: "1.0.0",
  corporateEntity: "VAULT LLC",
  parentCorporation: "Northstar|Insight Inc."
};
```

---

## Immutable Rules (non-negotiable)

- **Never invent new feature IDs** without explicit approval.
- **Never modify existing feature IDs**.
- **Never change ADOPTED features** without an explicit registry version bump + checksum update.
- **Always** keep VAULT privacy mandate: **Security by Absence™** (no network transmission of PII).

---

## Operational Commands

Agents should support:

- `VAULT_RECONCILE`
- `VAULT_STATUS`
- `VAULT_IMPLEMENT [FEATURE_ID]`
- `VAULT_ADOPT [FEATURE_ID]`

Automation is provided in `tools/feature-registry/`.

---

## Corporate Identity (must be referenced consistently)

- **Product**: VAULT (Veterans Automated Universal Lookup Tool)
- **Owner**: VAULT LLC
- **Parent**: Northstar|Insight Inc.
- **Tagline**: Security by Absence™
- **Mission**: You Served. You Sacrificed. You Deserve Better.

---

© 2026 VAULT LLC, A Northstar|Insight Inc. Company


