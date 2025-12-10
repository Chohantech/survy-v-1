# Makefile for MongoDB installation and management on Ubuntu
# Author: Muhammad Majid
# Date: 2025-12-09

.PHONY: help install start stop status check clean

# ==========================
# MongoDB Configuration
# ==========================
MONGO_VERSION ?= 8.0
DB_HOST ?= localhost
DB_PORT ?= 27017
DB_NAME ?= svyrndb
DB_USER ?= svyrnuser
DB_PASS ?= P@kistan123   # Use URL-encoded password if special chars
AUTH_DB ?= admin          # User authentication database

# Encode password for URL usage (replace @ with %40, etc.)
ENCODED_PASS := $(shell echo $(DB_PASS) | sed -e 's/@/%40/g' -e 's/:/%3A/g' -e 's/#/%23/g')

# ==========================
# Help
# ==========================
help:
	@echo "Available commands:"
	@echo "  make install       Install MongoDB $(MONGO_VERSION)"
	@echo "  make start         Start MongoDB service"
	@echo "  make stop          Stop MongoDB service"
	@echo "  make status        Show MongoDB service status"
	@echo "  make check         Check connection to MongoDB database '$(DB_NAME)'"
	@echo "  make clean         Remove MongoDB completely"
	@echo "  make help          Show this help message"

# ==========================
# Install MongoDB
# ==========================
install:
	@echo "📦 Installing MongoDB $(MONGO_VERSION)..."
	sudo apt-get update
	sudo apt-get install -y gnupg wget curl lsb-release ca-certificates

	# Add MongoDB GPG key using modern method
	curl -fsSL https://www.mongodb.org/static/pgp/server-$(MONGO_VERSION).asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-$(MONGO_VERSION).gpg

	# Add MongoDB repository
	echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-$(MONGO_VERSION).gpg ] https://repo.mongodb.org/apt/ubuntu $$(lsb_release -cs)/mongodb-org/$(MONGO_VERSION) multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-$(MONGO_VERSION).list

	sudo apt-get update
	sudo apt-get install -y mongodb-org
	@echo "✅ MongoDB $(MONGO_VERSION) installation complete."

# ==========================
# Start MongoDB service
# ==========================
start:
	@echo "▶️ Starting MongoDB service..."
	sudo systemctl start mongod
	sudo systemctl enable mongod
	sudo systemctl status mongod --no-pager

# ==========================
# Stop MongoDB service
# ==========================
stop:
	@echo "⏹ Stopping MongoDB service..."
	sudo systemctl stop mongod

# ==========================
# Check MongoDB service status
# ==========================
status:
	@echo "ℹ️ MongoDB service status:"
	sudo systemctl status mongod --no-pager

# ==========================
# Check MongoDB connection
# ==========================
check:
	@echo "🔗 Checking connection to database '$(DB_NAME)'..."
	mongosh "mongodb://$(DB_USER):$(ENCODED_PASS)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?authSource=$(AUTH_DB)" \
		--eval "db.stats()" \
		&& echo "✅ MongoDB connection successful." \
		|| echo "❌ MongoDB connection failed."

# ==========================
# Remove MongoDB completely
# ==========================
clean:
	@echo "🧹 Removing MongoDB..."
	sudo systemctl stop mongod || true
	sudo apt-get purge -y mongodb-org*
	sudo rm -rf /var/log/mongodb /var/lib/mongodb /etc/apt/sources.list.d/mongodb-org-*.list /usr/share/keyrings/mongodb-*.gpg
	@echo "✅ MongoDB completely removed."
