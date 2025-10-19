import { useEffect } from 'react';
import { useAuth } from './useAuth';
import api from '../api/axios';

// Custom hook for making authenticated API requests
export const useAxiosPrivate = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Listen for auth logout events
    const handleAuthLogout = () => {
      // Clear any pending requests or state
      console.log('Auth logout event received');
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  return api;
};
