# 🚀 Vercel Deployment Guide - GOGO Ecommerce Full-Stack

Complete step-by-step guide to deploy GOGO (Client + Server) on Vercel.

---

## 📋 Pre-Deployment Checklist

### ✅ Requirements
- [x] GitHub Account (for repository hosting)
- [x] Vercel Account (free tier available)
- [x] MongoDB Database (local or Atlas)
- [x] Cloudinary Account (for image storage)
- [x] Node.js 18+ installed locally

### ✅ Project Structure
```
GOGO-ecommerce-Next.js/
├── client/              # Next.js frontend
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── src/app/
├── server/              # Express.js backend
│   ├── package.json
│   ├── index.js
│   └── config/
└── vercel.json          # ⭐ Configuration file (to be created)
```

---

## 🔧 Phase 1: Prepare Your Project Locally

### Step 1: Verify Builds Work Locally

```bash
# Navigate to client directory
cd client
npm run build

# Check for errors - should end with "Routes" table

# Navigate to server and test
cd ../server
npm test 2>/dev/null || echo "No test script configured"
```

**Expected Output:**
- ✅ Client build compiles successfully
- ✅ No critical errors

---

## 📦 Phase 2: Create GitHub Repository

### Step 2a: Initialize Git Repository (if not already done)

```bash
# From project root
git init
git add .
git commit -m "Initial commit: GOGO ecommerce project ready for Vercel"
```

### Step 2b: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New"** button (top left)
3. Fill Details:
   - **Repository name:** `GOGO-ecommerce-Next.js`
   - **Description:** "Full-stack e-commerce platform with Next.js and Express"
   - **Public/Private:** Public (recommended for easier deployment)
4. Click **Create repository**

### Step 2c: Push Code to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/GOGO-ecommerce-Next.js.git

# Rename branch if needed
git branch -M main

# Push code
git push -u origin main

# Verify push
git log --oneline
```

---

## 🌐 Phase 3: Deploy on Vercel

### Step 3a: Create Vercel Configuration File

Create `/vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/.next",
  "framework": "nextjs",
  "regions": ["blr1"],
  "functions": {
    "server/index.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

**Save this and commit:**
```bash
git add vercel.json
git commit -m "Add Vercel configuration"
git push
```

### Step 3b: Create Vercel Project - CLIENT DEPLOYMENT

1. Go to [Vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"New Project"**
3. **Import Git Repository:**
   - Select your GitHub account
   - Search and select `GOGO-ecommerce-Next.js`
   - Click **"Import"**

4. **Configure Project:**
   - **Project Name:** `gogo-ecommerce-client`
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `client/`
   - Keep other settings default

5. **Environment Variables** (click "Environment Variables"):

```
NEXT_PUBLIC_API_URL=https://gogo-ecommerce-server.vercel.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

6. Click **"Deploy"** ↳ Wait 3-5 minutes for deployment

**Result:** You get a URL like `https://gogo-ecommerce-client.vercel.app`

---

### Step 3c: Create Vercel Project - SERVER DEPLOYMENT

#### Option A: Deploy as Serverless Functions (Recommended for Vercel)

1. Create `/vercel-server.json` in server root:

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "env": {
    "NODE_ENV": "production",
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary_cloud_name",
    "CLOUDINARY_API_KEY": "@cloudinary_api_key",
    "CLOUDINARY_API_SECRET": "@cloudinary_api_secret",
    "CLIENT_URL": "@client_url",
    "ADMIN_URL": "@admin_url",
    "EMAIL_USER": "@email_user",
    "EMAIL_PASSWORD": "@email_password"
  },
  "functions": {
    "index.js": {
      "memory": 512,
      "maxDuration": 30
    }
  }
}
```

2. Rename `server/index.js` to `server/api/index.js`:

```bash
# From project root
mkdir -p server/api
mv server/index.js server/api/index.js
```

3. Create `server/package.json` wrapper in root (if server is in subfolder):

```json
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "build": "npm install --prefix server",
    "start": "node server/api/index.js",
    "dev": "nodemon server/api/index.js"
  }
}
```

4. On Vercel Dashboard:
   - Click **"New Project"**
   - Import same GitHub repo
   - **Project Name:** `gogo-ecommerce-server`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`

5. **Add Environment Variables** in Vercel:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gogo
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=https://gogo-ecommerce-client.vercel.app
ADMIN_URL=https://gogo-ecommerce-admin.vercel.app
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
PORT=3001
NODE_ENV=production
```

6. Click **"Deploy"** ↳ Wait for deployment

---

#### Option B: Deploy Server on Render.com (Alternative)

If you prefer keeping backend separate:

1. Go to [Render.com](https://render.com/)
2. Click **"New Web Service"**
3. Connect GitHub and select repo
4. **Settings:**
   - **Name:** gogo-ecommerce-server
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
5. Add same environment variables
6. Deploy and get URL like `https://gogo-ecommerce-server.onrender.com`

---

## 🔐 Phase 4: Configure Environment Variables

### Step 4a: Get Required Credentials

#### MongoDB URI
```
mongodb+srv://username:password@cluster.mongodb.net/gogo?retryWrites=true&w=majority
```
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster
- Copy connection string

#### Firebase Credentials
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```
- Get from [Firebase Console](https://console.firebase.google.com)

#### Cloudinary Credentials
```
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefghijklmnop
```
- Get from [Cloudinary Dashboard](https://cloudinary.com/console)

#### JWT Secret
```
JWT_SECRET=your-super-secret-key-min-32-characters-long
```
- Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

### Step 4b: Add to Vercel

1. Go to **Vercel Dashboard** → Select your project
2. Click **Settings** → **Environment Variables**
3. Add all variables listed above
4. Click **Save**
5. **Redeploy** by going to Deployments → Click three dots on latest → Redeploy

---

## ✅ Phase 5: Verify Deployment

### Step 5a: Test Client URL

```
https://gogo-ecommerce-client.vercel.app
```

- ✅ Homepage loads
- ✅ Can browse products
- ✅ Navigation works

### Step 5b: Test API Connectivity

```bash
# Test server endpoint
curl https://gogo-ecommerce-server.vercel.app/api/ping

# Should return success response
# Status: 200 OK
```

### Step 5c: Check Build Logs

1. Vercel Dashboard → Select project
2. Click **"Deployments"** tab
3. Click latest deployment
4. Click **"Build Logs"** for detailed output
5. Look for errors/warnings

---

## 🐛 Phase 6: Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
# Ensure all dependencies are installed
cd client && npm install
cd ../server && npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: API Connection Errors

**Check:**
1. Environment variables are set in Vercel
2. CORS is properly configured in `server/index.js`
3. API URL is correct in client env variables

**Fix in Vercel:**
```
NEXT_PUBLIC_API_URL=https://your-server-domain.vercel.app/api
```

### Issue: Database Connection Fails

**Check MongoDB Atlas:**
1. IP Whitelist: Add `0.0.0.0/0` or Vercel IPs
2. Network Access → Allow All
3. Test connection string locally first

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Issue: Build Timeout

**Solution:**
1. Vercel Settings → Build & Development Settings
2. Increase Build Timeout to 60 seconds
3. Optimize imports (remove unused)

---

## 📊 Phase 7: Domain Setup (Optional)

### Add Custom Domain

1. Vercel Dashboard → Project Settings → Domains
2. Enter your domain (e.g., `gogocart.com`)
3. Update DNS records (instructions provided by Vercel)
4. Wait 24-48 hours for propagation

**SSL Certificate:** Automatic (provided by Vercel)

---

## 🔄 Phase 8: Continuous Deployment

### Automatic Deployments

- **Push to main branch** → Vercel auto-deploys
- **Every commit triggers build** → Check Deployments tab
- **Revert to previous version** → Click deployment → Redeploy

### Manual Deployment

1. Vercel Dashboard → Deployments
2. Click three dots on any deployment
3. Click **"Redeploy"**

---

## 📈 Phase 9: Monitoring & Analytics

### Real-Time Monitoring

1. Vercel Dashboard → Analytics
2. Monitor:
   - **Web Vitals** (Performance)
   - **Errors** (Debug issues)
   - **Response Times**
   - **Bandwidth Usage**

### Enable Monitoring

```js
// In client layout.js
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout() {
  return (
    <html>
      <body>
        {/* Your content */}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🎯 Final Verification Checklist

- [ ] Client deployed and accessible
- [ ] Server deployed and responding
- [ ] Database connected
- [ ] Environment variables all set
- [ ] API calls working
- [ ] Authentication functioning
- [ ] Images loading from Cloudinary
- [ ] No console errors in DevTools
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active (HTTPS)
- [ ] Error monitoring enabled
- [ ] Analytics tracking setup

---

## 📞 Useful Links

| Resource | URL |
|----------|-----|
| Vercel Docs | https://vercel.com/docs |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| Firebase Console | https://console.firebase.google.com |
| Cloudinary | https://cloudinary.com/console |
| Render.com | https://render.com |

---

## 🎉 Success!

Your GOGO ecommerce platform is now live on Vercel!

**Client:** `https://gogo-ecommerce-client.vercel.app`  
**Server:** `https://gogo-ecommerce-server.vercel.app`

Monitor performance and user feedback to continuously improve! 🚀
