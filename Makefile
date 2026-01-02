# ═══════════════════════════════════════════════════════════════════════════════
# VAULT MAKEFILE
# Veterans Automated Universal Lookup Tool
# ═══════════════════════════════════════════════════════════════════════════════
#
# COPYRIGHT © 2025 DONTRELL-TATE INTELLIGENCE LLC
# ALL RIGHTS RESERVED
#
# This Makefile provides convenient commands for building, running, and
# deploying the VAULT application.
#
# USAGE:
#   make help     - Show available commands
#   make build    - Build Docker container
#   make run      - Run Docker container
#   make serve    - Serve locally with Python
#   make clean    - Clean up build artifacts
#
# ═══════════════════════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────────────────
# VARIABLES
# ─────────────────────────────────────────────────────────────────────────────

# Docker image name and tag
IMAGE_NAME := vault-v1
IMAGE_TAG := latest

# Port configuration
HOST_PORT := 3000
CONTAINER_PORT := 80

# Web app directory (React/Vite)
WEB_DIR := src/web/Project/react-vite

# ─────────────────────────────────────────────────────────────────────────────
# DEFAULT TARGET
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: help
help: ## Show this help message
	@echo "═══════════════════════════════════════════════════════════════════"
	@echo " VAULT Build Commands"
	@echo "═══════════════════════════════════════════════════════════════════"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "═══════════════════════════════════════════════════════════════════"

# ─────────────────────────────────────────────────────────────────────────────
# BUILD TARGETS
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: build
build: ## Build Docker container for production
	@echo "🔨 Building VAULT Docker image..."
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "✅ Build complete: $(IMAGE_NAME):$(IMAGE_TAG)"

.PHONY: build-no-cache
build-no-cache: ## Build Docker container without cache
	@echo "🔨 Building VAULT Docker image (no cache)..."
	docker build --no-cache -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "✅ Build complete: $(IMAGE_NAME):$(IMAGE_TAG)"

# ─────────────────────────────────────────────────────────────────────────────
# RUN TARGETS
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: run
run: ## Run Docker container (http://localhost:8080)
	@echo "🚀 Starting VAULT container..."
	@echo "   Access at: http://localhost:8080"
	docker run -p 8080:$(CONTAINER_PORT) $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: run-detached
run-detached: ## Run Docker container in background
	@echo "🚀 Starting VAULT container (detached)..."
	docker run -d --name vault -p 8080:$(CONTAINER_PORT) $(IMAGE_NAME):$(IMAGE_TAG)
	@echo "✅ Container started. Access at: http://localhost:8080"
	@echo "   Stop with: make stop"

.PHONY: stop
stop: ## Stop running Docker container
	@echo "🛑 Stopping VAULT container..."
	docker stop vault || true
	docker rm vault || true
	@echo "✅ Container stopped"

# ─────────────────────────────────────────────────────────────────────────────
# LOCAL DEVELOPMENT (React/Vite)
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: serve
serve: ## Run React/Vite dev server (http://localhost:3000)
	@echo "🌐 Starting React/Vite dev server..."
	@echo "   Access at: http://localhost:$(HOST_PORT)"
	@echo "   Press Ctrl+C to stop"
	cd $(WEB_DIR) && npm run dev

.PHONY: serve-node
serve-node: ## Alias for `make serve`
	@$(MAKE) serve

# ─────────────────────────────────────────────────────────────────────────────
# UTILITY TARGETS
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: clean
clean: ## Clean up Docker images and containers
	@echo "🧹 Cleaning up..."
	docker stop vault 2>/dev/null || true
	docker rm vault 2>/dev/null || true
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@echo "✅ Cleanup complete"

.PHONY: logs
logs: ## View Docker container logs
	docker logs -f vault

.PHONY: shell
shell: ## Open shell in running container
	docker exec -it vault /bin/sh

# ─────────────────────────────────────────────────────────────────────────────
# REPO DOCTOR / REGISTRY
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: doctor
doctor: ## Repo doctor (report-only): MOSA paths + symlink + registry checks
	node tools/repo-doctor/doctor.mjs

.PHONY: doctor-fix
doctor-fix: ## Repo doctor (safe auto-fix)
	node tools/repo-doctor/doctor.mjs --fix

.PHONY: registry-validate
registry-validate: ## Validate immutable registry (checksums + referential integrity)
	node tools/feature-registry/validate.mjs

.PHONY: registry-reconcile
registry-reconcile: ## Enforce version-lock reconcile against immutable registry
	node tools/feature-registry/vault_reconcile.mjs

.PHONY: registry-status
registry-status: ## Print registry meta + ACTIVE/ADOPTED sets
	node tools/feature-registry/vault_status.mjs

.PHONY: registry-scan
registry-scan: ## Scan codebase for @vault-feature annotations
	node tools/feature-registry/scan-code.mjs

.PHONY: registry-plan-md
registry-plan-md: ## Regenerate docs/FEATURE_PLAN_BY_THEME.md from immutable registry
	node tools/feature-registry/print_plan_by_theme.mjs > docs/FEATURE_PLAN_BY_THEME.md

# ─────────────────────────────────────────────────────────────────────────────
# INFO TARGETS
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: info
info: ## Display project information
	@echo "═══════════════════════════════════════════════════════════════════"
	@echo " VAULT | Veterans Automated Universal Lookup Tool"
	@echo "═══════════════════════════════════════════════════════════════════"
	@echo ""
	@echo " Version:      1.1.0 UNIFIED (Ashley)"
	@echo " Architecture: Zero-Trust Client-Side"
	@echo " Type:         Web Application (React/Vite)"
	@echo ""
	@echo " Copyright © 2025 Dontrell-Tate Intelligence LLC"
	@echo " All Rights Reserved"
	@echo ""
	@echo "═══════════════════════════════════════════════════════════════════"

.PHONY: version
version: ## Display version information
	@echo "VAULT v1.1.0 UNIFIED (Ashley)"

# ═══════════════════════════════════════════════════════════════════════════════
# END OF MAKEFILE
# ═══════════════════════════════════════════════════════════════════════════════
