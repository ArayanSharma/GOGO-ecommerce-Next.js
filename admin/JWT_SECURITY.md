# Admin Dashboard JWT Security

## Overview
The admin dashboard now includes comprehensive JWT (JSON Web Token) security implementation to protect all admin routes and API endpoints.

## Features

### 1. **JWT Token Management**
- Automatic token storage in secure HTTP-only cookies
- Token validation on every request
- Automatic token refresh without user intervention
- Token expiration handling with automatic redirect to login

### 2. **Protected Routes**
- All routes except `/admin-login` are protected
- Middleware checks for valid JWT token on every request
- Automatic redirect to login for expired/missing tokens
- Support for redirect after login to the originally requested page

### 3. **Automatic Token Injection**
- All API requests automatically include JWT token in `Authorization` header
- Pattern: `Authorization: Bearer {token}`
- Works with axios client and native fetch API

### 4. **Token Expiration Handling**
- Automatic 401 (Unauthorized) error handling
- Clears invalid tokens and redirects to login
- Graceful error messages to users

## How It Works

### Login Flow
```
1. User enters email/password at /admin-login
2. Credentials sent to /api/admin/login
3. Server validates and returns JWT token
4. Token stored in secure cookie (7-day expiration)
5. User redirected to dashboard
6. Middleware verifies token on all subsequent requests
```

### API Requests
```
All dashboard API calls automatically include:
- Authorization: Bearer {jwt_token}
- Content-Type: application/json

Examples:
GET /api/products
GET /api/users/all
PUT /api/products/{id}
DELETE /api/users/{id}
```

### Logout Flow
```
1. User clicks logout
2. Clear JWT token from cookies
3. Clear localStorage data
4. Call /api/admin/logout (if exists)
5. Redirect to login page
```

## Usage in Components

### Method 1: Using Axios Client (Recommended)
```javascript
import { adminGetData, adminPostData, adminPutData } from '@/utils/api';

// All requests automatically include JWT token
const products = await adminGetData('/api/products');
const updated = await adminPutData('/api/products/123', { name: 'New Name' });
```

### Method 2: Using Fetch with Auth Wrapper
```javascript
import { getWithAuth, postWithAuth, parseJsonSafely } from '@/utils/fetchAuth';

const response = await getWithAuth(`${apiUrl}/api/products`);
const result = await parseJsonSafely(response);
```

### Method 3: Using Native Fetch (Manual)
```javascript
import { getAdminToken } from '@/utils/api';

const token = getAdminToken();
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Method 4: Using useAuth Hook
```javascript
import { useAuth } from '@/utils/useAuth';

export default function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // Will auto-redirect
  
  return <div>Protected Content</div>;
}
```

## Utility Functions

### Token Management (`utils/api.js`)
```javascript
setAdminToken(token)      // Store token in cookie
getAdminToken()          // Retrieve current token
clearAdminToken()        // Remove token from cookie
isTokenValid()           // Check if token is still valid
```

### API Calls (`utils/api.js`)
```javascript
adminGetData(endpoint)           // GET request
adminPostData(endpoint, data)    // POST request
adminPutData(endpoint, data)     // PUT request
adminDeleteData(endpoint)        // DELETE request
```

### Fetch with Auth (`utils/fetchAuth.js`)
```javascript
fetchWithAuth(url, options)      // Universal fetch wrapper
getWithAuth(url, options)        // GET with auth
postWithAuth(url, data)          // POST with auth
putWithAuth(url, data)           // PUT with auth
deleteWithAuth(url)              // DELETE with auth
parseJsonSafely(response)        // Safe JSON parsing
```

## Implementation Details

### Middleware (`middleware.js`)
- Runs on every request
- Checks for `adminToken` cookie
- Allows access to `/admin-login` without token
- Redirects unauthorized requests to login
- Includes redirect parameter for post-login redirect

### API Client Configuration
- Axios instance with interceptors
- Automatic token injection in Authorization header
- 401 response handling with auto-logout
- Error handling and logging

### Security Features
- HTTP-only cookies (when in production)
- Secure flag enabled in production
- SameSite=Strict to prevent CSRF
- Token JWT signature validation
- Token expiration checking

## Environment Setup

### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Requirements
Your backend API should:
1. Issue JWT tokens on successful admin login
2. Include token in response: `{ token: "..." }` or `{ data: { token: "..." } }`
3. Validate Authorization header on protected endpoints
4. Return 401 status for invalid/expired tokens
5. Support token revocation on logout (optional)

## Troubleshooting

### Token Not Being Stored
- Check browser cookies settings
- Ensure NEXT_PUBLIC_API_URL is correct
- Verify backend returns token correctly

### 401 Errors on API Requests
- Check token validity: `console.log(getAdminToken())`
- Verify backend JWT secret is same for signing/verification
- Check middleware logs for auth failures

### Infinite Redirect Loop
- Clear browser cookies
- Ensure login endpoint returns valid token
- Check middleware configuration

### Token Expiration Issues
- Tokens expire after 7 days (configurable in setAdminToken)
- User will be redirected to login on access with expired token
- Use token refresh endpoint if backend supports it

## Best Practices

1. **Always use utility functions** - Never manually add tokens
2. **Handle 401 errors** - Gracefully redirect to login
3. **Clear tokens on logout** - Use clearAdminToken() function
4. **Check authentication before render** - Use useAuth hook
5. **Monitor token expiration** - Implement refresh logic if needed
6. **HTTPS in production** - Essential for secure cookie transmission

## Files Modified/Created

- `utils/api.js` - Main API client with JWT support
- `utils/useAuth.js` - React hook for auth checks
- `utils/fetchAuth.js` - Fetch wrapper with auth
- `middleware.js` - Route protection middleware
- `src/app/admin-login/page.jsx` - Enhanced login with token storage
- `src/app/logout/page.jsx` - Logout with token clearing
- `.env.example` - Environment configuration example
- `next.config.mjs` - Updated with image domain config

## Support

For issues or questions about JWT setup, check:
1. Browser DevTools → Application → Cookies (adminToken)
2. Network tab for Authorization headers
3. Backend logs for token validation errors
4. Frontend console for auth-related messages
