# Environment Variables Template for GOGO Ecommerce

## For Client (.env.local or .env.production)

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://gogo-ecommerce-server.vercel.app/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

---

## For Server (.env)

```env
# Node Environment
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gogo?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRE=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefghijklmnop

# CORS
CLIENT_URL=https://gogo-ecommerce-client.vercel.app
ADMIN_URL=https://gogo-ecommerce-admin.vercel.app

# Email Service
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password_16_chars

# Optional: Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Getting Credentials

### 1. MongoDB Atlas
- Visit: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### 2. Firebase
- Visit: https://console.firebase.google.com
- Create new project
- Go to Project Settings → Service Accounts
- Copy Web SDK config

### 3. Cloudinary
- Visit: https://cloudinary.com/console
- Copy: Cloud Name, API Key, API Secret

### 4. JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Google App Password
- Enable 2FA on Google account
- Create app-specific password (16 characters)
- Use in EMAIL_PASSWORD

---

## Vercel Dashboard Setup

1. **Client Deployment:**
   - Project Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables
   - Redeploy

2. **Server Deployment:**
   - Project Settings → Environment Variables
   - Add all non-public variables
   - Redeploy

---

## Testing Environment Variables

```bash
# Client - Check available vars
grep -r "process.env.NEXT_PUBLIC" client/src

# Server - Check available vars
grep -r "process.env" server --include="*.js" | grep -v node_modules | head -20
```

---

## Important Notes

⚠️ **Never commit `.env` files to GitHub**

✅ **Always use Vercel Environment Variables for sensitive data**

🔒 **Keep `JWT_SECRET`, API keys, and passwords private**

---

## Quick Copy-Paste Templates

### MongoDB Connection String Format
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Firebase Config Example
```js
{
  "apiKey": "AIzaSyD...",
  "authDomain": "project.firebaseapp.com",
  "projectId": "project-id",
  "storageBucket": "project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc..."
}
```

### JWT Secret Format
```
Should be: min 32 characters, random, unique
Example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```
