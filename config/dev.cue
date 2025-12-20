// ═══════════════════════════════════════════════════════════════════════════════
// VAULT DEVELOPMENT CONFIGURATION
// CUE Language Configuration File
// ═══════════════════════════════════════════════════════════════════════════════
//
// COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
// ALL RIGHTS RESERVED
//
// This file contains development environment configuration for VAULT.
// CUE (Configure, Unify, Execute) is a data validation and configuration language.
//
// USAGE:
//   cue eval dev.cue              - Evaluate and display configuration
//   cue export dev.cue --out json - Export to JSON
//   cue export dev.cue --out yaml - Export to YAML
//
// ═══════════════════════════════════════════════════════════════════════════════

// Package declaration - all config files share the same package
package config

// ─────────────────────────────────────────────────────────────────────────────
// ENVIRONMENT SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

// Environment identifier
// Values: "development" | "staging" | "production"
environment: "development"

// Server port for local development
// Default: 8080 (avoids conflict with common services on 80, 3000)
server_port: 8080

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

// Application metadata
app: {
    name:    "VAULT"
    version: "1.1.0"
    codename: "Ashley"
}

// Feature flags for development
features: {
    debug_mode:      true    // Enable console logging
    show_disclaimer: true    // Show liability disclaimer modal
    confetti:        true    // Enable celebration animations
    analytics:       false   // Disabled - no external tracking
}

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY SETTINGS (Development)
// ─────────────────────────────────────────────────────────────────────────────

// Note: Even in development, VAULT maintains zero-trust architecture
security: {
    https_only:     false   // HTTP allowed in development
    csp_enabled:    false   // CSP relaxed for development
    hsts_enabled:   false   // HSTS disabled for localhost
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHING SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

cache: {
    service_worker: true    // Enable service worker
    cache_name:     "vault-dev-v1.1"
    max_age:        0       // No caching in development (always fresh)
}

// ═══════════════════════════════════════════════════════════════════════════════
// END OF CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
