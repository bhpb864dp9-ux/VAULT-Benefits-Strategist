# Changelog

All notable changes to VAULT DEM Engine will be documented in this file.

## [1.0.0] - 2026-01-03

### Production Release

This is the first production-ready release of VAULT.

### Added
- **OAuth Authentication**: Apple, Google, and ID.me sign-in support with PKCE
- **5-Tier Pricing**: 1776 Heritage pricing structure ($0 - $7,776/mo)
- **Heroes & Hardship Program**: Free access for valor award recipients, homeless veterans, 100% P&T, TDIU, Gold Star families
- **Body Map**: Interactive 30+ point anatomical selector with 15 body systems
- **DEM Calculator**: Combined rating calculation with bilateral factor (38 CFR 4.25/4.26)
- **TDIU/SMC Checker**: Full eligibility analysis for all SMC types (K-T)
- **OCR Document Intake**: Tesseract.js-powered medical record scanning
- **PDF Generation**: Claim package export with nexus statements
- **Blue Button Import**: CCDA XML health record parsing
- **PWA Support**: Offline-capable progressive web app
- **Liquid Glass UI**: Modern glassmorphic design system

### Changed
- Updated base path for GitHub Pages deployment
- Enhanced service worker configuration for production caching

### Deferred
- **Login.gov OAuth**: Requires backend private_key_jwt service infrastructure
  - Frontend configuration complete
  - Will be enabled post-MVP when backend is available
  - Sandbox/development testing ready

### Security
- AES-GCM token encryption via Web Crypto API
- PKCE implementation for all OAuth providers
- Zero-knowledge architecture (data stays on device)

---

## [0.9.0] - 2026-01-02

### Pre-Release

- Initial OAuth provider configurations
- Core workflow phases implemented
- Calculator engine development

---

*VAULT LLC, a Northstar|Insight Inc. Company*
*© 2026 All Rights Reserved*
