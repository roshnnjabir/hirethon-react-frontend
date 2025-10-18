import api from './axios';

export const shorturlsAPI = {
  // Create short URL
  createShortURL: async (urlData) => {
    const response = await api.post('/urls/', urlData);
    return response.data;
  },

  // Get short URL details
  getShortURL: async (urlId) => {
    const response = await api.get(`/urls/${urlId}/`);
    return response.data;
  },

  // Update short URL
  updateShortURL: async (urlId, urlData) => {
    const response = await api.patch(`/urls/${urlId}/`, urlData);
    return response.data;
  },

  // Delete short URL
  deleteShortURL: async (urlId) => {
    const response = await api.delete(`/urls/${urlId}/`);
    return response.data;
  },

  // Get all URLs for current user
  getURLs: async (params = {}) => {
    const response = await api.get('/urls/', { params });
    return response.data;
  },

  // Bulk upload URLs from Excel
  bulkUpload: async (file, namespaceId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('namespace', namespaceId);
    
    const response = await api.post('/urls/bulk_create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download bulk upload template
  downloadTemplate: async () => {
    const response = await api.get('/urls/template/', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Resolve short URL (for redirect)
  resolveURL: async (namespace, shortcode) => {
    const response = await api.get(`/${namespace}/${shortcode}/`);
    return response.data;
  },

  // Get URL analytics
  getURLAnalytics: async (urlId, params = {}) => {
    const response = await api.get(`/urls/${urlId}/analytics/`, {
      params,
    });
    return response.data;
  },

  // Get URL info (for redirect page)
  getURLInfo: async (namespace, shortcode) => {
    const response = await api.get(`/${namespace}/${shortcode}/info/`);
    return response.data;
  },
};
