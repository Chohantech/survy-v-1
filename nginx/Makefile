############################################################ 
# 🌐 Makefile — Nginx + Next.js Deployment (Independent Commands)
# ---------------------------------------------------------
# Author: Zahid Khan (Updated by Muhammad Majid / ChatGPT)
# Version: 3.3
############################################################

# ==========================================================
# 🔧 VARIABLES
# ==========================================================
DOMAIN             := svryn.com
APP_DIR            := /var/www/$(DOMAIN)/frontend
NGINX_DIR          := /var/www/$(DOMAIN)/nginx
NGINX_SITE_DIR     := /etc/nginx/sites-available
NGINX_ENABLED_DIR  := /etc/nginx/sites-enabled
CONFIG_FILE        := $(NGINX_SITE_DIR)/$(DOMAIN)
LOCAL_CONF_PATH    := $(NGINX_DIR)/$(DOMAIN).conf
DEFAULT_CONF       := /etc/nginx/sites-available/default
HEADERS_CONF_LOCAL := $(NGINX_DIR)/headers.conf
HEADERS_CONF_DEST  := /etc/nginx/conf.d/headers.conf
DEFAULT_NGINX_DIR  := $(NGINX_DIR)/nginx.conf
DEFAULT_NGINX      := /etc/nginx/nginx.conf

GREEN   := \033[1;32m
RED     := \033[1;31m
YELLOW  := \033[1;33m
CYAN    := \033[1;36m
RESET   := \033[0m

# ==========================================================
# 🧭 HELP MENU
# ==========================================================
help:
	@echo ""
	@echo "$(CYAN)🌍 Nginx + Next.js Deployment Helper$(RESET)"
	@echo "==============================================================="
	@echo "$(YELLOW)Usage:$(RESET) make <target>"
	@echo ""
	@echo "$(YELLOW)Available Commands:$(RESET)"
	@echo "  $(GREEN)deploy-all        $(RESET)→ Full automated setup pipeline"
	@echo "  $(GREEN)install           $(RESET)→ Install and enable Nginx"
	@echo "  $(GREEN)setup-dir         $(RESET)→ Create app directories"
	@echo "  $(GREEN)copy-config       $(RESET)→ Copy Nginx config + headers"
	@echo "  $(GREEN)test              $(RESET)→ Validate Nginx syntax"
	@echo "  $(GREEN)start             $(RESET)→ Start Nginx service"
	@echo "  $(GREEN)stop              $(RESET)→ Stop Nginx service"
	@echo "  $(GREEN)restart           $(RESET)→ Restart Nginx service"
	@echo "  $(GREEN)reload            $(RESET)→ Reload Nginx configuration"
	@echo "  $(GREEN)restart-clean     $(RESET)→ Stop → Free Ports → Start"
	@echo "  $(GREEN)free-ports        $(RESET)→ Release ports 80/443"
	@echo "  $(GREEN)enable-ssl        $(RESET)→ Configure SSL with Certbot"
	@echo "  $(GREEN)test-site         $(RESET)→ Check HTTP & HTTPS responses"
	@echo "  $(GREEN)rollback-config   $(RESET)→ Restore default Nginx config"
	@echo "  $(GREEN)clean             $(RESET)→ Remove site configuration & SSL"
	@echo "==============================================================="
	@echo "$(CYAN)💡 Tip: Run 'make deploy-all' for complete setup.$(RESET)"
	@echo ""

# ==========================================================
# 🚀 FULL DEPLOYMENT
# ==========================================================
deploy-all: install setup-dir copy-config start enable-ssl test-site
	@echo "$(GREEN)🎉 Deployment complete!$(RESET)"
	@echo "$(CYAN)➡️ Visit: https://$(DOMAIN)$(RESET)"

# ==========================================================
# 1️⃣ INSTALL & ENABLE NGINX
# ==========================================================
install:
	@echo "$(YELLOW)📦 Installing Nginx...$(RESET)"
	@if ! command -v nginx >/dev/null 2>&1; then \
		sudo apt update -y && sudo apt install -y nginx; \
	else \
		echo "$(GREEN)✅ Nginx already installed.$(RESET)"; \
	fi
	@sudo systemctl enable nginx --now
	@sudo ufw allow 'Nginx Full' >/dev/null 2>&1 || true

# ==========================================================
# 2️⃣ DIRECTORY SETUP
# ==========================================================
setup-dir:
	@echo "$(YELLOW)📁 Creating directories...$(RESET)"
	@sudo mkdir -p /var/www/letsencrypt
	@sudo mkdir -p $(APP_DIR)
	@sudo chown -R www-data:www-data $(APP_DIR)
	@sudo chmod -R 755 $(APP_DIR)
	@echo "$(GREEN)✅ Directories ready.$(RESET)"

# ==========================================================
# 3️⃣ COPY CONFIGS, HEADERS & MAIN NGINX
# ==========================================================
copy-config:
	@echo "$(YELLOW)⚙️ Copying Nginx configs & headers...$(RESET)"

	# Copy main nginx.conf
	@if [ ! -f "$(DEFAULT_NGINX_DIR)" ]; then \
		echo "$(RED)❌ Missing main nginx.conf: $(DEFAULT_NGINX_DIR)$(RESET)"; exit 1; \
	fi
	@sudo cp $(DEFAULT_NGINX_DIR) $(DEFAULT_NGINX)

	# Copy headers.conf
	@if [ ! -f "$(HEADERS_CONF_LOCAL)" ]; then \
		echo "$(RED)❌ Missing headers file: $(HEADERS_CONF_LOCAL)$(RESET)"; exit 1; \
	fi
	@sudo cp $(HEADERS_CONF_LOCAL) $(HEADERS_CONF_DEST)

	# Copy site config
	@if [ ! -f "$(LOCAL_CONF_PATH)" ]; then \
		echo "$(RED)❌ Missing site config: $(LOCAL_CONF_PATH)$(RESET)"; exit 1; \
	fi
	@sudo cp $(LOCAL_CONF_PATH) $(CONFIG_FILE)
	@sudo ln -sf $(CONFIG_FILE) $(NGINX_ENABLED_DIR)/$(DOMAIN)

	# Test Nginx config
	@sudo nginx -t && echo "$(GREEN)✅ Nginx config valid.$(RESET)" || (echo "$(RED)❌ Config test failed.$(RESET)" && exit 1)
	@echo "$(GREEN)✅ All configs copied successfully.$(RESET)"

# ==========================================================
# 4️⃣ VALIDATE CONFIGURATION
# ==========================================================
test:
	@echo "$(YELLOW)🧪 Validating Nginx syntax...$(RESET)"
	@if sudo nginx -t; then \
		echo "$(GREEN)✅ Syntax valid.$(RESET)"; \
	else \
		echo "$(RED)❌ Syntax invalid!$(RESET)"; \
		exit 1; \
	fi

# ==========================================================
# 5️⃣ CONTROL NGINX
# ==========================================================
start:
	@echo "$(YELLOW)▶️ Starting Nginx...$(RESET)"
	@sudo systemctl start nginx >/dev/null 2>&1 || true
	@echo "$(GREEN)✅ Nginx started.$(RESET)"

stop:
	@echo "$(YELLOW)⏹️ Stopping Nginx...$(RESET)"
	@sudo systemctl stop nginx >/dev/null 2>&1 || true
	@sudo pkill -f nginx 2>/dev/null || true
	@sudo lsof -ti :80 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@sudo lsof -ti :443 -sTCP:LISTEN | xargs -r sudo kill -9 || true

restart: stop start

reload:
	@echo "$(YELLOW)🔁 Reloading Nginx...$(RESET)"
	@sudo systemctl reload nginx && echo "$(GREEN)✅ Reloaded.$(RESET)" || echo "$(RED)❌ Reload failed.$(RESET)"

restart-clean: stop free-ports start

free-ports:
	@echo "$(YELLOW)🧹 Releasing ports 80 & 443...$(RESET)"
	@sudo lsof -ti :80 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@sudo lsof -ti :443 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@echo "$(GREEN)✅ Ports released.$(RESET)"

# ==========================================================
# 6️⃣ SSL CONFIGURATION
# ==========================================================
enable-ssl:
	@echo "$(YELLOW)🔒 Configuring SSL for $(DOMAIN)...$(RESET)"
	@sudo apt update -y && sudo apt install -y certbot python3-certbot-nginx
	@bash -c '\
	SSL_CONF="$(CONFIG_FILE)"; \
	if sudo certbot --nginx -d $(DOMAIN) -d www.$(DOMAIN) --non-interactive --agree-tos -m admin@$(DOMAIN); then \
		echo "$(GREEN)✅ Certbot SSL installed.$(RESET)"; \
	else \
		echo "$(RED)⚠️ Certbot failed — generating self-signed cert.$(RESET)"; \
		sudo mkdir -p /etc/nginx/ssl; \
		sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout /etc/nginx/ssl/selfsigned.key \
			-out /etc/nginx/ssl/selfsigned.crt \
			-subj "/CN=$(DOMAIN)"; \
		sudo sed -i "s|ssl_certificate .*|ssl_certificate /etc/nginx/ssl/selfsigned.crt;|" $$SSL_CONF; \
		sudo sed -i "s|ssl_certificate_key .*|ssl_certificate_key /etc/nginx/ssl/selfsigned.key;|" $$SSL_CONF; \
	fi'
	@sudo nginx -t && sudo systemctl reload nginx

# ==========================================================
# 7️⃣ TEST SITE
# ==========================================================
test-site:
	@echo "$(YELLOW)🌍 Checking site...$(RESET)"
	@curl -s --max-time 5 http://$(DOMAIN) | grep -qi "html" && echo "$(GREEN)✅ HTTP OK$(RESET)" || echo "$(RED)❌ HTTP failed$(RESET)"
	@curl -s -k --max-time 5 https://$(DOMAIN) | grep -qi "html" && echo "$(GREEN)✅ HTTPS OK$(RESET)" || echo "$(RED)❌ HTTPS failed$(RESET)"

# ==========================================================
# 8️⃣ ROLLBACK & CLEANUP
# ==========================================================
rollback-config:
	@echo "$(YELLOW)⏪ Restoring default config...$(RESET)"
	@if [ -f "$(DEFAULT_CONF)" ]; then \
		sudo ln -sf $(DEFAULT_CONF) $(NGINX_ENABLED_DIR)/default; \
		sudo rm -f $(CONFIG_FILE); \
		sudo systemctl restart nginx || true; \
		echo "$(GREEN)✅ Default restored.$(RESET)"; \
	else \
		echo "$(RED)⚠️ Default config missing.$(RESET)"; \
	fi

clean:
	@echo "$(YELLOW)🧹 Cleaning Nginx & SSL...$(RESET)"
	@sudo rm -f $(CONFIG_FILE) $(NGINX_ENABLED_DIR)/$(DOMAIN)
	@sudo rm -rf /var/cache/nginx/* /var/log/nginx/*
	@sudo rm -rf /etc/letsencrypt/live/$(DOMAIN) /etc/letsencrypt/archive/$(DOMAIN)
	@sudo rm -rf /etc/nginx/ssl/selfsigned.* || true
	@echo "$(GREEN)🎯 Cleanup complete.$(RESET)"
