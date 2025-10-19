// Error message mapping for different API endpoints and actions
export const getSpecificErrorMessage = (url, method, statusCode) => {
  const endpoint = url.toLowerCase();
  const httpMethod = method.toLowerCase();

  // Helper function to extract resource name from URL
  const getResourceName = (url) => {
    if (url.includes('/organizations/')) return 'organization';
    if (url.includes('/namespaces/')) return 'namespace';
    if (url.includes('/urls/')) return 'URL';
    if (url.includes('/members/')) return 'member';
    if (url.includes('/invite/')) return 'invitation';
    return 'resource';
  };

  // Helper function to get action name from HTTP method
  const getActionName = (method) => {
    switch (method) {
      case 'get': return 'view';
      case 'post': return 'create';
      case 'patch':
      case 'put': return 'update';
      case 'delete': return 'delete';
      default: return 'access';
    }
  };

  const resourceName = getResourceName(endpoint);
  const actionName = getActionName(httpMethod);

  // Specific error messages based on endpoint and action
  if (endpoint.includes('/organizations/')) {
    if (httpMethod === 'get') {
      return 'You do not have permission to view this organization.';
    } else if (httpMethod === 'post') {
      return 'You do not have permission to create organizations.';
    } else if (httpMethod === 'patch' || httpMethod === 'put') {
      return 'You do not have permission to update this organization.';
    } else if (httpMethod === 'delete') {
      return 'You do not have permission to delete this organization.';
    }
  }

  if (endpoint.includes('/namespaces/')) {
    if (httpMethod === 'get') {
      return 'You do not have permission to view this namespace.';
    } else if (httpMethod === 'post') {
      return 'You do not have permission to create namespaces.';
    } else if (httpMethod === 'patch' || httpMethod === 'put') {
      return 'You do not have permission to update this namespace.';
    } else if (httpMethod === 'delete') {
      return 'You do not have permission to delete this namespace.';
    }
  }

  if (endpoint.includes('/urls/')) {
    if (httpMethod === 'get') {
      return 'You do not have permission to view this URL.';
    } else if (httpMethod === 'post') {
      return 'You do not have permission to create URLs.';
    } else if (httpMethod === 'patch' || httpMethod === 'put') {
      return 'You do not have permission to update this URL.';
    } else if (httpMethod === 'delete') {
      return 'You do not have permission to delete this URL.';
    }
  }

  if (endpoint.includes('/members/')) {
    if (httpMethod === 'get') {
      return 'You do not have permission to view organization members.';
    } else if (httpMethod === 'post') {
      return 'You do not have permission to invite members.';
    } else if (httpMethod === 'patch' || httpMethod === 'put') {
      return 'You do not have permission to update member roles.';
    } else if (httpMethod === 'delete') {
      return 'You do not have permission to remove members.';
    }
  }

  if (endpoint.includes('/invite/')) {
    if (httpMethod === 'get') {
      return 'You do not have permission to view this invitation.';
    } else if (httpMethod === 'post') {
      return 'You do not have permission to accept this invitation.';
    }
  }

  if (endpoint.includes('/analytics/')) {
    return 'You do not have permission to view analytics data.';
  }

  if (endpoint.includes('/bulk_create/')) {
    return 'You do not have permission to bulk upload URLs.';
  }

  if (endpoint.includes('/template/')) {
    return 'You do not have permission to download templates.';
  }

  // Fallback to generic message with context
  return `You do not have permission to ${actionName} this ${resourceName}.`;
};

// Error messages for different HTTP status codes
export const getStatusCodeMessage = (statusCode) => {
  switch (statusCode) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with existing data.';
    case 422:
      return 'The provided data is invalid.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Service temporarily unavailable.';
    case 503:
      return 'Service is currently unavailable.';
    default:
      return 'An unexpected error occurred.';
  }
};

// Get contextual error message from API response
export const getContextualErrorMessage = (error) => {
  // Handle Django validation errors (field-specific errors)
  if (error.response?.data && typeof error.response.data === 'object') {
    // Check for field-specific validation errors like {"email": ["error message"]}
    const fieldErrors = [];
    for (const [field, messages] of Object.entries(error.response.data)) {
      if (Array.isArray(messages)) {
        fieldErrors.push(...messages);
      } else if (typeof messages === 'string') {
        fieldErrors.push(messages);
      }
    }
    
    if (fieldErrors.length > 0) {
      return fieldErrors.join('. ');
    }
    
    // Check for non_field_errors
    if (error.response.data.non_field_errors) {
      return Array.isArray(error.response.data.non_field_errors) 
        ? error.response.data.non_field_errors.join('. ')
        : error.response.data.non_field_errors;
    }
  }
  
  // First, try to get specific error from response data
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }

  // If no specific message, use our mapping
  if (error.response?.status === 403 && error.config?.url && error.config?.method) {
    return getSpecificErrorMessage(error.config.url, error.config.method, error.response.status);
  }

  // Fallback to status code message
  if (error.response?.status) {
    return getStatusCodeMessage(error.response.status);
  }

  // Network or other errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please check your connection.';
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

// Helper function for components to use contextual error messages
export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  const contextualMessage = getContextualErrorMessage(error);
  return contextualMessage || fallbackMessage;
};
