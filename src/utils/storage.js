// Local storage utilities
export const storage = {
  // Set item in localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get item from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Session storage utilities
export const sessionStorage = {
  // Set item in sessionStorage
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  // Get item from sessionStorage
  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  },

  // Remove item from sessionStorage
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },

  // Clear all sessionStorage
  clear: () => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },
};

// Cookie utilities
export const cookies = {
  // Set cookie
  set: (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  // Get cookie
  get: (name) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Remove cookie
  remove: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};

// Storage keys - Only UI preferences, NO authentication data
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  THEME: 'theme',
  // ❌ Removed authentication-related keys:
  // ACTIVE_ORGANIZATION: 'active_organization',
  // ACTIVE_NAMESPACE: 'active_namespace', 
  // RECENT_ORGANIZATIONS: 'recent_organizations',
};

// User preferences storage
export const userPreferences = {
  get: () => storage.get(STORAGE_KEYS.USER_PREFERENCES, {}),
  set: (preferences) => storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences),
  update: (updates) => {
    const current = userPreferences.get();
    userPreferences.set({ ...current, ...updates });
  },
};

// ❌ Removed authentication-related storage functions
// Organization and namespace data should be fetched from API on each session
// and stored in React state only, not in localStorage

// Theme storage
export const theme = {
  get: () => storage.get(STORAGE_KEYS.THEME, 'light'),
  set: (themeName) => storage.set(STORAGE_KEYS.THEME, themeName),
};

// ❌ Removed recent organizations storage
// Recent organizations should be fetched from API and stored in React state only

// Security utility to clear any existing authentication data from localStorage
export const clearAuthData = () => {
  try {
    // Clear any potential authentication-related localStorage keys
    const authKeys = [
      'auth-storage',
      'auth_storage', 
      'authStorage',
      'jwt_token',
      'access_token',
      'refresh_token',
      'user_token',
      'auth_token',
      'token',
      'active_organization',
      'active_namespace',
      'recent_organizations'
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Cleared authentication data from localStorage');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
