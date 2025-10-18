import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with performance optimizations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // Important for HTTP-only cookies
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache for CSRF token to avoid repeated cookie parsing
let csrfTokenCache = null;
let csrfTokenTimestamp = 0;
const CSRF_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Request interceptor to add CSRF token with caching
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cache or cookie
    const now = Date.now();
    if (!csrfTokenCache || (now - csrfTokenTimestamp) > CSRF_CACHE_DURATION) {
      csrfTokenCache = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      csrfTokenTimestamp = now;
    }
    
    if (csrfTokenCache) {
      config.headers['X-CSRFToken'] = csrfTokenCache;
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    // Log slow requests in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      if (duration > 1000) {
        console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
      }
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        await api.post('/auth/refresh/');
        
        // Clear CSRF token cache to force refresh
        csrfTokenCache = null;
        csrfTokenTimestamp = 0;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth state and redirect
        csrfTokenCache = null;
        csrfTokenTimestamp = 0;
        
        // Dispatch custom event for auth state cleanup
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors with user-friendly messages
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
