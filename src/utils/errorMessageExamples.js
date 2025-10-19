// Examples of specific error messages that will be shown
// This file demonstrates the different contextual error messages

export const errorMessageExamples = {
  // Organization-related errors
  organization: {
    view: 'You do not have permission to view this organization.',
    create: 'You do not have permission to create organizations.',
    update: 'You do not have permission to update this organization.',
    delete: 'You do not have permission to delete this organization.',
  },
  
  // Namespace-related errors
  namespace: {
    view: 'You do not have permission to view this namespace.',
    create: 'You do not have permission to create namespaces.',
    update: 'You do not have permission to update this namespace.',
    delete: 'You do not have permission to delete this namespace.',
  },
  
  // URL-related errors
  url: {
    view: 'You do not have permission to view this URL.',
    create: 'You do not have permission to create URLs.',
    update: 'You do not have permission to update this URL.',
    delete: 'You do not have permission to delete this URL.',
  },
  
  // Member-related errors
  member: {
    view: 'You do not have permission to view organization members.',
    invite: 'You do not have permission to invite members.',
    update: 'You do not have permission to update member roles.',
    remove: 'You do not have permission to remove members.',
  },
  
  // Special feature errors
  special: {
    analytics: 'You do not have permission to view analytics data.',
    bulkUpload: 'You do not have permission to bulk upload URLs.',
    template: 'You do not have permission to download templates.',
  },
  
  // HTTP status code errors
  statusCodes: {
    400: 'Invalid request. Please check your input.',
    401: 'Please log in to continue.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with existing data.',
    422: 'The provided data is invalid.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
  }
};

// Example usage in components:
/*
import { handleApiError } from '../utils/errorMessages';

// Instead of:
toast.error(error.response?.data?.error || 'Failed to create URL');

// Use:
toast.error(handleApiError(error, 'Failed to create URL'));
*/
