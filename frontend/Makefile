# ============================================================
# 🔧 Next.js Paths & Environment Variables
# ============================================================
APP_DIR       := /var/www/svryn.com/frontend
APP_NAME      := svryn_app_client
NODE_ENV      := production
USER          := www-data
PORT          := 3000
HOSTNAME      := 0.0.0.0
DOMAIN        := https://www.svryn.com
SERVER_FILE   := $(APP_DIR)/.next/standalone/server.js

.PHONY: help build run setup start stop restart status logs startup test-site clean get-port

# ============================================================
# 📘 help — Display all available Makefile commands
# ============================================================
help: ## Show this help message with available Makefile targets
	@echo ""
	@echo "📘 AVAILABLE COMMANDS"
	@echo "──────────────────────────────────────────────"
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "▶ %-20s %s\n", $$1, $$2}'
	@echo "──────────────────────────────────────────────"
	@echo ""

# ============================================================
# 🔍 get-port — Find first available free port
# ============================================================
get-port: ## Detect first free port starting from $(PORT)
	@PORT=$(PORT); \
	while lsof -i:$$PORT >/dev/null 2>&1; do \
		$$((PORT=PORT+1)); \
	done; \
	echo $$PORT > $(APP_DIR)/.port; \
	echo "🔍 Using free port $$PORT"

# ============================================================
# 🏗️ build — Production Build (Next.js Standalone for Nginx)
# ============================================================
build: ## Build Next.js app in standalone mode for Nginx deployment
	@echo "🧹 Removing previous Next.js build..."
	sudo chmod -R 777 $(APP_DIR) || true
	rm -rf $(APP_DIR)/.next

	@echo "📦 Installing dependencies..."
	cd $(APP_DIR) && npm install --legacy-peer-deps || { echo '❌ npm install failed!'; exit 1; }

	@echo "🏗️ Building Next.js (standalone mode)..."
	cd $(APP_DIR) && npm run build:web || { echo '❌ Build failed!'; exit 1; }

	@echo "🔧 Restoring secure permissions for Nginx..."
	sudo find $(APP_DIR) -type d -exec chmod 777 {} \;
	sudo find $(APP_DIR) -type f -exec chmod 777 {} \;
	sudo chown -R $(USER):$(USER) $(APP_DIR)


	@echo "✅ Next.js build complete — ready for Nginx."

# ============================================================
# ▶ run — Start Next.js Development Server
# ============================================================
run: ## Start Next.js development server
	@echo "🚀 Starting Next.js development server..."
	cd $(APP_DIR) && npm run dev

# ============================================================
# 1️⃣ setup — Install & Setup PM2
# ============================================================
setup: ## Install PM2 globally for process management
	@echo "⚙️ Installing PM2 globally..."
	sudo npm install -g pm2
	@pm2 -v || { echo "❌ PM2 installation failed!"; exit 1; }
	@echo "✅ PM2 installed successfully."

# ============================================================
# 2️⃣ start — Start Next.js Standalone App via PM2
# ============================================================
start: get-port ## Start the Next.js app using PM2
	@PORT=$$(cat $(APP_DIR)/.port); \
	echo "🚀 Starting $(APP_NAME) via PM2 on $(HOSTNAME):$$PORT..."; \
	cd $(APP_DIR) && \
	sudo chmod -R 755 $(APP_DIR) && \
	sudo chmod -R 777 .next && \
	pm2 start node --name "$(APP_NAME)" -- \
		$(SERVER_FILE) \
		--env $(NODE_ENV) \
		HOSTNAME=$(HOSTNAME) \
		PORT=$$PORT
	@pm2 save
	@echo "✅ App $(APP_NAME) started on $(HOSTNAME):$$PORT!"

# ============================================================
# 3️⃣ stop & restart — Manage PM2 Processes
# ============================================================
stop: ## Stop the Next.js app managed by PM2
	@echo "🛑 Stopping $(APP_NAME)..."
	@pm2 stop $(APP_NAME) || echo "⚠️ App not running."

restart: ## Restart the Next.js app via PM2
	@echo "🔁 Restarting $(APP_NAME)..."
	@pm2 restart $(APP_NAME) || $(MAKE) start
	@pm2 save
	@echo "✅ Restarted successfully."

# ============================================================
# 4️⃣ status & logs — PM2 Monitoring
# ============================================================
status: ## Show PM2 process list
	@echo "📊 PM2 Process List"
	@pm2 list

logs: ## View logs for the Next.js app (Ctrl+C to exit)
	@echo "🪵 Viewing logs for $(APP_NAME)..."
	@pm2 logs $(APP_NAME)

# ============================================================
# 5️⃣ startup — Enable PM2 Auto-start on Server Boot
# ============================================================
startup: ## Enable PM2 to auto-start app on system boot
	@echo "🔄 Enabling PM2 startup service..."
	@sudo pm2 startup systemd -u $(USER) --hp /home/$(USER)
	@pm2 save
	@sudo systemctl enable pm2-$(USER)
	@sudo systemctl start pm2-$(USER)
	@echo "✅ PM2 auto-start enabled."

# ============================================================
# 6️⃣ test-site — Test Site Availability
# ============================================================
test-site: ## Test if site is responding with HTTP 200 OK
	@echo "🌐 Testing site availability at $(DOMAIN)..."
	@if curl -s -o /dev/null -w "%{http_code}" $(DOMAIN) | grep -q "200"; then \
		echo "✅ Site is UP and responding correctly."; \
	else \
		echo "❌ Site is DOWN or not returning 200 OK."; \
	fi

# ============================================================
# 7️⃣ clean — Remove PM2 Process
# ============================================================
clean: ## Remove the app from PM2 process list
	@echo "🧹 Removing $(APP_NAME) from PM2..."
	@pm2 delete $(APP_NAME) || true
	@pm2 save
	@echo "✅ PM2 process cleaned."
