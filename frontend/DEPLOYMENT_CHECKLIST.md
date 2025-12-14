# Deployment Checklist for VPS

## Issues Fixed

### 1. **Authentication Strategy Change**
- ✅ Removed server-side session checks from `proxy.ts`
- ✅ Moved authentication to client-side using `useSession` hook
- ✅ Simplified proxy to only handle static file routing

### 2. **Client-Side Authentication**
- ✅ Main layout now uses `authClient.useSession()` for authentication
- ✅ Auth layout redirects authenticated users client-side
- ✅ Added loading states while checking authentication
- ✅ Removed dependency on server-side session cookies

### 3. **Environment Variables for Production**
You still need to create a `.env.production` file on your VPS with the correct production URLs:

```bash
# On your VPS, create .env.production with:
NEXT_PUBLIC_API_URL='https://your-actual-domain.com'
NEXT_PUBLIC_URL='https://your-actual-domain.com'
BETTER_AUTH_URL='https://your-actual-domain.com'

# Keep other variables the same as development
```

### 3. **Common VPS Deployment Issues**

#### A. **Environment Variables Not Loading**
```bash
# Make sure your deployment process loads the right env file
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

#### B. **Cookie Domain Issues**
If your domain is different in production, cookies might not work. Check:
- Domain in Better Auth configuration
- Cookie SameSite settings
- HTTPS vs HTTP (production should use HTTPS)

#### C. **Build Process**
Make sure you're building with production environment:
```bash
# Build command
npm run build

# Start command  
npm start
```

## Debugging Steps

### 1. **Check Middleware Logs**
The middleware now logs detailed information. Check your VPS logs:
```bash
# Check application logs
pm2 logs your-app-name
# or
docker logs your-container-name
```

### 2. **Test Cookie Setting**
1. Open browser dev tools
2. Go to Application > Cookies
3. Check if Better Auth cookies are being set
4. Verify domain and path settings

### 3. **Test API Endpoints**
```bash
# Test auth endpoint
curl https://your-domain.com/api/auth/session

# Check if middleware is running
curl -I https://your-domain.com/home
```

## Quick Fix Commands

### Update Environment on VPS:
```bash
# SSH into your VPS
ssh user@your-vps-ip

# Navigate to your app directory
cd /path/to/your/app

# Create production environment file
nano .env.production

# Add the production URLs:
NEXT_PUBLIC_URL=https://your-domain.com
BETTER_AUTH_URL=https://your-domain.com

# Restart your application
pm2 restart your-app-name
# or restart your Docker container
```

### If Still Not Working:
1. Check if `proxy.ts` exists in the correct location (`src/proxy.ts`)
2. Verify environment variables are loaded in production
3. Check browser network tab for redirect loops
4. Verify HTTPS is working properly
5. Check if cookies are being blocked by browser security policies

## Files Changed:
- ✅ `frontend/src/proxy.ts` (enhanced with better error handling)
- ✅ `frontend/.env.production.example` (created as template)