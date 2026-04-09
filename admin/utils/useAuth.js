import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken, isTokenValid, clearAdminToken } from './api';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAdminToken();
      
      if (!token || !isTokenValid()) {
        clearAdminToken();
        setIsAuthenticated(false);
        router.push('/admin-login');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    // Check token validity every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  return { isAuthenticated, isLoading };
};

export default useAuth;
