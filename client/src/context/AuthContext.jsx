'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Middleware handles redirects; context keeps UI auth/user info in sync with cookies.
    const token = Cookies.get('accessToken');
    const nameFromCookie = Cookies.get('userName') || '';
    const emailFromCookie = Cookies.get('userEmail') || '';

    setIsAuthenticated(Boolean(token));
    setUserName(nameFromCookie);
    setUserEmail(emailFromCookie);

    setLoading(false);
  }, [pathname]);

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userName');
    Cookies.remove('userEmail');
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    userName,
    userEmail,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
