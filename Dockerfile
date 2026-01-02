# ═══════════════════════════════════════════════════════════════════════════════
# VAULT PRODUCTION CONTAINER
# Veterans Automated Universal Lookup Tool
# ═══════════════════════════════════════════════════════════════════════════════
#
# COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
# ALL RIGHTS RESERVED
#
# This Dockerfile creates a minimal, production-ready container for serving
# the VAULT React/Vite web app (built to static assets, served by nginx).
#
# ARCHITECTURE NOTES:
# - VAULT is a client-side web app (React/Vite)
# - Build step produces static assets (dist/)
# - nginx serves the built assets; no server-side processing needed
#
# SECURITY NOTES:
# - Using nginx:alpine for minimal attack surface
# - No dynamic content processing (PHP, Node, Python, etc.)
# - Static files only - no database, no API endpoints
# - HTTPS termination should be handled by load balancer/reverse proxy
#
# ═══════════════════════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────────────────
# BASE IMAGE
# ─────────────────────────────────────────────────────────────────────────────
# Using nginx:alpine for:
# - Minimal image size (~5MB base)
# - Security (Alpine's minimal attack surface)
# - Performance (nginx is highly optimized for static content)
# - No unnecessary packages or services
#
FROM node:18-alpine AS build

WORKDIR /app

# Install deps (workspace-local)
COPY src/web/Project/react-vite/package.json src/web/Project/react-vite/package-lock.json ./
RUN npm ci

# Copy source and build
COPY src/web/Project/react-vite ./
RUN npm run build

FROM nginx:alpine

# ─────────────────────────────────────────────────────────────────────────────
# METADATA
# ─────────────────────────────────────────────────────────────────────────────
# OCI Image Format labels for container metadata
#
LABEL org.opencontainers.image.title="VAULT"
LABEL org.opencontainers.image.description="Veterans Automated Universal Lookup Tool - Privacy-first claims preparation"
LABEL org.opencontainers.image.version="1.1.0"
LABEL org.opencontainers.image.vendor="Dontrell-Tate Intelligence LLC"
LABEL org.opencontainers.image.licenses="Proprietary"
LABEL org.opencontainers.image.source="[repository-url]"

# ─────────────────────────────────────────────────────────────────────────────
# COPY BUILT ASSETS
# ─────────────────────────────────────────────────────────────────────────────
# Copy Vite build output to nginx's default public directory.
COPY --from=build /app/dist /usr/share/nginx/html

# ─────────────────────────────────────────────────────────────────────────────
# NGINX CONFIGURATION (Optional - using defaults)
# ─────────────────────────────────────────────────────────────────────────────
# Uncomment and customize if you need specific nginx configuration:
#
# COPY nginx.conf /etc/nginx/nginx.conf
#
# Recommended production settings to add:
# - gzip compression for faster loading
# - Cache headers for PWA assets
# - Security headers (CSP, HSTS, X-Frame-Options)
# - HTTP/2 support

# ─────────────────────────────────────────────────────────────────────────────
# EXPOSE PORT
# ─────────────────────────────────────────────────────────────────────────────
# Expose port 80 for HTTP traffic.
# In production, use a reverse proxy (nginx, Traefik, AWS ALB) for HTTPS.
#
EXPOSE 80

# ─────────────────────────────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────────────────────────────
# Optional health check for container orchestration (Docker Swarm, Kubernetes)
#
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# ─────────────────────────────────────────────────────────────────────────────
# START NGINX
# ─────────────────────────────────────────────────────────────────────────────
# Run nginx in foreground mode (required for container)
# 'daemon off' ensures nginx doesn't fork to background
#
CMD ["nginx", "-g", "daemon off;"]

# ═══════════════════════════════════════════════════════════════════════════════
# BUILD INSTRUCTIONS
# ═══════════════════════════════════════════════════════════════════════════════
#
# Build the container:
#   docker build -t vault-v1 .
#   or
#   make build
#
# Run the container:
#   docker run -p 80:80 vault-v1
#   docker run -p 8080:80 vault-v1  # Map to different host port
#
# Run with auto-restart:
#   docker run -d --restart unless-stopped -p 80:80 vault-v1
#
# Production deployment (with HTTPS reverse proxy):
#   docker run -d --name vault -p 127.0.0.1:8080:80 vault-v1
#   # Then configure nginx/traefik/caddy to proxy and add HTTPS
#
# ═══════════════════════════════════════════════════════════════════════════════
