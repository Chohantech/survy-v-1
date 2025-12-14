#!/bin/bash

# ===================================================================
# 🔍 Debug API Communication Issues
# ===================================================================

echo "🔍 Debugging API communication issues..."
echo "========================================"

# Check if services are running
echo "1. 📊 Service Status Check"
echo "-------------------------"
echo "Backend (port 5000):"
if netstat -tlnp | grep -q ":5000"; then
    echo "✅ Backend is running"
    netstat -tlnp | grep ":5000"
else
    echo "❌ Backend is NOT running"
fi

echo ""
echo "Frontend (port 3000):"
if netstat -tlnp | grep -q ":3000"; then
    echo "✅ Frontend is running"
    netstat -tlnp | grep ":3000"
else
    echo "❌ Frontend is NOT running"
fi

echo ""
echo "2. 🧪 Direct Service Tests"
echo "-------------------------"

# Test backend directly
echo "Testing backend directly (localhost:5000):"
backend_response=$(curl -s -w "HTTP_CODE:%{http_code}\nTIME:%{time_total}s\n" http://localhost:5000/api/health 2>/dev/null)
echo "$backend_response"

echo ""
echo "Testing frontend directly (localhost:3000):"
frontend_response=$(curl -s -w "HTTP_CODE:%{http_code}\nTIME:%{time_total}s\n" -I http://localhost:3000/ 2>/dev/null)
echo "$frontend_response"

echo ""
echo "3. 🌐 Nginx Proxy Tests"
echo "----------------------"

# Test through domain
echo "Testing main site (https://svryn.com/):"
site_response=$(curl -s -w "HTTP_CODE:%{http_code}\nTIME:%{time_total}s\n" -I https://svryn.com/ 2>/dev/null)
echo "$site_response"

echo ""
echo "Testing API through Nginx (https://svryn.com/api/health):"
api_response=$(curl -s -w "HTTP_CODE:%{http_code}\nTIME:%{time_total}s\n" https://svryn.com/api/health 2>/dev/null)
echo "$api_response"

echo ""
echo "Testing Better Auth through Nginx (https://svryn.com/api/auth/session):"
auth_response=$(curl -s -w "HTTP_CODE:%{http_code}\nTIME:%{time_total}s\n" https://svryn.com/api/auth/session 2>/dev/null)
echo "$auth_response"

echo ""
echo "4. 📋 Environment Check"
echo "----------------------"

# Check environment files
echo "Backend environment (.env.production):"
if [ -f "/var/www/svryn.com/backend/.env.production" ]; then
    echo "✅ Backend .env.production exists"
    grep -E "FRONTEND_URL|NODE_ENV|PORT" /var/www/svryn.com/backend/.env.production 2>/dev/null || echo "❌ Key variables not found"
else
    echo "❌ Backend .env.production missing"
fi

echo ""
echo "Frontend environment (.env.production):"
if [ -f "/var/www/svryn.com/frontend/.env.production" ]; then
    echo "✅ Frontend .env.production exists"
    grep -E "NEXT_PUBLIC_API_URL|NEXT_PUBLIC_URL" /var/www/svryn.com/frontend/.env.production 2>/dev/null || echo "❌ Key variables not found"
else
    echo "❌ Frontend .env.production missing"
fi

echo ""
echo "5. 📝 Recent Logs"
echo "----------------"

echo "Nginx error log (last 5 lines):"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "❌ No nginx error log"

echo ""
echo "Backend log (last 5 lines):"
tail -5 /var/log/backend.log 2>/dev/null || echo "❌ No backend log"

echo ""
echo "Frontend log (last 5 lines):"
tail -5 /var/log/frontend.log 2>/dev/null || echo "❌ No frontend log"

echo ""
echo "6. 🔧 Nginx Configuration Check"
echo "------------------------------"
echo "Testing nginx configuration:"
nginx -t

echo ""
echo "Active nginx sites:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "🎯 SUMMARY"
echo "=========="
echo "Run this script on your VPS to see exactly what's happening:"
echo "1. Copy this script to your VPS"
echo "2. Run: chmod +x debug-api-issue.sh"
echo "3. Run: sudo ./debug-api-issue.sh"
echo "4. Share the output to identify the exact issue"