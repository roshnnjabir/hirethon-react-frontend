// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

// Organization Permissions
export const PERMISSIONS = {
  CREATE_NAMESPACE: 'create_namespace',
  EDIT_NAMESPACE: 'edit_namespace',
  DELETE_NAMESPACE: 'delete_namespace',
  CREATE_URL: 'create_url',
  EDIT_URL: 'edit_url',
  DELETE_URL: 'delete_url',
  INVITE_MEMBERS: 'invite_members',
  MANAGE_MEMBERS: 'manage_members',
  VIEW_ANALYTICS: 'view_analytics',
};

// Role-Permission Mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.CREATE_NAMESPACE,
    PERMISSIONS.EDIT_NAMESPACE,
    PERMISSIONS.DELETE_NAMESPACE,
    PERMISSIONS.CREATE_URL,
    PERMISSIONS.EDIT_URL,
    PERMISSIONS.DELETE_URL,
    PERMISSIONS.INVITE_MEMBERS,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [USER_ROLES.EDITOR]: [
    PERMISSIONS.CREATE_URL,
    PERMISSIONS.EDIT_URL,
    PERMISSIONS.DELETE_URL,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [USER_ROLES.VIEWER]: [
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

// URL Status
export const URL_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  DISABLED: 'disabled',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ],
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully!',
    REGISTER: 'Registration successful!',
    CREATE_ORG: 'Organization created successfully!',
    CREATE_NAMESPACE: 'Namespace created successfully!',
    CREATE_URL: 'Short URL created successfully!',
    UPDATE_URL: 'URL updated successfully!',
    DELETE_URL: 'URL deleted successfully!',
    INVITE_SENT: 'Invitation sent successfully!',
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    NETWORK_ERROR: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload an Excel file.',
  },
};
