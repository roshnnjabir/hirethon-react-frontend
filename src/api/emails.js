import api from './axios';

export const emailsAPI = {
  // Send welcome email
  sendWelcomeEmail: async (userId) => {
    const response = await api.post('/emails/welcome/', { user_id: userId });
    return response.data;
  },

  // Send organization invite email
  sendOrganizationInviteEmail: async (inviteId) => {
    const response = await api.post('/emails/organization-invite/', { invite_id: inviteId });
    return response.data;
  },

  // Send password reset email
  sendPasswordResetEmail: async (userId, resetToken) => {
    const response = await api.post('/emails/password-reset/', { 
      user_id: userId, 
      reset_token: resetToken 
    });
    return response.data;
  },

  // Send analytics report email
  sendAnalyticsReportEmail: async (userId, reportData = {}) => {
    const response = await api.post('/emails/analytics-report/', { 
      user_id: userId, 
      report_data: reportData 
    });
    return response.data;
  },

  // Send custom email
  sendCustomEmail: async (toEmails, subject, templateName, context = {}) => {
    const response = await api.post('/emails/custom/', {
      to_emails: toEmails,
      subject: subject,
      template_name: templateName,
      context: context
    });
    return response.data;
  },

  // Check task status
  checkTaskStatus: async (taskId) => {
    const response = await api.get(`/urls/task_status/?task_id=${taskId}`);
    return response.data;
  }
};
