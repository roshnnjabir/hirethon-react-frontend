import api from './axios';

export const namespacesAPI = {
  // Get all namespaces for current user
  getNamespaces: async () => {
    const response = await api.get('/namespaces/');
    return response.data;
  },

  // Create new namespace
  createNamespace: async (namespaceData) => {
    const response = await api.post('/namespaces/', namespaceData);
    return response.data;
  },

  // Get namespace details
  getNamespace: async (namespaceId) => {
    const response = await api.get(`/namespaces/${namespaceId}/`);
    return response.data;
  },

  // Update namespace
  updateNamespace: async (namespaceId, namespaceData) => {
    const response = await api.patch(`/namespaces/${namespaceId}/`, namespaceData);
    return response.data;
  },

  // Delete namespace
  deleteNamespace: async (namespaceId) => {
    const response = await api.delete(`/namespaces/${namespaceId}/`);
    return response.data;
  },

  // Check namespace availability
  checkAvailability: async (name) => {
    const response = await api.get(`/namespaces/check_availability/?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Get URLs in namespace
  getNamespaceURLs: async (namespaceId, params = {}) => {
    const response = await api.get(`/namespaces/${namespaceId}/urls/`, {
      params,
    });
    return response.data;
  },
};
