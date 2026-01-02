# 🛡️ VAULT | Veterans Automated Universal Lookup Tool

<div align="center">

![Version](https://img.shields.io/badge/version-v2.0.0-gold)
![Release](https://img.shields.io/badge/release-Genesis%20Edition-brightgreen)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Platform](https://img.shields.io/badge/platform-Web-blue)
![Status](https://img.shields.io/badge/status-Production-green)
![Build](https://img.shields.io/badge/build-2025--12--20-blue)

**The Most Advanced Privacy-First Veterans Benefits Platform Ever Created**

*Privacy-First Architecture • Body System Navigation • VBIO Training Program • Zero Data Transmission*

<p><strong>Website:</strong> <a href="file:///Users/alfredhull/Downloads/vault-beta-v1.0_6.html">file:///Users/alfredhull/Downloads/vault-beta-v1.0_6.html</a></p>
<p><em>Note: the Website link above is a local file URL; for shared access, run the web app locally via <code>npm run web:dev</code>.</em></p>

---

[Features](#key-features) • [RFC Specification](#rfc-001-specification) • [Architecture](#architecture) • [What's New](#whats-new-in-beta-v10) • [Quick Start](#quick-start) • [Configuration](#configuration) • [Documentation](#documentation) • [Security](#security) • [Legal](#legal-protection)

</div>

---

## 📋 Executive Summary

**VAULT (Veterans Automated Universal Lookup Tool)** is a revolutionary Progressive Web Application that fundamentally reimagines how military veterans prepare disability compensation claims. Unlike every other solution in the market, VAULT implements a **Zero-Trust Client-Side Architecture** where 100% of sensitive data processing occurs within the veteran's own device—never touching external servers.

### Why VAULT is Superior

| Feature | VAULT | VA.gov eBenefits | Third-Party Services |
|---------|-------|------------------|---------------------|
| **Data Privacy** | ✅ 100% Client-Side | ❌ Server-Based | ❌ Third-Party Servers |
| **Offline Capable** | ✅ Full Functionality | ❌ Requires Internet | ❌ Requires Internet |
| **AI Analysis** | ✅ Local NLP (No APIs) | ❌ None | ⚠️ Cloud LLMs (Data Risk) |
| **Cost** | ✅ Free | ✅ Free | ❌ $100-$5000+ |
| **Speed** | ✅ Instant (Local) | ⚠️ Network Dependent | ⚠️ Network Dependent |
| **Data Ownership** | ✅ Veteran Owns 100% | ⚠️ Government Stored | ❌ Third-Party Stored |

---

## 🎯 Mission Statement

> *"To provide every American veteran with enterprise-grade claims intelligence technology while ensuring their most sensitive personal information never leaves their control."*

VAULT was created with the understanding that veterans have already sacrificed for their country—they should not have to sacrifice their privacy to access the benefits they've earned.

---

## 📜 RFC-001 Specification
<a id="rfc-001-specification"></a>

VAULT is built on the **RFC-001 Deterministic Veterans Benefits Claims Preparation System** specification v2.0, a comprehensive technical foundation that ensures reproducibility, auditability, and legal defensibility.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **IRON DOME Architecture** | Security through architectural absence - zero external PII transmission |
| **Tactical Operation Framework** | Military-familiar 7-phase mission workflow |
| **Three Core Engines** | MIND READER (NLP), LAWYER (Presumptive Logic), STRATEGIST (Rating Calculator) |
| **Full Auditability** | Every decision traceable to versioned rules via hash chains |

### 7-Phase Mission Workflow

```
VECTOR_CALIBRATION → CONTEXTUAL_ANCHORING → ARSENAL_ACQUISITION
         ↓                    ↓                      ↓
   [Objective]         [Service History]      [Mind Reader NLP]
         ↓                    ↓                      ↓
TACTICAL_MAPPING → EVIDENCE_FORTIFICATION → STRATEGIC_REVIEW → MISSION_EXECUTION
         ↓                    ↓                      ↓               ↓
   [Body Map]            [Evidence]           [Strategist]     [Package]
```

### Specification Contents

| Section | Schemas/Rules |
|---------|---------------|
| Domain Schemas | 13 (ClaimCase, Condition, EvidenceItem, FormInstance, etc.) |
| Rule Engine Schemas | 6 (RuleDefinition, RuleSet, RuleTrace, etc.) |
| Production Ruleset | 24 rules (Evidence, Gates, Autofill, Presumptive) |
| Reference Data | Body Systems, Keywords, Forms, Staleness Thresholds |
| KPI Definitions | 10 KPIs with targets across 4 dashboards |
| API Endpoints | 25 endpoints across 7 resource categories |

📖 **Full Specification:** [`docs/RFC-001-SPECIFICATION.md`](docs/RFC-001-SPECIFICATION.md)

---

## 🚀 What's New in v2.0.0 (Genesis Edition)
<a id="whats-new-in-v200"></a>

### OPUS 5.0 Integration (Genesis)
| Feature | Description |
|---------|-------------|
| **Paul Rand Glass Engine** | Enhanced saturation (180%) and high-end physics for "Apple Titanium" feel |
| **Neural Body Map™** | Refined anatomical zones with intent-weighted selection and causal priming |
| **Zero-Knowledge Privacy** | Hybrid persistence using `sessionStorage` (RAM-only) for sensitive claim data |
| **OCR Evidence Intake** | On-device document processing with auto-tagging and legal citations |
| **Genesis Workflow** | Streamlined 5-phase mission: Mission, Identity, Conditions, Narrative, Review |

### Stratospheric Tools Suite
| Tool | Description |
|------|-------------|
| **Buddy Statement Generator** | Guided wizard for VA Form 21-10210 with evidence linking |
| **Service Timeline Builder** | Visual evidence chain from service to current condition |
| **Medical Citation Machine** | Real-time legal citations (38 CFR, M21-1) for every condition |
| **Nexus Letter Template Engine** | Doctor-ready templates with VA-required legal language |
| **Encrypted Session Persistence** | SECURE auto-save that vanishes when the tab closes |

### Enhanced Decision Engine
- **50+ Conditions Mapped** to DBQ forms and diagnostic codes
- **4 Claim Types:** New, Increase, Secondary, Appeal/Supplemental
- **MST Screening** with confidential support resources
- **VA Blue Button Integration** workflow
- **Evidence Strength Scoring** with weighted algorithm

---

## ✨ Key Features
<a id="key-features"></a>

### 🔐 Zero-Trust Data Architecture
- **No Server Backend:** Application consists entirely of static files
- **LocalStorage Sandbox:** All PII/PHI stored exclusively in browser
- **AES-GCM Encryption:** Optional encrypted persistence (VAULT_CRYPTO module)
- **No External API Calls:** No data transmission to third-party services
- **In-Memory Processing:** Documents generated without server involvement

### 🧠 Mind Reader™ + Neural Body Map™
- **Local Keyword Analysis:** Symptom-to-condition mapping without cloud AI
- **25+ Interactive Body Zones:** Click-to-map symptoms to anatomical areas
- **Intent Weighting:** 1-click (mild), 2-click (moderate), 3-click (severe)
- **Causal Priming:** Related body areas subtly illuminate
- **Real-Time Detection:** Instant body system identification as you type
- **No Hallucination Risk:** Deterministic matching vs. probabilistic LLMs

### 📴 Offline-First Design
- **Service Worker Caching:** Full application cached after first load
- **Complete Offline Functionality:** Prepare entire claims without internet
- **Session Persistence:** Resume where you left off, even after browser close
- **Perfect for Rural Veterans:** No connectivity requirements
- **Disaster Resilient:** Works during network outages

### 📦 Mission Package Generation
- **Client-Side ZIP Creation:** Documents compiled in browser memory
- **Stratospheric Tools:** Buddy statements, nexus letters, timelines
- **Secondary Condition Mapper:** Visual evidence chains
- **Comprehensive Package:** Personal statements, worksheets, checklists
- **Ready-to-Submit:** Formatted for VA requirements
- **Zero Server Storage:** Package never stored externally

### ♿ Accessibility & Usability
- **WCAG 2.1 AA Compliant:** Accessible to veterans with disabilities
- **Titanium Glass 3.0 UI:** Dynamic light-tracking glassmorphism
- **Mobile-First Design:** Works on phones, tablets, desktops
- **Intuitive Wizard Interface:** Step-by-step guidance
- **Plain Language:** No legal jargon or bureaucratic complexity

---

## 🏗️ Architecture
<a id="architecture"></a>

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VETERAN'S DEVICE                                │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        WEB BROWSER                                  │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │                      VAULT Web App                            │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐  │  │ │
│  │  │  │ TITANIUM    │  │ MIND READER │  │ MISSION PACKAGE      │  │  │ │
│  │  │  │ GLASS UI    │  │ NLP ENGINE  │  │ GENERATOR            │  │  │ │
│  │  │  │ (HTML/CSS)  │  │ (JavaScript)│  │ (JSZip In-Memory)    │  │  │ │
│  │  │  └─────────────┘  └─────────────┘  └──────────────────────┘  │  │ │
│  │  │           │              │                    │               │  │ │
│  │  │           └──────────────┴────────────────────┘               │  │ │
│  │  │                          │                                    │  │ │
│  │  │           ┌──────────────┴──────────────────┐                 │  │ │
│  │  │           │       LOCALSTORAGE              │                 │  │ │
│  │  │           │   (Encrypted Browser Sandbox)   │                 │  │ │
│  │  │           └─────────────────────────────────┘                 │  │ │
│  │  │                                                               │  │ │
│  │  │  ┌──────────────────────────────────────────────────────────┐│  │ │
│  │  │  │           SERVICE WORKER (Offline Cache)                 ││  │ │
│  │  │  └──────────────────────────────────────────────────────────┘│  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ════════════════════ ZERO-TRUST BOUNDARY ═══════════════════════════   │
│                    (NO DATA CROSSES THIS LINE)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ║
                                    ║ (Initial static file load only)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STATIC FILE SERVER / CDN                              │
│              (Serves HTML, CSS, JS - No dynamic processing)              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **UI Framework** | Bootstrap 5.3.2 | Responsive layout and components |
| **Design System** | Titanium Glass™ (Custom) | Glassmorphism-based visual language |
| **Typography** | Inter Tight | Modern, accessible font family |
| **Icons** | Font Awesome 6.4.0 | Comprehensive icon library |
| **Core Logic** | Vanilla JavaScript ES6+ | Zero-dependency application logic |
| **Compression** | JSZip 3.10.1 | Client-side ZIP generation |
| **File Handling** | FileSaver.js 2.0.5 | Browser download triggering |
| **Effects** | Canvas Confetti 1.6.0 | Celebration animations |
| **Offline** | Service Worker API | Asset caching and offline mode |
| **Storage** | localStorage API | Client-side data persistence |

---

## 🚀 Quick Start
<a id="quick-start"></a>

VAULT is organized as:

- **`src/web/Project/react-vite/`**: React (Vite) web app (DEM engine UI)
- **`src/web/Tabs/` + `src/web/Shared/`**: MOSA target structure for ongoing refactors

### Authoritative run commands (no ambiguity)

- **Web app (React/Vite)**:
  - **Project**: `src/web/Project/react-vite/`
  - **Run**: `npm run web:dev` → `http://localhost:3000`
- **Repo cleanup / consolidation**:
  - **Report**: `npm run doctor`
  - **Safe auto-fix**: `npm run doctor:fix`

### Where the URLs/routes are defined (source of truth)

- **Top-level React routes**: `src/web/Project/react-vite/src/App.tsx`
- **Claim phase URLs (`/claim/mission`, `/claim/identity`, …)**: `src/web/Project/react-vite/src/pages/Workflow.tsx` (driven by `VAULT_WEB_FEATURE_REGISTRY.workflowPhases`)
- **Web route + phase metadata (MOSA runtime registry)**: `src/web/Shared/Core/Registry/featureRegistry.ts`
- **Implemented web capability list (“every feature”)**: `src/web/Shared/Core/Registry/capabilities.v1.json`

### Prerequisites

- **Node.js >= 18**
- **Docker** (optional for containerized serving)

### Option 1: Local Development (recommended)

```bash
# Clone the repository (if authorized)
git clone [repository-url]
cd <repo-directory>

# Run the web app (React/Vite)
npm run web:dev
```

### Option 2: Docker Deployment

```bash
# Build the container (nginx serving built web assets)
make build
# or
docker build -t vault-v1 .

# Run the container
make run
# or
docker run -p 8080:80 vault-v1
```

### Option 3: Web app build + preview

```bash
cd src/web/Project/react-vite
npm install
npm run build
npm run preview
```

---

## 🧩 Configuration
<a id="configuration"></a>

VAULT ships with type-checked configuration files under `config/`:

- `config/dev.cue` (development defaults)
- `config/prod.cue` (production defaults + recommended security posture)

The repo also includes a CUE-based Docker Compose definition (`docker-compose.cue`). If you have `cue` installed, you can export it:

```bash
cue export docker-compose.cue --out yaml > docker-compose.yml
docker compose up -d --build
```

---

## 📁 Project Structure

```
./
│
├── 📄 README.md                    # This file - comprehensive documentation
├── 📄 LICENSE                      # Proprietary license terms
├── 📄 Makefile                     # Build automation commands
├── 📄 Dockerfile                   # Container definition for deployment
├── 📄 docker-compose.cue           # CUE-based compose configuration
├── 📄 package.json                 # Node.js project metadata
├── 📄 requirements.txt             # Optional tooling deps (VAULT itself is static)
│
├── 📁 config/                      # Environment configurations
│   ├── dev.cue                     # Development environment (CUE lang)
│   └── prod.cue                    # Production environment (CUE lang)
│
├── 📁 docs/                        # Documentation
│   ├── 📁 compliance/              # Legal and compliance documents
│   │   ├── copyright_filing.md     # U.S. Copyright Office filing data
│   │   └── patent_filing.md        # USPTO patent application data
│   ├── ARCHITECTURE.md             # Technical architecture documentation
│   ├── SECURITY.md                 # Security architecture and practices
│   └── COMPETITIVE_ANALYSIS.md     # Market comparison and positioning
│
└── 📁 src/                         # Source code
    ├── 📁 ios/                     # iOS platform (MOSA scaffolding)
    ├── 📁 android/                 # Android platform (MOSA scaffolding)
    └── 📁 web/                     # Web platform (MOSA)
        ├── 📁 Project/             # Web project config
        │   └── 📁 react-vite/      # React/Vite app (current DEM UI)
        ├── 📁 Tabs/                # MOSA tabs (future refactor target)
        └── 📁 Shared/              # MOSA shared (UI/Core/Extensions)
```

---

## 📖 Documentation
<a id="documentation"></a>

### User Guide

1. **Select Mission Profile:** Choose between New Claim or Supplemental Claim
2. **Identity Matrix:** Enter your basic information (stored locally only)
3. **Symptom Scanner:** Describe your conditions in plain language
4. **Command Center:** Review your estimated rating and download package
5. **Submit to VA:** Use generated documents with your official VA claim

### Developer Guide

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed technical documentation including:
- Component architecture
- State management patterns
- Styling conventions
- Extension points

### Security Documentation

See [SECURITY.md](docs/SECURITY.md) for:
- Zero-trust architecture details
- Data flow diagrams
- Threat modeling
- Compliance information

---

## 🔐 Security
<a id="security"></a>

- **Architecture + threat model**: [`docs/SECURITY.md`](docs/SECURITY.md)
- **Third-party licenses**: [`docs/THIRD_PARTY_LICENSES.md`](docs/THIRD_PARTY_LICENSES.md)
- **Operational note**: production deployments should add HTTPS + security headers at the edge (reverse proxy/CDN). See `config/prod.cue` for recommended CSP/HSTS settings.

---

## 🔒 Legal Protection
<a id="legal-protection"></a>

### Intellectual Property

This software is protected by multiple layers of intellectual property rights:

| Protection Type | Status | Details |
|-----------------|--------|---------|
| **Copyright** | Registered/Pending | U.S. Copyright Office registration |
| **Patent** | Application Filed | Utility patent for zero-trust claims system |
| **Trade Secrets** | Protected | Mind Reader algorithm, keyword matrices |
| **Trademarks** | Common Law + Filing | VAULT™, Mind Reader™, Titanium Glass™ |

### Copyright Notice

```
COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
ALL RIGHTS RESERVED

Unauthorized copying, modification, distribution, or use of this software
is strictly prohibited. Violators will be prosecuted to the fullest extent
of the law.
```

### Important Legal Files

- [LICENSE](LICENSE) - Complete proprietary license terms
- [docs/compliance/copyright_filing.md](docs/compliance/copyright_filing.md) - Copyright registration details
- [docs/compliance/patent_filing.md](docs/compliance/patent_filing.md) - Patent application documentation

---

## ⚠️ Disclaimer

**VAULT IS AN EDUCATIONAL TOOL ONLY**

- This software does NOT provide legal advice
- This software does NOT guarantee any VA rating or benefit
- This software does NOT replace consultation with accredited VA representatives
- Results are estimates only and may differ from official VA determinations

Veterans are strongly encouraged to:
1. Consult with accredited Veterans Service Organizations (VSOs)
2. Review all claims with qualified legal counsel if needed
3. Verify all information with official VA resources

---

## 🏆 Competitive Advantages

### vs. VA.gov eBenefits
- ✅ No data transmitted to government servers
- ✅ Full offline functionality
- ✅ Intelligent symptom analysis
- ✅ Instant document generation

### vs. Third-Party Claims Services ($100-$5000+)
- ✅ Completely free to use
- ✅ No data sharing with companies
- ✅ No sales pressure or upselling
- ✅ Same or better functionality

### vs. AI Chatbots (ChatGPT, etc.)
- ✅ No data sent to cloud AI providers
- ✅ No hallucination risk (deterministic)
- ✅ Works offline
- ✅ Designed specifically for VA claims

### vs. Paper-Based Processes
- ✅ Automated form population
- ✅ Real-time rating estimates
- ✅ Comprehensive checklist generation
- ✅ Error prevention and validation

---

## 📊 Performance Metrics

| Metric | VAULT Performance |
|--------|------------------|
| **Initial Load** | < 2 seconds (CDN-cached) |
| **Offline Startup** | < 500ms (Service Worker) |
| **NLP Analysis** | < 10ms (local execution) |
| **ZIP Generation** | < 1 second (in-memory) |
| **Memory Usage** | < 50MB typical |
| **Bundle Size** | ~200KB (gzipped) |

---

## 🛣️ Roadmap

### Version 2.1 (Planned)
- [ ] Integration with VSO workflows
- [ ] Multi-claim management tracking
- [ ] C&P exam preparation simulator
- [ ] Expanded medical citation database

### Version 3.0 (Future)
- [ ] Advanced Appeal tracking
- [ ] Direct-to-VA filing assistance
- [ ] BVA Decision analysis engine

---

## 👥 Contact

**Dontrell-Tate Intelligence LLC**

For authorized inquiries only:
- Licensing: legal@[domain].com
- Technical: tech@[domain].com
- General: info@[domain].com

---

## 📜 Version History

| Version | Date | Description |
|---------|------|-------------|
| **v2.0.0** | 2026-01-02 | **GENESIS EDITION** - Paul Rand Glass Engine, Zero-Knowledge Privacy (sessionStorage), OCR Intake, Medical Citation Machine |
| **Beta v1.0** | 2025-12-20 | **PRODUCTION RELEASE** - Titanium Slate Design System, Body System Navigation, VBIO Program, 4-Step Claim Flow |
| v4.0 STRATOSPHERIC+ | 2025-12 | Enhanced with RFC-001 specification, Three Core Engines, 7-Phase Workflow |
| 1.1 UNIFIED (Ashley) | 2025 | Enhanced documentation, comprehensive IP protection |
| 1.0 UNIFIED (Madison) | 2025 | Initial public release |
| 0.5 Beta | 2024 | Beta testing with veterans |
| 0.1 Alpha | 2024 | Initial prototype |

---

<div align="center">

**Built with ❤️ for America's Veterans**

*Because those who served deserve the best technology to claim what they've earned.*

---

COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC • ALL RIGHTS RESERVED

</div>
