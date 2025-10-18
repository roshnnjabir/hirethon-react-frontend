import { useEffect } from 'react';
import { useAuth } from './useAuth';
import api from '../api/axios';

// Custom hook for making authenticated API requests
export const useAxiosPrivate = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Add request interceptor to include auth headers if needed
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // The axios instance already handles cookies automatically
        // This is just for any additional auth logic if needed
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for auth errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            await api.post('/auth/refresh/');
            
            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            if (isAuthenticated) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated]);

  return api;
};
