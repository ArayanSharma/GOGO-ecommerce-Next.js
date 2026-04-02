'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has a valid token
    const token = Cookies.get('accessToken');
    
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);

      // Protected routes that require authentication
      const protectedRoutes = ['/', '/cart', '/wishlist', '/products', '/productdet'];
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
      );

      // If accessing protected route without token, redirect to login
      if (isProtectedRoute && pathname !== '/login') {
        router.push('/login');
      }
    }

    setLoading(false);
  }, [pathname, router]);

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userEmail');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
