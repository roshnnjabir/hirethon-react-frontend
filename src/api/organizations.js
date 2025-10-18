import api from './axios';

export const organizationsAPI = {
  // Get all organizations for current user
  getOrganizations: async () => {
    const response = await api.get('/organizations/');
    return response.data;
  },

  // Create new organization
  createOrganization: async (orgData) => {
    const response = await api.post('/organizations/', orgData);
    return response.data;
  },

  // Get organization details
  getOrganization: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/`);
    return response.data;
  },

  // Update organization
  updateOrganization: async (orgId, orgData) => {
    const response = await api.patch(`/organizations/${orgId}/`, orgData);
    return response.data;
  },

  // Delete organization
  deleteOrganization: async (orgId) => {
    const response = await api.delete(`/organizations/${orgId}/`);
    return response.data;
  },

  // Invite user to organization
  inviteUser: async (orgId, email, role = 'viewer') => {
    const response = await api.post(`/organizations/${orgId}/invite_member/`, {
      email,
      role,
    });
    return response.data;
  },

  // Get organization members
  getMembers: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/members/`);
    return response.data;
  },

  // Update member role
  updateMemberRole: async (orgId, userId, role) => {
    const response = await api.patch(`/organizations/${orgId}/members/${userId}/`, {
      role,
    });
    return response.data;
  },

  // Remove member from organization
  removeMember: async (orgId, userId) => {
    const response = await api.post(`/organizations/${orgId}/remove_member/`, {
      user_id: userId,
    });
    return response.data;
  },

  // Verify invite token
  verifyInvite: async (token) => {
    const response = await api.get(`/organizations/verify_invite/${token}/`);
    return response.data;
  },

  // Accept invite
  acceptInvite: async (token, userData) => {
    const response = await api.post(`/organizations/accept_invite/${token}/`, userData);
    return response.data;
  },
};
