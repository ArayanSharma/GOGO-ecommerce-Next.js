'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Function to check if JWT token is valid and not expired
function isTokenValid(token) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// Function to refresh access token using refresh token
async function refreshAccessToken() {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/user/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log('Token refresh failed');
      return null;
    }

    const data = await response.json();
    if (data.accessToken) {
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('accessToken');
      const nameFromCookie = Cookies.get('userName') || '';
      const emailFromCookie = Cookies.get('userEmail') || '';

      if (token && isTokenValid(token)) {
        setIsAuthenticated(true);
        setUserName(nameFromCookie);
        setUserEmail(emailFromCookie);
      } else if (token && !isTokenValid(token)) {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          setIsAuthenticated(true);
          setUserName(nameFromCookie);
          setUserEmail(emailFromCookie);
        } else {
          // Refresh failed, clear auth
          clearAuth();
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initializeAuth();
  }, [pathname]);

  // Set up periodic token refresh (every 5 minutes)
  useEffect(() => {
    const tokenRefreshInterval = setInterval(async () => {
      const token = Cookies.get('accessToken');
      if (token && !isTokenValid(token)) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          clearAuth();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const clearAuth = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userName');
    Cookies.remove('userEmail');
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    userName,
    userEmail,
    loading,
    logout,
    isTokenValid,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
