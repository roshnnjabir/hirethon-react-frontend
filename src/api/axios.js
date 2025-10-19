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

// Cache for CSRF token to avoid repeated requests
let csrfTokenCache = null;
let csrfTokenTimestamp = 0;
const CSRF_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to fetch CSRF token from backend
const fetchCSRFToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/csrf/`, {
      method: 'GET',
      credentials: 'include', // Include cookies for session-based CSRF
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
  return null;
};

// Request interceptor to add CSRF token with caching
api.interceptors.request.use(
  async (config) => {
    // Skip CSRF token for GET requests and CSRF token endpoint
    if (config.method === 'get' || config.url?.includes('/auth/csrf/')) {
      config.metadata = { startTime: Date.now() };
      return config;
    }
    
    // Get CSRF token from cache or fetch from backend
    const now = Date.now();
    if (!csrfTokenCache || (now - csrfTokenTimestamp) > CSRF_CACHE_DURATION) {
      // Try to get from cookie first
      csrfTokenCache = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      // If not in cookie, fetch from backend
      if (!csrfTokenCache) {
        csrfTokenCache = await fetchCSRFToken();
      }
      
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
    
    // Handle 401 errors with token refresh (but prevent infinite loops)
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest._isRefreshRequest) {
      originalRequest._retry = true;
      
      // Don't retry auth endpoints to prevent infinite loops
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }
      
      try {
        // Try to refresh token
        const refreshRequest = api.post('/auth/refresh/');
        refreshRequest._isRefreshRequest = true; // Mark as refresh request
        
        await refreshRequest;
        
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
