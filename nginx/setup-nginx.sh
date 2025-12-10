#!/bin/bash
# ============================================================
# 🧠 Default Nginx Setup (HTTP → Docker Port 3000)
# ============================================================

set -e

echo "🔻 Stopping Nginx..."
sudo systemctl stop nginx || true

echo "🧾 Setting up configuration..."
sudo cp /gpu_mining/nginx.conf /etc/nginx/sites-available/fgpumining.site
sudo ln -sf /etc/nginx/sites-available/fgpumining.site /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "🔍 Testing configuration..."
sudo nginx -t

echo "▶️ Restarting Nginx..."
sudo systemctl restart nginx

echo "⚙️ Enabling auto-start..."
sudo systemctl enable nginx

echo "✅ Default Nginx setup complete!"
echo "🌐 Visit: http://fgpumining.site"
