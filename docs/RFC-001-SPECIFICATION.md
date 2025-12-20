# RFC-001: Deterministic Veterans Benefits Claims Preparation System

## Complete Specification Package v2.0
### Codename: VAULT (Veterans Automated Universal Lookup Tool)

**Version:** 2.0.0  
**Status:** Published  
**Effective Date:** 2025-01-15  
**Author:** Dontrell-Tate Intelligence LLC  
**Copyright:** © 2025 Dontrell-Tate Intelligence LLC - All Rights Reserved

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Core Domain Schemas](#2-core-domain-schemas)
3. [Rule Engine Schemas](#3-rule-engine-schemas)
4. [Telemetry Schemas](#4-telemetry-schemas)
5. [Complete Ruleset](#5-complete-ruleset)
6. [Reference Data](#6-reference-data)
7. [KPI Definitions](#7-kpi-definitions)
8. [API Endpoints](#8-api-endpoints)
9. [Alignment Summary](#9-alignment-summary)

---

## 1. Design Principles

### 1.1 IRON DOME ARCHITECTURE
Security through architectural absence:
- **Zero External PII Transmission:** All sensitive data remains client-side
- **Client-Side Processing Primacy:** Core logic executes in browser
- **Deterministic, Reproducible Operations:** Same inputs always produce same outputs

### 1.2 TACTICAL OPERATION FRAMEWORK
Military-familiar workflows:
- **Phase-Based Progression:** 7 mission phases (Vector → Execution)
- **Mission-Planning Metaphors:** Military terminology for bureaucratic processes
- **Clear Objective-to-Action Mapping:** Every step has a defined purpose

### 1.3 THREE CORE ENGINES

| Engine | Purpose | Output |
|--------|---------|--------|
| **MIND READER** | NLP-lite keyword matrix for symptom analysis | Body system signals, condition suggestions |
| **LAWYER** | Presumptive logic engine for service connection | Presumptive matches, nexus waiver determinations |
| **STRATEGIST** | Combined rating calculator and evidence optimizer | Rating estimates, strategic recommendations |

### 1.4 FULL AUDITABILITY
Every decision traceable to versioned rules:
- Hash chains for tamper evidence
- Rule execution traces
- State reconstruction capability

---

## 2. Core Domain Schemas

### 2.1 ClaimCase Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/claim-case.json"
$schema: "https://json-schema.org/draft/2020-12/schema"
title: ClaimCase
description: "Primary mission container - represents a veteran's claim preparation operation"
type: object
required:
  - case_id
  - user_id
  - state
  - mission_phase
  - ruleset_version
  - profile_snapshot_id
  - created_at
properties:
  case_id:
    type: string
    format: uuid
    description: "Unique operation identifier"
  user_id:
    type: string
    format: uuid
    description: "Veteran operator identifier"
  state:
    type: string
    enum: [drafting, ready_for_review, submitted, archived, abandoned]
    description: "Current operational status"
  mission_phase:
    type: string
    enum:
      - VECTOR_CALIBRATION
      - CONTEXTUAL_ANCHORING
      - ARSENAL_ACQUISITION
      - TACTICAL_MAPPING
      - EVIDENCE_FORTIFICATION
      - STRATEGIC_REVIEW
      - MISSION_EXECUTION
    description: "Current phase in the 7-phase intake workflow"
  objective:
    type: string
    enum:
      - new_claim
      - increase_rating
      - secondary_condition
      - appeal_supplemental
      - appeal_hlr
      - appeal_bva
    description: "Primary mission objective"
  ruleset_version:
    type: string
    description: "Locked ruleset version for this case - immutable after creation"
  profile_snapshot_id:
    type: string
    format: uuid
    description: "Reference to immutable veteran profile snapshot"
  conditions:
    type: array
    items:
      $ref: "#/schemas/condition"
  forms:
    type: array
    items:
      $ref: "#/schemas/form-instance"
  evidence_items:
    type: array
    items:
      $ref: "#/schemas/evidence-item"
  gate_acknowledgements:
    type: array
    items:
      $ref: "#/schemas/gate-acknowledgement"
  submission_package_id:
    type: ["string", "null"]
    format: uuid
  combined_rating_estimate:
    $ref: "#/schemas/combined-rating-estimate"
  presumptive_matches:
    type: array
    items:
      $ref: "#/schemas/presumptive-match"
  created_at:
    type: string
    format: date-time
  updated_at:
    type: string
    format: date-time
  phase_timestamps:
    type: object
    additionalProperties:
      type: string
      format: date-time
```

### 2.2 State Machine Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/state-machine.json"
title: ClaimCaseStateMachine
description: "Formal state transition definitions for ClaimCase lifecycle"
properties:
  states:
    drafting:
      description: "Active claim preparation in progress"
      allowed_transitions: [ready_for_review, abandoned]
      exit_gates: [GATE_ALL_CONDITIONS_HAVE_EVIDENCE, GATE_ALL_FORMS_VALID]
    ready_for_review:
      description: "Pending veteran or VSO review before submission"
      allowed_transitions: [drafting, submitted, abandoned]
      entry_gates: [GATE_ALL_CONDITIONS_HAVE_EVIDENCE, GATE_ALL_FORMS_VALID]
      exit_gates: [GATE_ALL_WARNINGS_ACKNOWLEDGED, GATE_NO_BLOCKERS]
    submitted:
      description: "Claim package finalized - ready for VA submission"
      allowed_transitions: [archived]
      entry_gates: [GATE_ALL_WARNINGS_ACKNOWLEDGED, GATE_NO_BLOCKERS, GATE_SUBMISSION_PACKAGE_GENERATED]
    archived:
      description: "Case completed or intentionally closed - read-only"
      allowed_transitions: []
    abandoned:
      description: "Case abandoned by veteran - preserved for audit"
      allowed_transitions: []
  mission_phases:
    VECTOR_CALIBRATION:
      phase_number: 1
      description: "Establish mission objective and veteran identity"
      required_inputs: [objective, profile_snapshot_id]
      next_phase: CONTEXTUAL_ANCHORING
    CONTEXTUAL_ANCHORING:
      phase_number: 2
      description: "Capture service history, deployments, exposures"
      required_inputs: [service_history, exposures]
      next_phase: ARSENAL_ACQUISITION
    ARSENAL_ACQUISITION:
      phase_number: 3
      description: "Identify conditions via Mind Reader NLP analysis"
      required_inputs: [narrative_input, body_system_selections]
      engines_invoked: [MIND_READER]
      next_phase: TACTICAL_MAPPING
    TACTICAL_MAPPING:
      phase_number: 4
      description: "Map conditions to body systems and diagnostic codes"
      required_inputs: [conditions, body_map_pins]
      engines_invoked: [LAWYER]
      next_phase: EVIDENCE_FORTIFICATION
    EVIDENCE_FORTIFICATION:
      phase_number: 5
      description: "Upload and validate supporting evidence"
      required_inputs: [evidence_items]
      next_phase: STRATEGIC_REVIEW
    STRATEGIC_REVIEW:
      phase_number: 6
      description: "Calculate combined rating and optimize claim strategy"
      required_inputs: [all_conditions_evidenced]
      engines_invoked: [STRATEGIST]
      next_phase: MISSION_EXECUTION
    MISSION_EXECUTION:
      phase_number: 7
      description: "Generate submission package and finalize claim"
      required_inputs: [all_gates_clear, all_forms_complete]
      next_phase: null
```

### 2.3 Condition Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/condition.json"
title: Condition
description: "A medical condition being claimed for VA disability benefits"
type: object
required:
  - condition_id
  - case_id
  - description
  - body_system
  - claim_type
  - evidence_requirements
properties:
  condition_id:
    type: string
    format: uuid
  case_id:
    type: string
    format: uuid
  description:
    type: string
    description: "Veteran-provided condition description"
  standardized_name:
    type: ["string", "null"]
    description: "Mapped to VA standard condition terminology"
  body_system:
    type: string
    enum:
      - musculoskeletal
      - organs_of_special_sense
      - impairment_of_auditory_acuity
      - infectious_diseases
      - immune_disorders
      - nutritional_deficiencies
      - respiratory
      - cardiovascular
      - digestive
      - genitourinary
      - gynecological_conditions
      - hematologic_lymphatic
      - skin
      - endocrine
      - neurological
      - mental_disorders
      - dental_oral
    description: "VA body system classification (15+ systems per 38 CFR Part 4)"
  diagnostic_code:
    type: ["string", "null"]
    pattern: "^[0-9]{4}$"
    description: "VA diagnostic code from 38 CFR Part 4"
  claim_type:
    type: string
    enum: [direct, secondary, presumptive, aggravation]
  primary_condition_id:
    type: ["string", "null"]
    format: uuid
    description: "For secondary conditions - references the service-connected primary condition"
  primary_condition_name:
    type: ["string", "null"]
    description: "Human-readable name of primary condition for secondary claims"
  presumptive_basis:
    type: ["object", "null"]
    description: "Lawyer engine presumptive determination"
    properties:
      presumptive_category:
        type: string
        enum:
          - agent_orange
          - gulf_war
          - radiation
          - camp_lejeune
          - pact_act_burn_pit
          - pact_act_toxic_exposure
          - pow
          - chronic_disease
          - tropical_disease
      qualifying_service:
        type: string
      legal_citation:
        type: string
      confidence_score:
        type: number
        minimum: 0
        maximum: 100
  diagnosis_status:
    type: string
    enum: [unknown, none, provisional, confirmed]
    default: unknown
  nexus_status:
    type: string
    enum: [unknown, not_required, missing, insufficient, sufficient]
    default: unknown
  severity_status:
    type: string
    enum: [unknown, missing, insufficient, sufficient]
    default: unknown
  body_map_pins:
    type: array
    items:
      $ref: "#/schemas/symptom-pin"
  evidence_requirements:
    type: array
    items:
      $ref: "#/schemas/evidence-requirement"
  linked_evidence_ids:
    type: array
    items:
      type: string
      format: uuid
  estimated_rating:
    type: ["object", "null"]
    properties:
      min_rating:
        type: integer
        minimum: 0
        maximum: 100
      max_rating:
        type: integer
        minimum: 0
        maximum: 100
      likely_rating:
        type: integer
        minimum: 0
        maximum: 100
  mind_reader_analysis:
    type: ["object", "null"]
    properties:
      matched_keywords:
        type: array
        items:
          type: string
      confidence_score:
        type: number
        minimum: 0
        maximum: 100
      suggested_conditions:
        type: array
        items:
          type: string
      body_system_signals:
        type: array
        items:
          type: object
          properties:
            body_system:
              type: string
            signal_strength:
              type: number
            triggering_keywords:
              type: array
              items:
                type: string
  created_at:
    type: string
    format: date-time
  updated_at:
    type: string
    format: date-time
```

### 2.4 Evidence Item Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/evidence-item.json"
title: EvidenceItem
description: "Supporting evidence document for claims - Iron Dome: stored client-side only"
type: object
required:
  - evidence_id
  - case_id
  - file_hash
  - evidence_type
  - validation_status
  - storage_location
properties:
  evidence_id:
    type: string
    format: uuid
  case_id:
    type: string
    format: uuid
  file_hash:
    type: string
    description: "SHA-256 hash for integrity verification"
  file_name:
    type: string
  file_type:
    type: string
    enum: [pdf, jpg, jpeg, png, tiff, doc, docx, txt]
  file_size_bytes:
    type: integer
  storage_location:
    type: string
    description: "Client-side storage reference (localStorage key, IndexedDB ref)"
  evidence_type:
    type: string
    enum: [diagnosis, nexus, severity, service, buddy_statement, personal_statement, other]
  evidence_subtype:
    type: ["string", "null"]
    enum:
      - medical_record
      - c_and_p_exam
      - private_medical_opinion
      - dbq
      - service_treatment_record
      - dd214
      - personnel_record
      - lay_statement
      - photo_evidence
      - prescription_record
  document_date:
    type: ["string", "null"]
    format: date
  provider_name:
    type: ["string", "null"]
  provider_credentials:
    type: ["string", "null"]
    description: "MD, DO, PA, NP, PhD, etc."
  validation_status:
    type: string
    enum: [pending, valid, insufficient, stale, rejected]
  completeness_score:
    type: ["number", "null"]
    minimum: 0
    maximum: 100
  sufficiency_score:
    type: ["number", "null"]
    minimum: 0
    maximum: 100
  staleness_evaluation:
    type: ["object", "null"]
    properties:
      evidence_date:
        type: string
        format: date
      evaluated_at:
        type: string
        format: date-time
      days_old:
        type: integer
      staleness_threshold_days:
        type: integer
        description: "Threshold based on evidence type"
      is_stale:
        type: boolean
      staleness_reason:
        type: ["string", "null"]
  parsed_metadata:
    type: object
    properties:
      extracted_dates:
        type: array
        items:
          type: string
          format: date
      extracted_diagnoses:
        type: array
        items:
          type: string
      contains_nexus_statement:
        type: boolean
      nexus_language_strength:
        type: ["string", "null"]
        enum: [definitive, likely, possible, speculative]
      ocr_confidence:
        type: ["number", "null"]
        minimum: 0
        maximum: 100
  linked_condition_ids:
    type: array
    items:
      type: string
      format: uuid
  processing_state:
    type: string
    enum: [queued, processing, completed, failed]
    default: queued
  failure_reason:
    type: ["string", "null"]
  veteran_notes:
    type: ["string", "null"]
  created_at:
    type: string
    format: date-time
  updated_at:
    type: string
    format: date-time
```

### 2.5 Symptom Pin Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/symptom-pin.json"
title: SymptomPin
description: "Body map location pin for symptom tracking"
type: object
required: [pin_id, body_region, intent_level]
properties:
  pin_id:
    type: string
    format: uuid
  body_region:
    type: string
  body_region_detail:
    type: ["string", "null"]
    description: "Specific sub-region (e.g., 'left_shoulder', 'lumbar_spine')"
  laterality:
    type: ["string", "null"]
    enum: [left, right, bilateral]
  symptom_description:
    type: ["string", "null"]
  onset_date:
    type: ["string", "null"]
    format: date
  onset_context:
    type: ["string", "null"]
    description: "How/when symptom began (e.g., 'during deployment')"
  severity:
    type: ["string", "null"]
    enum: [mild, moderate, severe, debilitating]
  frequency:
    type: ["string", "null"]
    enum: [constant, daily, weekly, monthly, intermittent]
  functional_impact:
    type: ["string", "null"]
  intent_level:
    type: integer
    minimum: 1
    maximum: 3
    description: "1=considering, 2=planning to claim, 3=definitely claiming"
```

### 2.6 Form Instance Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/form-instance.json"
title: FormInstance
description: "VA form in preparation with field provenance tracking"
type: object
required:
  - form_instance_id
  - case_id
  - form_type
  - form_version
  - status
  - fields
properties:
  form_instance_id:
    type: string
    format: uuid
  case_id:
    type: string
    format: uuid
  form_type:
    type: string
    enum:
      - "21-526EZ"
      - "21-526EZ_BDD"
      - "21-0781"
      - "21-0781a"
      - "21-4138"
      - "21-4142"
      - "21-4142a"
      - "21-8940"
      - "21-0966"
      - "20-0995"
      - "20-0996"
      - "10182"
  form_title:
    type: string
  form_version:
    type: string
  status:
    type: string
    enum: [draft, ready, locked, error]
  completeness_percentage:
    type: number
    minimum: 0
    maximum: 100
  fields:
    type: object
    additionalProperties:
      type: object
      required: [value, provenance]
      properties:
        value:
          description: "Field value - type varies by field"
        provenance:
          type: string
          enum:
            - user_input
            - profile_snapshot
            - mind_reader
            - lawyer
            - strategist
            - evidence_parsed
            - rule_engine
            - default
        source_object_id:
          type: ["string", "null"]
        rule_id:
          type: ["string", "null"]
        rule_version:
          type: ["string", "null"]
        confidence_score:
          type: ["number", "null"]
          minimum: 0
          maximum: 100
        user_modified:
          type: boolean
          default: false
        modified_at:
          type: ["string", "null"]
          format: date-time
  validation_errors:
    type: array
    items:
      type: object
      properties:
        field_key:
          type: string
        error_code:
          type: string
        error_message:
          type: string
        severity:
          type: string
          enum: [error, warning]
  pdf_location:
    type: ["string", "null"]
  xml_location:
    type: ["string", "null"]
  created_at:
    type: string
    format: date-time
  updated_at:
    type: string
    format: date-time
```

### 2.7 Audit Event Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/audit-event.json"
title: AuditEvent
description: "Immutable audit log entry with hash chain for tamper evidence"
type: object
required:
  - event_id
  - sequence_number
  - timestamp
  - actor_id
  - actor_role
  - action_type
  - action_category
  - payload
  - hash
properties:
  event_id:
    type: string
    format: uuid
  sequence_number:
    type: integer
    minimum: 1
  timestamp:
    type: string
    format: date-time
  actor_id:
    type: string
  actor_role:
    type: string
    enum: [user, vso, caregiver, attorney, system, auditor, rule_engine]
  action_type:
    type: string
    examples:
      - CASE_CREATED
      - CASE_STATE_CHANGED
      - CONDITION_ADDED
      - CONDITION_UPDATED
      - EVIDENCE_UPLOADED
      - EVIDENCE_LINKED
      - FORM_FIELD_CHANGED
      - GATE_EVALUATED
      - GATE_ACKNOWLEDGED
      - RULE_FIRED
      - SUBMISSION_PACKAGE_GENERATED
  action_category:
    type: string
    enum: [create, read, update, delete, system, gate, submission]
  target_object_type:
    type: ["string", "null"]
    enum: [ClaimCase, Condition, EvidenceItem, FormInstance, GateAcknowledgement]
  target_object_id:
    type: ["string", "null"]
    format: uuid
  payload:
    type: object
    description: "Action-specific data - NO PII in payload per Iron Dome"
  previous_state_hash:
    type: ["string", "null"]
  new_state_hash:
    type: ["string", "null"]
  hash:
    type: string
    description: "SHA-256 hash of this event"
  previous_hash:
    type: ["string", "null"]
    description: "Hash of previous audit event - creates chain"
  session_id:
    type: ["string", "null"]
    format: uuid
```

### 2.8 User Profile Snapshot Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/user-profile-snapshot.json"
title: UserProfileSnapshot
description: "Immutable point-in-time capture of veteran profile"
type: object
required:
  - profile_snapshot_id
  - user_id
  - version
  - snapshot_timestamp
  - snapshot_hash
properties:
  profile_snapshot_id:
    type: string
    format: uuid
  user_id:
    type: string
    format: uuid
  version:
    type: integer
    minimum: 1
  snapshot_timestamp:
    type: string
    format: date-time
  snapshot_hash:
    type: string
    description: "SHA-256 hash of canonical snapshot content"
  veteran_info:
    type: object
    properties:
      first_name:
        type: string
      middle_name:
        type: ["string", "null"]
      last_name:
        type: string
      date_of_birth:
        type: string
        format: date
      ssn_last_four:
        type: string
        pattern: "^[0-9]{4}$"
      va_file_number:
        type: ["string", "null"]
      contact:
        type: object
        properties:
          email:
            type: string
            format: email
          phone:
            type: string
          address:
            $ref: "#/schemas/address"
  service_history:
    type: array
    items:
      type: object
      required: [branch, start_date, end_date, discharge_type]
      properties:
        service_period_id:
          type: string
          format: uuid
        branch:
          type: string
          enum: [army, navy, air_force, marine_corps, coast_guard, space_force, national_guard, reserves]
        component:
          type: string
          enum: [active_duty, reserve, national_guard]
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        discharge_type:
          type: string
          enum: [honorable, general, other_than_honorable, bad_conduct, dishonorable, uncharacterized]
        mos_codes:
          type: array
          items:
            type: string
        deployments:
          type: array
          items:
            type: object
            properties:
              deployment_id:
                type: string
                format: uuid
              theater:
                type: string
              operation_name:
                type: ["string", "null"]
              country:
                type: string
              start_date:
                type: string
                format: date
              end_date:
                type: string
                format: date
              combat_zone:
                type: boolean
                default: false
  exposures:
    type: array
    items:
      type: object
      required: [exposure_type, exposure_source]
      properties:
        exposure_id:
          type: string
          format: uuid
        exposure_type:
          type: string
          enum:
            - agent_orange
            - burn_pit
            - radiation
            - contaminated_water
            - gulf_war_environmental
            - asbestos
            - chemical_biological
            - traumatic_event
            - mst
            - noise
            - other
        exposure_source:
          type: string
        location:
          type: ["string", "null"]
        start_date:
          type: ["string", "null"]
          format: date
        end_date:
          type: ["string", "null"]
          format: date
        presumptive_eligible:
          type: boolean
        pact_act_eligible:
          type: boolean
  existing_ratings:
    type: array
    items:
      type: object
      properties:
        rating_id:
          type: string
          format: uuid
        condition_name:
          type: string
        diagnostic_code:
          type: string
        body_system:
          type: string
        rating_percentage:
          type: integer
          minimum: 0
          maximum: 100
        effective_date:
          type: string
          format: date
        static_or_dynamic:
          type: string
          enum: [static, dynamic]
        bilateral:
          type: boolean
          default: false
  combined_rating:
    type: ["integer", "null"]
    minimum: 0
    maximum: 100
  diagnoses:
    type: array
    items:
      type: object
      properties:
        diagnosis_id:
          type: string
          format: uuid
        icd_10_code:
          type: ["string", "null"]
        description:
          type: string
        diagnosed_date:
          type: ["string", "null"]
          format: date
  medications:
    type: array
    items:
      type: object
      properties:
        medication_name:
          type: string
        dosage:
          type: ["string", "null"]
        prescribing_provider:
          type: ["string", "null"]
  providers:
    type: array
    items:
      type: object
      properties:
        provider_id:
          type: string
          format: uuid
        provider_name:
          type: string
        provider_type:
          type: string
          enum: [va_facility, private_physician, specialist, mental_health]
        facility_name:
          type: ["string", "null"]
```

---

## 3. Rule Engine Schemas

### 3.1 Rule Definition Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/rule-definition.json"
title: RuleDefinition
description: "Deterministic rule definition for the claims preparation engine"
type: object
required:
  - rule_id
  - version
  - scope
  - priority
  - effect
  - conditions
  - outputs
  - enabled
properties:
  rule_id:
    type: string
    pattern: "^[A-Z][A-Z0-9_]+$"
    description: "Stable identifier (e.g., 'EV_REQ_DIAG_NEW_CLAIM')"
  version:
    type: string
    pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"
  description:
    type: string
  scope:
    type: string
    enum:
      - evidence_requirement
      - gate_evaluation
      - form_autofill
      - review_trigger
      - presumptive_match
      - rating_estimate
  priority:
    type: integer
    minimum: 1
    maximum: 1000
    description: "Lower number = higher priority"
  effect:
    type: string
    enum:
      - BLOCK
      - WARN
      - ALLOW
      - SET_REQUIREMENT
      - WAIVE_REQUIREMENT
      - AUTOFILL_FIELD
      - TRIGGER_REVIEW
      - SET_PRESUMPTIVE
      - CALCULATE_RATING
  applies_to_object:
    type: string
    enum: [ClaimCase, Condition, EvidenceItem, FormInstance]
  applies_to_filter:
    type: ["object", "null"]
    description: "Pre-filter before evaluating conditions"
  conditions:
    type: array
    description: "AND of condition groups; each group is OR of predicates"
    minItems: 1
    items:
      type: object
      required: [anyOf]
      properties:
        anyOf:
          type: array
          minItems: 1
          items:
            type: object
            required: [path, operator]
            properties:
              path:
                type: string
                description: "JSONPath expression into RuleInput"
              operator:
                type: string
                enum:
                  - EQ
                  - NE
                  - GT
                  - GTE
                  - LT
                  - LTE
                  - IN
                  - NOT_IN
                  - EXISTS
                  - NOT_EXISTS
                  - CONTAINS
                  - NOT_CONTAINS
                  - MATCHES
                  - ALL
                  - ANY
                  - NONE
                  - DATE_BEFORE
                  - DATE_AFTER
                  - DATE_WITHIN_DAYS
              value:
                description: "Comparison value"
  outputs:
    type: array
    minItems: 1
    items:
      type: object
      required: [type]
      properties:
        type:
          type: string
          enum:
            - set_requirement
            - waive_requirement
            - set_gate
            - set_form_field
            - set_review_trigger
            - set_presumptive_match
        requirement_type:
          type: string
          enum: [diagnosis, nexus, service_connection, severity, in_service_event, continuity, other]
        required_level:
          type: string
          enum: [optional, recommended, required]
        gate_level:
          type: string
          enum: [BLOCK, WARN, ALLOW]
        gate_code:
          type: string
        gate_message_template:
          type: string
        target_path:
          type: string
        remediation_action:
          type: string
          enum: [upload_evidence, edit_field, acknowledge_warning, contact_support, add_buddy_statement]
        remediation_guidance:
          type: string
  enabled:
    type: boolean
    default: true
  effective_from:
    type: ["string", "null"]
    format: date-time
  effective_to:
    type: ["string", "null"]
    format: date-time
  supersedes_rule_id:
    type: ["string", "null"]
  tags:
    type: array
    items:
      type: string
  legal_citation:
    type: ["string", "null"]
```

### 3.2 Rule Execution Trace Schema

```yaml
$id: "https://vault.dontrell-tate.com/schemas/rule-trace.json"
title: RuleExecutionTrace
description: "Detailed trace of individual rule evaluation for audit/debug"
type: object
required:
  - trace_id
  - evaluation_id
  - rule_id
  - rule_version
  - executed_at
  - input_snapshot_hash
  - result
  - condition_evaluations
properties:
  trace_id:
    type: string
    format: uuid
  evaluation_id:
    type: string
    format: uuid
    description: "Parent RuleOutput evaluation_id"
  rule_id:
    type: string
  rule_version:
    type: string
  executed_at:
    type: string
    format: date-time
  execution_order:
    type: integer
  input_snapshot_hash:
    type: string
  result:
    type: string
    enum: [FIRED, NOT_FIRED, SKIPPED, ERROR]
  skip_reason:
    type: ["string", "null"]
    enum: [filter_mismatch, not_effective, disabled, superseded]
  error_message:
    type: ["string", "null"]
  condition_evaluations:
    type: array
    items:
      type: object
      properties:
        group_index:
          type: integer
        group_result:
          type: boolean
        predicate_results:
          type: array
          items:
            type: object
            properties:
              path:
                type: string
              operator:
                type: string
              expected_value: {}
              actual_value: {}
              result:
                type: boolean
  outputs_produced:
    type: array
    items:
      type: object
  execution_duration_us:
    type: integer
```

---

## 4. Telemetry Schemas

### 4.1 Telemetry Event Schema

```yaml
$id: "https://vault.dontrell-tate.com/telemetry/telemetry-event.json"
title: TelemetryEvent
description: "Analytics event for KPI tracking - NO PII per Iron Dome"
type: object
required:
  - event_id
  - timestamp
  - event_type
  - event_category
  - actor_role
  - properties
properties:
  event_id:
    type: string
    format: uuid
  timestamp:
    type: string
    format: date-time
  event_type:
    type: string
    examples:
      - CASE_CREATED
      - PHASE_ENTERED
      - PHASE_COMPLETED
      - CONDITION_ADDED
      - EVIDENCE_UPLOADED
      - GATE_BLOCKED
      - GATE_ACKNOWLEDGED
      - FORM_AUTOFILLED
      - SUBMISSION_COMPLETED
      - CASE_ABANDONED
      - ENGINE_INVOKED
  event_category:
    type: string
    enum: [lifecycle, navigation, data_entry, evidence, gate, engine, submission, error]
  actor_id_hash:
    type: string
    description: "Hashed user ID for analytics without PII"
  actor_role:
    type: string
    enum: [user, vso, caregiver, attorney, system]
  session_id:
    type: string
    format: uuid
  case_id_hash:
    type: ["string", "null"]
    description: "Hashed case ID for funnel analysis"
  objective:
    type: ["string", "null"]
    enum: [new_claim, increase_rating, secondary_condition, appeal_supplemental, appeal_hlr, appeal_bva]
  mission_phase:
    type: ["string", "null"]
    enum:
      - VECTOR_CALIBRATION
      - CONTEXTUAL_ANCHORING
      - ARSENAL_ACQUISITION
      - TACTICAL_MAPPING
      - EVIDENCE_FORTIFICATION
      - STRATEGIC_REVIEW
      - MISSION_EXECUTION
  properties:
    type: object
    description: "Event-specific properties"
  device_context:
    type: ["object", "null"]
    properties:
      device_type:
        type: string
        enum: [web, mobile_web, ios, android, desktop]
      browser_family:
        type: ["string", "null"]
      os_family:
        type: ["string", "null"]
      screen_width:
        type: ["integer", "null"]
      screen_height:
        type: ["integer", "null"]
  timing:
    type: ["object", "null"]
    properties:
      time_on_phase_seconds:
        type: ["integer", "null"]
      time_since_case_created_seconds:
        type: ["integer", "null"]
      time_since_session_start_seconds:
        type: ["integer", "null"]
  source_channel:
    type: ["string", "null"]
    enum: [organic, referral, vso_assisted, attorney_assisted]
```

---

## 5. Complete Ruleset

### Ruleset Version: 2025-01-15

| Category | Count | Purpose |
|----------|-------|---------|
| Evidence Requirements | 6 | Define what evidence is needed per claim/condition type |
| Gate Evaluations | 8 | Block or warn on submission readiness issues |
| Form Autofill | 4 | Populate forms from profile and case data |
| Review Triggers | 2 | Flag complex or sensitive claims |
| Presumptive Matching | 4 | Identify presumptive service connection |
| **Total** | **24** | - |

### 5.1 Evidence Requirement Rules

| Rule ID | Description | Priority | Legal Citation |
|---------|-------------|----------|----------------|
| `EV_REQ_DIAG_NEW_CLAIM` | New claims require diagnosis evidence | 10 | 38 CFR § 3.303 |
| `EV_REQ_NEXUS_DIRECT` | Direct service connection requires nexus | 10 | 38 CFR § 3.303(a) |
| `EV_WAIVE_NEXUS_PRESUMPTIVE` | Presumptive conditions waive nexus | 5 | 38 CFR § 3.307, 3.309 |
| `EV_REQ_SEVERITY_INCREASE` | Increased rating requires current severity | 10 | 38 CFR § 3.327 |
| `EV_REQ_SECONDARY_NEXUS` | Secondary conditions require nexus to primary | 10 | 38 CFR § 3.310 |
| `EV_REQ_IN_SERVICE_EVENT` | Direct claims benefit from in-service event evidence | 10 | 38 CFR § 3.303(a) |

### 5.2 Gate Evaluation Rules

| Rule ID | Effect | Description |
|---------|--------|-------------|
| `GATE_MISSING_DIAG_NEW_CLAIM` | BLOCK | Block when new claim lacks diagnosis |
| `GATE_MISSING_NEXUS_DIRECT` | BLOCK | Block when direct claim lacks nexus |
| `GATE_MISSING_PRIMARY_SECONDARY` | BLOCK | Block when secondary lacks linked primary |
| `GATE_MISSING_SEVERITY_INCREASE` | BLOCK | Block when increase lacks severity evidence |
| `GATE_STALE_EVIDENCE_WARNING` | WARN | Warn on evidence older than threshold |
| `GATE_INSUFFICIENT_NEXUS_WARNING` | WARN | Warn on weak nexus language |
| `GATE_BUDDY_STATEMENT_RECOMMENDED` | WARN | Recommend buddy statement |
| `GATE_FORM_INCOMPLETE` | BLOCK | Block when required forms incomplete |

### 5.3 Presumptive Matching Rules

| Rule ID | Category | Conditions Covered |
|---------|----------|-------------------|
| `PRESUMPTIVE_AGENT_ORANGE` | Agent Orange | Diabetes Type 2, Ischemic Heart Disease, Parkinson's, Prostate Cancer, Respiratory Cancers, Multiple Myeloma, Hodgkin's Disease, Non-Hodgkin's Lymphoma, Soft Tissue Sarcoma, Chloracne, Peripheral Neuropathy, Bladder Cancer, Hypothyroidism, Hypertension |
| `PRESUMPTIVE_PACT_ACT_BURN_PIT` | PACT Act Burn Pit | Asthma, Rhinitis, Sinusitis, Pulmonary Fibrosis, Sarcoidosis, Chronic Bronchitis, COPD, Constrictive Bronchiolitis, Lung Cancer, Head/Neck/Respiratory/GI/Reproductive Cancers, Lymphoma, Kidney Cancer, Brain Cancer, Melanoma, Pancreatic Cancer, Glioblastoma |
| `PRESUMPTIVE_GULF_WAR` | Gulf War | Chronic Fatigue Syndrome, Fibromyalgia, IBS, Functional GI Disorder, Undiagnosed Illness |
| `PRESUMPTIVE_CAMP_LEJEUNE` | Camp Lejeune | Kidney Cancer, Liver Cancer, Non-Hodgkin's Lymphoma, Adult Leukemia, Multiple Myeloma, Bladder Cancer, Parkinson's Disease, Aplastic Anemia, Hepatic Steatosis |

---

## 6. Reference Data

### 6.1 VA Body Systems (15+ per 38 CFR Part 4)

| System ID | System Name | CFR Section | DC Range |
|-----------|-------------|-------------|----------|
| `musculoskeletal` | Musculoskeletal System | 4.40-4.73 | 5000-5329 |
| `organs_of_special_sense` | Organs of Special Sense (Eyes) | 4.75-4.84a | 6000-6099 |
| `impairment_of_auditory_acuity` | Impairment of Auditory Acuity | 4.85-4.87 | 6100-6299 |
| `respiratory` | Respiratory System | 4.96-4.97 | 6500-6899 |
| `cardiovascular` | Cardiovascular System | 4.100-4.104 | 7000-7199 |
| `digestive` | Digestive System | 4.110-4.114 | 7200-7399 |
| `genitourinary` | Genitourinary System | 4.115-4.115b | 7500-7599 |
| `skin` | Skin | 4.118 | 7800-7899 |
| `endocrine` | Endocrine System | 4.119 | 7900-7999 |
| `neurological` | Neurological Conditions | 4.120-4.124a | 8000-8999 |
| `mental_disorders` | Mental Disorders | 4.125-4.130 | 9200-9499 |
| `dental_oral` | Dental and Oral Conditions | 4.150 | 9900-9999 |

### 6.2 Mind Reader Keyword Matrix

```yaml
scoring:
  high_confidence_weight: 3
  medium_confidence_weight: 1
  exclusion_penalty: -5
  threshold_for_highlight: 2

musculoskeletal:
  high_confidence:
    - joint, bone, muscle, back pain, knee, shoulder, hip, spine
    - arthritis, disc, range of motion, stiffness, inflammation
    - swelling, limited mobility, fracture
  medium_confidence:
    - pain, ache, sore, weak, cramp, sprain, strain
  exclusion_patterns:
    - chest pain, headache, stomach pain

mental_disorders:
  high_confidence:
    - ptsd, depression, anxiety, panic, nightmare, flashback
    - trauma, hypervigilance, avoidance, mood, suicidal
    - intrusive thoughts, mental health, psychiatr
  medium_confidence:
    - stress, sleep, angry, irritable, concentrate, memory

respiratory:
  high_confidence:
    - breathing, lung, asthma, copd, sleep apnea, cpap
    - shortness of breath, wheeze, cough, sinus, bronch
  medium_confidence:
    - congestion, snore, tired, fatigue

impairment_of_auditory_acuity:
  high_confidence:
    - hearing, tinnitus, ringing, deaf, ear, audiolog
  medium_confidence:
    - loud noise, explosion, gunfire

cardiovascular:
  high_confidence:
    - heart, blood pressure, hypertension, cardiac
    - chest pain, palpitation, coronary, cholesterol
  medium_confidence:
    - dizzy, faint, short of breath

neurological:
  high_confidence:
    - nerve, neuropathy, numbness, tingling, migraine
    - headache, seizure, tremor, radiculopathy, tbi, concussion
  medium_confidence:
    - burning sensation, weakness, balance
```

### 6.3 Staleness Thresholds

| Evidence Type | Threshold (Days) | Notes |
|---------------|-----------------|-------|
| C&P Exam | 365 | May be considered stale after 1 year |
| DBQ | 365 | Disability Benefits Questionnaire |
| Private Medical Opinion | 730 | Nexus letters |
| Medical Record | 1095 | For ongoing conditions |
| Service Treatment Record | ∞ | Never goes stale |
| DD-214 | ∞ | Never goes stale |
| Buddy Statement | 730 | Lay statements |
| Personal Statement | 365 | Veteran's statement |
| Prescription Record | 180 | Current medication evidence |

### 6.4 Combined Rating Formula

```
METHODOLOGY: "Whole Person" Theory
Each rating reduces remaining efficiency

FORMULA:
Combined = 100 - ((100-R1) × (100-R2) × ... × (100-Rn) / 100^(n-1))

STEPS:
1. Order ratings from highest to lowest
2. Start with 100% efficiency
3. Apply highest rating to remaining efficiency
4. Continue with next highest rating
5. Round to nearest 10%
6. Apply bilateral factor if applicable

BILATERAL FACTOR:
10% increase when conditions affect both arms or both legs
```

### 6.5 VA Forms Reference

| Form | Title | Objectives |
|------|-------|------------|
| 21-526EZ | Application for Disability Compensation | new_claim, increase_rating |
| 21-0781 | Statement in Support of Claim for PTSD | PTSD claims |
| 21-0781a | Statement for PTSD Secondary to Personal Assault | MST claims |
| 21-4138 | Statement in Support of Claim | General purpose |
| 21-4142 | Authorization to Disclose Information | Medical release |
| 21-8940 | Application for TDIU | Unemployability |
| 21-0966 | Intent to File | Preserve effective date |
| 20-0995 | Supplemental Claim | appeal_supplemental |
| 20-0996 | Higher-Level Review | appeal_hlr |
| 10182 | Board Appeal (NOD) | appeal_bva |

---

## 7. KPI Definitions

### 7.1 Core KPIs

| KPI ID | Name | Formula | Target |
|--------|------|---------|--------|
| `completion_rate` | Claim Completion Rate | SUBMITTED / CREATED × 100 | ≥ 60% |
| `time_to_submission` | Time to Submission | AVG(submit_ts - create_ts) | ≤ 72 hours |
| `phase_completion_rate` | Phase Completion Rate | PHASE_COMPLETED / PHASE_ENTERED × 100 | ≥ 80% |
| `gate_block_rate` | Gate Block Rate | BLOCKED / SUBMIT_ATTEMPTS × 100 | ≤ 20% |
| `evidence_sufficiency` | Evidence Sufficiency | CONDITIONS_EVIDENCED / CONDITIONS × 100 | ≥ 85% |
| `abandonment_rate` | Abandonment Rate | ABANDONED / CREATED × 100 | ≤ 25% |
| `autofill_adoption` | Autofill Adoption | KEPT_AUTOFILL / AUTOFILLED × 100 | ≥ 90% |
| `presumptive_match_rate` | Presumptive Match Rate | MATCHES / CONDITIONS × 100 | Maximize |
| `engine_performance` | Engine Response Time | AVG(execution_ms) | ≤ 500ms |
| `avg_conditions` | Avg Conditions per Claim | AVG(conditions_count) | Track trend |

### 7.2 Dashboards

| Dashboard | KPIs |
|-----------|------|
| Executive Overview | completion_rate, time_to_submission, abandonment_rate |
| Funnel Analysis | phase_completion_rate, gate_block_rate |
| Evidence Quality | evidence_sufficiency, presumptive_match_rate |
| System Health | engine_performance, autofill_adoption |

---

## 8. API Endpoints

**Base URL:** `https://api.vault.dontrell-tate.com/v2`

### 8.1 Cases

| Method | Path | Operation |
|--------|------|-----------|
| POST | /cases | createCase |
| GET | /cases | listCases |
| GET | /cases/{case_id} | getCase |
| POST | /cases/{case_id}/state | transitionCaseState |
| POST | /cases/{case_id}/phase | transitionCasePhase |

### 8.2 Conditions

| Method | Path | Operation |
|--------|------|-----------|
| GET | /cases/{case_id}/conditions | listConditions |
| POST | /cases/{case_id}/conditions | addCondition |
| GET | /cases/{case_id}/conditions/{condition_id} | getCondition |
| PATCH | /cases/{case_id}/conditions/{condition_id} | updateCondition |
| DELETE | /cases/{case_id}/conditions/{condition_id} | removeCondition |

### 8.3 Evidence

| Method | Path | Operation |
|--------|------|-----------|
| GET | /cases/{case_id}/evidence | listEvidence |
| POST | /cases/{case_id}/evidence | uploadEvidence |
| GET | /cases/{case_id}/evidence/{evidence_id} | getEvidence |
| DELETE | /cases/{case_id}/evidence/{evidence_id} | removeEvidence |
| POST | /cases/{case_id}/evidence/{evidence_id}/link | linkEvidence |
| POST | /cases/{case_id}/evidence/{evidence_id}/unlink | unlinkEvidence |

### 8.4 Forms

| Method | Path | Operation |
|--------|------|-----------|
| GET | /cases/{case_id}/forms | listForms |
| GET | /cases/{case_id}/forms/{form_instance_id} | getForm |
| PATCH | /cases/{case_id}/forms/{form_instance_id} | updateFormFields |
| POST | /cases/{case_id}/forms/autofill | autofillForms |
| POST | /cases/{case_id}/forms/{form_instance_id}/generate | generateFormPdf |

### 8.5 Gates

| Method | Path | Operation |
|--------|------|-----------|
| GET | /cases/{case_id}/gates | evaluateGates |
| POST | /cases/{case_id}/gates/acknowledge | acknowledgeWarnings |

### 8.6 Engines

| Method | Path | Operation |
|--------|------|-----------|
| POST | /cases/{case_id}/engines/mind-reader | invokeMindReader |
| POST | /cases/{case_id}/engines/lawyer | invokeLawyer |
| POST | /cases/{case_id}/engines/strategist | invokeStrategist |

### 8.7 Audit

| Method | Path | Operation |
|--------|------|-----------|
| GET | /audit/events | queryAuditEvents |
| GET | /audit/events/{event_id}/trace | getEventTrace |
| GET | /audit/cases/{case_id}/reconstruct | reconstructCaseState |

---

## 9. Alignment Summary

### VAULT Principles Alignment

| Principle | Implementation | ✓ |
|-----------|----------------|---|
| **Iron Dome Architecture** | All schemas enforce client-side storage | ✓ |
| **Military Tactical Framework** | 7-phase mission workflow | ✓ |
| **Three Core Engines** | Mind Reader, Lawyer, Strategist integration | ✓ |
| **Full Auditability** | Hash chains, traces, reconstruction | ✓ |
| **Deterministic Operations** | Versioned rulesets, reproducible evaluation | ✓ |

### Schema Summary

| Category | Count |
|----------|-------|
| Domain Schemas | 13 |
| Rule Engine Schemas | 6 |
| API Schemas | 2 |
| Telemetry Schemas | 1 |
| **Total** | **22** |

### Ruleset Summary

| Category | Count |
|----------|-------|
| Evidence Requirements | 6 |
| Gate Evaluations | 8 |
| Form Autofill | 4 |
| Review Triggers | 2 |
| Presumptive Matching | 4 |
| **Total** | **24** |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-01-01 | DTI | Initial specification |
| 2.0.0 | 2025-01-15 | DTI | Complete schema refinement, 24-rule ruleset, API specification |

---

**END OF RFC-001 SPECIFICATION**

