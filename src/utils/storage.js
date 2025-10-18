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

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  ACTIVE_ORGANIZATION: 'active_organization',
  ACTIVE_NAMESPACE: 'active_namespace',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  THEME: 'theme',
  RECENT_ORGANIZATIONS: 'recent_organizations',
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

// Active organization storage
export const activeOrganization = {
  get: () => storage.get(STORAGE_KEYS.ACTIVE_ORGANIZATION),
  set: (orgId) => storage.set(STORAGE_KEYS.ACTIVE_ORGANIZATION, orgId),
  clear: () => storage.remove(STORAGE_KEYS.ACTIVE_ORGANIZATION),
};

// Active namespace storage
export const activeNamespace = {
  get: () => storage.get(STORAGE_KEYS.ACTIVE_NAMESPACE),
  set: (namespaceId) => storage.set(STORAGE_KEYS.ACTIVE_NAMESPACE, namespaceId),
  clear: () => storage.remove(STORAGE_KEYS.ACTIVE_NAMESPACE),
};

// Theme storage
export const theme = {
  get: () => storage.get(STORAGE_KEYS.THEME, 'light'),
  set: (themeName) => storage.set(STORAGE_KEYS.THEME, themeName),
};

// Recent organizations storage
export const recentOrganizations = {
  get: () => storage.get(STORAGE_KEYS.RECENT_ORGANIZATIONS, []),
  add: (orgId) => {
    const recent = recentOrganizations.get();
    const updated = [orgId, ...recent.filter(id => id !== orgId)].slice(0, 5);
    storage.set(STORAGE_KEYS.RECENT_ORGANIZATIONS, updated);
  },
  clear: () => storage.remove(STORAGE_KEYS.RECENT_ORGANIZATIONS),
};
