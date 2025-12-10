# ============================================================
# ❓ help — List all available Makefile commands
# ============================================================
.PHONY: help pull push sync clean perms

help: ## Show this help message
	@echo "📌 Available Makefile targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

# -----------------------------
# 🔧 Git Configuration Variables
# -----------------------------
REMOTE ?= origin                   # Remote repository name
BRANCH ?= main                     # Target branch
MSG    ?= update: auto-sync commit # Default commit message

# ============================================================
# 🔒 perms — Recursively set safe permissions
# ============================================================
# ============================================================
# 🔒 perms — Recursively set full access permissions
# ============================================================
perms: ## Recursively set full access permissions for current directory
	@echo "🔒 Setting full access permissions recursively in $(CURDIR)..."

	@echo "📂 Directories: read, write, execute for all users"
	@find . -type d -exec chmod 777 {} \; || { echo "❌ Failed to set directory permissions"; exit 1; }

	@echo "📄 Files: read, write, execute for all users"
	@find . -type f -exec chmod 777 {} \; || { echo "❌ Failed to set file permissions"; exit 1; }

	@echo "✅ Full permissions updated successfully."



# ============================================================
# 🔄 pull — Pull latest from remote
# ============================================================
pull: ## Pull latest changes from remote
	@echo "🔄 Pulling latest changes from $(REMOTE)/$(BRANCH)..."
	@git pull $(REMOTE) $(BRANCH) || { \
		echo "❌ git pull failed — please resolve manually"; exit 1; \
	}
	@echo "✅ Pull complete — repository updated."

# ============================================================
# 🚀 push — Add → Commit → Push
# ============================================================
push: ## Add, commit, and push changes
	@echo "📦 Adding changes..."
	@git add . || { echo "❌ git add failed"; exit 1; }

	@echo "💾 Committing changes..."
	@git commit -m "$(MSG)" || { echo "⚠️ Nothing to commit"; }

	@echo "🚀 Pushing changes to $(REMOTE)/$(BRANCH)..."
	@git push $(REMOTE) $(BRANCH) || { \
		echo "⚠️ Push failed — attempting recovery..."; \
		git pull $(REMOTE) $(BRANCH) || { echo "❌ git pull failed during recovery"; exit 1; }; \
		git push $(REMOTE) $(BRANCH) --force-with-lease || { echo "❌ Push failed again"; exit 1; }; \
	}
	@echo "✅ Push complete — $(BRANCH) updated."


# ============================================================
# 🐙 sync — Add → Commit → Pull → Push
# ============================================================
sync: perms ## Full workflow: add, commit, pull, push
	@echo "📦 Adding changes..."
	@git add . || { echo "❌ git add failed"; exit 1; }

	@echo "💾 Committing changes..."
	@git commit -m "$(MSG)" || { echo "⚠️ Nothing to commit"; }

	@echo "🔄 Pulling latest changes..."
	@git pull $(REMOTE) $(BRANCH) || { echo "⚠️ git pull failed — resolve manually"; }

	@echo "🚀 Pushing updates..."
	@git push $(REMOTE) $(BRANCH) || { \
		echo "⚠️ Push failed — attempting recovery..."; \
		git pull $(REMOTE) $(BRANCH) || { echo "❌ git pull failed during recovery"; exit 1; }; \
		git push $(REMOTE) $(BRANCH) --force-with-lease || { echo "❌ Push failed again"; exit 1; }; \
	}
	@echo "✅ Git sync complete — $(BRANCH) is fully updated."

# ============================================================
# 🧹 clean — Hard reset to remote
# ============================================================
clean: perms ## Hard reset to remote branch + clean untracked files
	@echo "🧹 Fetching remote branch..."
	@git fetch $(REMOTE) $(BRANCH) || { echo "❌ fetch failed"; exit 1; }

	@echo "🔄 Resetting local branch to remote..."
	@git reset --hard $(REMOTE)/$(BRANCH) || { echo "❌ reset failed"; exit 1; }

	@echo "🧹 Cleaning untracked files..."
	@git clean -fd || { echo "❌ clean failed"; exit 1; }

	@echo "✅ Repository cleaned — exact match of remote."
