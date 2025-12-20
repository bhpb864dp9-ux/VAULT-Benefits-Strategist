// ═══════════════════════════════════════════════════════════════════════════════
// VAULT PRODUCTION CONFIGURATION
// CUE Language Configuration File
// ═══════════════════════════════════════════════════════════════════════════════
//
// COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
// ALL RIGHTS RESERVED
//
// This file contains production environment configuration for VAULT.
// CUE (Configure, Unify, Execute) is a data validation and configuration language.
//
// USAGE:
//   cue eval prod.cue              - Evaluate and display configuration
//   cue export prod.cue --out json - Export to JSON
//   cue export prod.cue --out yaml - Export to YAML
//
// SECURITY NOTE:
// This file should NOT contain secrets. Use environment variables for sensitive
// values in production.
//
// ═══════════════════════════════════════════════════════════════════════════════

// Package declaration - all config files share the same package
package config

// ─────────────────────────────────────────────────────────────────────────────
// ENVIRONMENT SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

// Environment identifier
// Values: "development" | "staging" | "production"
environment: "production"

// Server port for production (standard HTTP)
// Note: HTTPS termination should be handled by reverse proxy
server_port: 80

// Enable optimizations for production
optimization: true

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

// Application metadata
app: {
    name:    "VAULT"
    version: "1.1.0"
    codename: "Ashley"
}

// Feature flags for production
features: {
    debug_mode:      false   // Disable console logging
    show_disclaimer: true    // ALWAYS show liability disclaimer
    confetti:        true    // Enable celebration animations
    analytics:       false   // Disabled - no external tracking (privacy-first)
}

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY SETTINGS (Production)
// ─────────────────────────────────────────────────────────────────────────────

// VAULT's zero-trust architecture means these are primarily for HTTP headers
security: {
    https_only:     true    // Require HTTPS
    csp_enabled:    true    // Enable Content Security Policy
    hsts_enabled:   true    // Enable HTTP Strict Transport Security
    hsts_max_age:   31536000 // 1 year in seconds
    
    // Content Security Policy directives
    // Note: VAULT loads third-party resources from CDNs for performance
    csp: {
        default_src:  "'self'"
        script_src:   "'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com"
        style_src:    "'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com"
        font_src:     "'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com"
        img_src:      "'self' data:"
        connect_src:  "'self'"
        frame_ancestors: "'none'"
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHING SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

cache: {
    service_worker: true        // Enable service worker
    cache_name:     "vault-v1.1"
    max_age:        604800      // 1 week in seconds for static assets
    
    // Assets to cache
    assets: [
        "./",
        "./index.html",
        "./manifest.json",
        "./service-worker.js"
    ]
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

performance: {
    gzip_enabled:     true      // Enable gzip compression
    minify_html:      false     // HTML already compact
    lazy_load_images: true      // Lazy load images (if any added)
}

// ═══════════════════════════════════════════════════════════════════════════════
// END OF CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
