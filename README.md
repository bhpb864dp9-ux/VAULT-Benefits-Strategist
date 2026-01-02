# 🛡️ VAULT | Veterans Automated Universal Lookup Tool

[![Version](https://img.shields.io/badge/version-v0.8.0--beta-gold)](https://github.com/bhpb864dp9-ux/VAULT-Benefits-Strategist/releases)
[![Status](https://img.shields.io/badge/status-Beta-yellow)](https://github.com/bhpb864dp9-ux/VAULT-Benefits-Strategist)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20(PWA)-blue)](https://github.com/bhpb864dp9-ux/VAULT-Benefits-Strategist)
[![Build](https://img.shields.io/badge/build-2026--01--02-blue)](https://github.com/bhpb864dp9-ux/VAULT-Benefits-Strategist/actions)

**VAULT LLC** — A Northstar|- Insight Inc. Company

*Privacy-First Architecture • Security by Absence™ • Zero Data Transmission*

> **"You Served. You Sacrificed. You Deserve Better."**

---

## 🎯 What is VAULT?

VAULT is a **privacy-first Progressive Web Application** that helps military veterans prepare VA disability compensation claims. Unlike every other solution, VAULT implements **Security by Absence™** — 100% of data processing occurs on YOUR device. Nothing is ever transmitted to external servers.

### Why VAULT is Superior

| Feature | VAULT | VA.gov | Third-Party Services |
|---------|-------|--------|---------------------|
| **Data Privacy** | ✅ 100% Client-Side | ❌ Server-Based | ❌ Third-Party Servers |
| **Offline Capable** | ✅ Full Functionality | ❌ Requires Internet | ❌ Requires Internet |
| **Cost** | ✅ Free | ✅ Free | ❌ $100-$5000+ |
| **Data Ownership** | ✅ Veteran Owns 100% | ⚠️ Government Stored | ❌ Third-Party Stored |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/bhpb864dp9-ux/VAULT-Benefits-Strategist.git
cd VAULT-Benefits-Strategist

# Install dependencies and run
cd src/web/Project/react-vite
npm install
npm run dev
```

**Open:** http://localhost:3000

---

## 📊 Current Status: v0.8.0-beta

| Metric | Value |
|--------|-------|
| **Features Adopted** | 8 |
| **Features Active** | 4 |
| **Features Planned** | 97 |
| **Adoption Rate** | 19.5% |

### Adopted Features (Production-Ready)

- ✅ Blue Button Upload → Identity Autofill
- ✅ Battle Buddy Mode
- ✅ Evidence OCR Intake (On-Device)
- ✅ Interactive Body Map UI
- ✅ Narrative Mind Reader (Keyword Detection)
- ✅ Buddy Statement Generator
- ✅ PWA Offline Caching & Installability
- ✅ Skip Link (Keyboard Navigation)

### In Development

- 🔄 Identity Capture Complete
- 🔄 Pattern Predictor (Related Conditions)
- 🔄 Service Timeline Builder + Export
- 🔄 Representation (POA) Capture

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      VETERAN'S DEVICE                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     VAULT Web App                          │  │
│  │                                                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │  │
│  │  │ MIND READER │  │   LAWYER    │  │   STRATEGIST    │    │  │
│  │  │ NLP Engine  │  │   Engine    │  │   Calculator    │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘    │  │
│  │                          │                                 │  │
│  │           ┌──────────────┴──────────────┐                  │  │
│  │           │      localStorage           │                  │  │
│  │           │   (Never leaves device)     │                  │  │
│  │           └─────────────────────────────┘                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ═══════════════ SECURITY BY ABSENCE™ BOUNDARY ═════════════   │
│                  (NO DATA CROSSES THIS LINE)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Three Core Engines

| Engine | Purpose | Status |
|--------|---------|--------|
| **Mind Reader** | NLP symptom-to-condition mapping | ✅ Adopted |
| **Lawyer** | Presumptive condition detection | 📋 Planned |
| **Strategist** | VA combined rating calculator | 📋 Planned |

---

## 📁 Project Structure

```
VAULT-Benefits-Strategist/
├── src/
│   └── web/
│       └── Project/
│           └── react-vite/     # Main React application
├── registry/                    # Feature registry (version-locked)
├── docs/                        # Documentation
├── config/                      # Environment configurations
└── schemas/                     # Data schemas
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | Technical architecture details |
| [Security](docs/SECURITY.md) | Zero-trust security model |
| [Execution Plan](docs/VAULT-Master-Execution-Plan-v6.1.md) | Strategic roadmap |
| [Feature Registry](registry/VAULT-FEATURE-REGISTRY-IMMUTABLE-002.json) | Canonical feature list |
| [Cursor Directive](docs/CURSOR-DIRECTIVE-VAULT-RECONCILIATION.md) | AI development guide |

---

## 🛣️ Roadmap

| Version | Target | Focus |
|---------|--------|-------|
| **v0.8.0-beta** | January 2026 | Current - 8 features adopted |
| v1.0.0 MVP | February 2026 | Core workflow complete |
| v1.5.0 | March 2026 | Evidence Intelligence |
| v2.0.0 | April 2026 | Lawyer Engine (Presumptive) |
| v2.5.0 | May 2026 | Strategist Engine (Calculator) |
| v3.0.0 | June 2026 | Commercial Launch |
| v4.0.0 | Q4 2026 | The Doctor AR Companion |

---

## 🔐 Security & Privacy

**Security by Absence™** — The most secure data is data that never leaves your device.

- ✅ **Zero server backend** — Static files only
- ✅ **Zero external API calls** — All processing local
- ✅ **Zero data transmission** — PII never leaves device
- ✅ **Full offline capability** — Works without internet
- ✅ **Veteran owns 100%** — Complete data sovereignty

---

## ⚠️ Disclaimer

**VAULT IS AN EDUCATIONAL TOOL ONLY**

- This software does NOT provide legal advice
- This software does NOT guarantee any VA rating or benefit
- This software does NOT replace consultation with accredited VA representatives
- Results are estimates only and may differ from official VA determinations

Veterans are strongly encouraged to consult with accredited Veterans Service Organizations (VSOs).

---

## 🔒 Legal

### Intellectual Property

| Protection | Status |
|------------|--------|
| **Copyright** | © 2026 VAULT LLC |
| **Patents** | Applications Filed (PAT-001 through PAT-004) |
| **Trademarks** | VAULT™, Mind Reader™, Security by Absence™ |

### Patent Portfolio

| ID | Innovation |
|----|------------|
| PAT-001 | DEM Evidence Optimizer Algorithm |
| PAT-002 | Zero-Transmission Architecture Proof |
| PAT-003 | Bilateral Factor Exact Calculator |
| PAT-004 | AR Conversational Entity (The Doctor) |

---

## 👥 Contact

**VAULT LLC** — A Northstar|- Insight Inc. Company

- **General:** info@vault-benefits.com
- **Technical:** tech@vault-benefits.com
- **Licensing:** legal@vault-benefits.com

---

## 📜 Version History

| Version | Date | Description |
|---------|------|-------------|
| **v0.8.0-beta** | 2026-01-02 | Current beta - 8 features adopted |
| v0.7.0 | 2025-12-20 | Body System Navigation, VBIO Program |
| v0.5.0 | 2025-12 | RFC-001 specification, Three Core Engines |
| v0.1.0 | 2024 | Initial prototype |

---

**Built with ❤️ for America's Veterans**

*Because those who served deserve the best technology to claim what they've earned.*

---

© 2026 VAULT LLC, A Northstar|- Insight Inc. Company. All Rights Reserved.

**Security by Absence™** — Your data never leaves your device.
