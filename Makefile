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
HOST_PORT := 8080
CONTAINER_PORT := 80

# Source directory
PUBLIC_DIR := src/main/public

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
	@echo "   Access at: http://localhost:$(HOST_PORT)"
	docker run -p $(HOST_PORT):$(CONTAINER_PORT) $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: run-detached
run-detached: ## Run Docker container in background
	@echo "🚀 Starting VAULT container (detached)..."
	docker run -d --name vault -p $(HOST_PORT):$(CONTAINER_PORT) $(IMAGE_NAME):$(IMAGE_TAG)
	@echo "✅ Container started. Access at: http://localhost:$(HOST_PORT)"
	@echo "   Stop with: make stop"

.PHONY: stop
stop: ## Stop running Docker container
	@echo "🛑 Stopping VAULT container..."
	docker stop vault || true
	docker rm vault || true
	@echo "✅ Container stopped"

# ─────────────────────────────────────────────────────────────────────────────
# LOCAL DEVELOPMENT
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: serve
serve: ## Serve locally with Python (http://localhost:8080)
	@echo "🌐 Starting local server..."
	@echo "   Access at: http://localhost:$(HOST_PORT)"
	@echo "   Press Ctrl+C to stop"
	cd $(PUBLIC_DIR) && python3 -m http.server $(HOST_PORT)

.PHONY: serve-node
serve-node: ## Serve locally with Node.js serve package
	@echo "🌐 Starting Node.js server..."
	@echo "   Access at: http://localhost:$(HOST_PORT)"
	npx serve $(PUBLIC_DIR) -l $(HOST_PORT)

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
	@echo " Type:         Progressive Web Application (PWA)"
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
