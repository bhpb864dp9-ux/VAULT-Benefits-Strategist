## VAULT Immutable Feature Registry

This folder contains the **immutable** VAULT Feature Registry (schema + registry data) governed by:

- **Schema ID**: `VAULT-SCHEMA-REGISTRY-001`
- **Schema Version**: `1.0.0`

### Files

- `registry/v1/schema.ts`: TypeScript schema (enums, entity models, helpers).
- `registry/v1/feature-registry.v1.0.0.json`: The **immutable exported registry** for this repository snapshot.
- `tools/feature-registry/validate.mjs`: Validates ID patterns + checksums + basic consistency.

### Immutability Rules (high-level)

- **IDs are never reused** once assigned.
- **IDs never change**; status changes happen through metadata + audit (append-only).
- **Deprecation** keeps original IDs and adds deprecation/lineage metadata.


