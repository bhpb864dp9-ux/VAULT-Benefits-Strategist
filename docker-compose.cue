// ═══════════════════════════════════════════════════════════════════════════════
// VAULT DOCKER COMPOSE CONFIGURATION
// CUE Language Configuration File
// ═══════════════════════════════════════════════════════════════════════════════
//
// COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
// ALL RIGHTS RESERVED
//
// This file defines Docker Compose configuration for VAULT deployment.
// CUE format allows for type-safe, validated configuration.
//
// USAGE:
//   cue export docker-compose.cue --out yaml > docker-compose.yml
//   docker compose up -d
//
// ═══════════════════════════════════════════════════════════════════════════════

// Docker Compose version
version: "3.8"

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────────────────────

services: {
    // VAULT Web Application Service
    // Serves the static PWA via nginx
    vault: {
        // Build from local Dockerfile
        build: {
            context: "."
            dockerfile: "Dockerfile"
        }
        
        // Container name for easy reference
        container_name: "vault-app"
        
        // Image name/tag for pre-built images
        image: "vault-v1:latest"
        
        // Port mapping: host:container
        ports: [
            "8080:80"   // Access at http://localhost:8080
        ]
        
        // Restart policy
        restart: "unless-stopped"
        
        // Resource limits (optional, adjust as needed)
        deploy: {
            resources: {
                limits: {
                    cpus:   "0.5"      // Max 50% of one CPU
                    memory: "128M"     // Max 128MB RAM (nginx is lightweight)
                }
                reservations: {
                    cpus:   "0.1"      // Guarantee 10% CPU
                    memory: "32M"      // Guarantee 32MB RAM
                }
            }
        }
        
        // Health check
        healthcheck: {
            test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
            interval: "30s"
            timeout:  "3s"
            retries:  3
            start_period: "5s"
        }
        
        // Labels for container management
        labels: {
            "app.name":        "VAULT"
            "app.version":     "1.1.0"
            "app.description": "Veterans Automated Universal Lookup Tool"
            "app.maintainer":  "Dontrell-Tate Intelligence LLC"
        }
        
        // Logging configuration
        logging: {
            driver: "json-file"
            options: {
                "max-size": "10m"
                "max-file": "3"
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// NETWORKS (Optional)
// ─────────────────────────────────────────────────────────────────────────────

networks: {
    vault_network: {
        driver: "bridge"
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPLOYMENT NOTES
// ═══════════════════════════════════════════════════════════════════════════════
//
// DEVELOPMENT:
//   docker compose up --build
//
// PRODUCTION:
//   1. Build image: docker compose build
//   2. Push to registry: docker push your-registry/vault-v1:latest
//   3. Deploy: docker compose up -d
//
// HTTPS:
//   For production, add a reverse proxy (Traefik, nginx, Caddy) for HTTPS.
//   VAULT serves static files only - no backend processing needed.
//
// ═══════════════════════════════════════════════════════════════════════════════
