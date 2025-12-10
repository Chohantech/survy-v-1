# ===========================================================
# 🔧 Makefile for Node.js App
# App Name: svryn_app_server
# Author: Muhammad Majid
# Description: Manage Node.js app using PM2
# ===========================================================

# -----------------------------
# 🔧 App Configuration
# -----------------------------
APP_DIR   := /var/www/svryn.com/backend
APP_NAME  := svryn_app_server
NODE_ENV  := production
USER      := www-data
PORT      := 5000
HOSTNAME  := 0.0.0.0

.PHONY: install get-port start stop restart clean status help

# ===========================================================
# 📦 install — Install npm dependencies
# ===========================================================
install: ## Install all npm dependencies
	@echo "\033[1;34m📦 Installing npm dependencies in $(APP_DIR)...\033[0m"
	cd $(APP_DIR) && npm install

# ===========================================================
# 🔍 get-port — Find first available free port
# ===========================================================
get-port: ## Detect first free port starting from $(PORT)
	@PORT=$(PORT); \
	while lsof -i:$$PORT >/dev/null 2>&1; do \
		$$((PORT=PORT+1)); \
	done; \
	echo $$PORT > $(APP_DIR)/.port; \
	echo "\033[1;36m🔍 Using port $$PORT\033[0m"

# ===========================================================
# 🚀 start — Start the app via PM2
# ===========================================================
start: get-port ## Start the Node.js app using PM2
	@PORT=$$(cat $(APP_DIR)/.port); \
	echo "\033[1;32m🚀 Starting $(APP_NAME) on $(HOSTNAME):$$PORT...\033[0m"; \
	cd $(APP_DIR) && pm2 start server.js --name $(APP_NAME) -- --port $$PORT --hostname $(HOSTNAME); \
	pm2 save

# ===========================================================
# 🛑 stop — Stop the app via PM2
# ===========================================================
stop: ## Stop the running Node.js app
	@echo "\033[1;31m🛑 Stopping $(APP_NAME)...\033[0m"
	pm2 stop $(APP_NAME) || echo "\033[1;33m⚠️ App is not running\033[0m"

# ===========================================================
# 🔁 restart — Restart the app via PM2
# ===========================================================
restart: ## Restart the Node.js app
	@echo "\033[1;33m🔁 Restarting $(APP_NAME)...\033[0m"
	pm2 restart $(APP_NAME) || $(MAKE) start
	pm2 save

# ===========================================================
# 🧹 clean — Delete app from PM2
# ===========================================================
clean: ## Remove the Node.js app from PM2 process list
	@echo "\033[1;31m🧹 Deleting $(APP_NAME) from PM2...\033[0m"
	pm2 delete $(APP_NAME) || true
	pm2 save

# ===========================================================
# 📊 status — Show PM2 process list
# ===========================================================
status: ## Display PM2 process list
	@echo "\033[1;36m📊 PM2 Process Status:\033[0m"
	pm2 status

# ===========================================================
# 📘 help — List all available Makefile commands
# ===========================================================
help: ## Show all available commands with description
	@echo "\033[1;35m📘 Available Makefile Commands:\033[0m"
	@echo "────────────────────────────────────────────"
	@awk 'BEGIN {FS=":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "▶ \033[1;32m%-12s\033[0m - %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo "────────────────────────────────────────────"
