import api from './axios';

export const authAPI = {
  // Get CSRF token
  getCSRFToken: async () => {
    const response = await api.get('/auth/csrf/');
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login/', {
      email,
      password,
    });
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/rest-auth/registration/', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh/');
    return response.data;
  },

  // Accept organization invite
  acceptInvite: async (token, userData) => {
    const response = await api.post(`/invite/${token}/`, userData);
    return response.data;
  },
};
