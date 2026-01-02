// ═══════════════════════════════════════════════════════════════════════════════
// VAULT STAGING CONFIGURATION
// CUE Language Configuration File
// ═══════════════════════════════════════════════════════════════════════════════
//
// Staging should mirror production as closely as possible (except secrets).
// Do NOT place secrets in this file.
//
// ═══════════════════════════════════════════════════════════════════════════════

package config

environment: "staging"

// Staging port typically matches production container port; ingress handles mapping.
server_port: 80

app: {
    name:     "VAULT"
    version:  "1.1.0"
    codename: "Ashley"
}

features: {
    debug_mode:      false
    show_disclaimer: true
    confetti:        true
    analytics:       false
}

security: {
    https_only:   true
    csp_enabled:  true
    hsts_enabled: true
    hsts_max_age: 31536000
}

cache: {
    service_worker: true
    cache_name:     "vault-staging-v1.1"
    max_age:        604800
}


