# Error Handling System

This document explains the comprehensive error handling system implemented to provide specific, contextual error messages instead of generic ones.

## Overview

Instead of showing generic "You do not have permission to perform this action" messages, the system now provides specific, actionable error messages based on:

- **Endpoint**: Which API endpoint was called
- **HTTP Method**: What action was attempted (GET, POST, PATCH, DELETE)
- **HTTP Status Code**: The specific error code returned
- **Context**: The resource being accessed (organization, namespace, URL, etc.)

## Components

### 1. Error Message Mapping (`errorMessages.js`)

The core utility that maps different scenarios to specific error messages:

```javascript
import { getContextualErrorMessage, handleApiError } from '../utils/errorMessages';

// Get contextual error message
const message = getContextualErrorMessage(error);

// Use in components with fallback
toast.error(handleApiError(error, 'Failed to create URL'));
```

### 2. Axios Interceptor (`axios.js`)

Automatically handles errors globally and shows appropriate messages:

- **403 Forbidden**: Shows specific permission messages based on endpoint
- **404 Not Found**: "The requested resource was not found"
- **400 Bad Request**: "Invalid request. Please check your input"
- **409 Conflict**: "This action conflicts with existing data"
- **422 Unprocessable Entity**: "The provided data is invalid"
- **429 Too Many Requests**: "Too many requests. Please try again later"
- **500+ Server Errors**: "Server error. Please try again later"

### 3. Component Integration

Components can use the `handleApiError` helper for consistent error handling:

```javascript
// Before
onError: (error) => {
  toast.error(error.response?.data?.error || 'Failed to create URL');
}

// After
onError: (error) => {
  toast.error(handleApiError(error, 'Failed to create URL'));
}
```

## Specific Error Messages

### Organization Operations
- **View**: "You do not have permission to view this organization."
- **Create**: "You do not have permission to create organizations."
- **Update**: "You do not have permission to update this organization."
- **Delete**: "You do not have permission to delete this organization."

### Namespace Operations
- **View**: "You do not have permission to view this namespace."
- **Create**: "You do not have permission to create namespaces."
- **Update**: "You do not have permission to update this namespace."
- **Delete**: "You do not have permission to delete this namespace."

### URL Operations
- **View**: "You do not have permission to view this URL."
- **Create**: "You do not have permission to create URLs."
- **Update**: "You do not have permission to update this URL."
- **Delete**: "You do not have permission to delete this URL."

### Member Operations
- **View**: "You do not have permission to view organization members."
- **Invite**: "You do not have permission to invite members."
- **Update**: "You do not have permission to update member roles."
- **Remove**: "You do not have permission to remove members."

### Special Features
- **Analytics**: "You do not have permission to view analytics data."
- **Bulk Upload**: "You do not have permission to bulk upload URLs."
- **Templates**: "You do not have permission to download templates."

## Implementation Examples

### Global Error Handling (Axios Interceptor)
```javascript
// Automatically handles all API errors
if (error.response?.status === 403) {
  const specificMessage = getContextualErrorMessage(error);
  toast.error(specificMessage);
}
```

### Component Error Handling
```javascript
// In mutation error handlers
const createMutation = useMutation({
  mutationFn: createURL,
  onError: (error) => {
    toast.error(handleApiError(error, 'Failed to create URL'));
  }
});
```

### Custom Error Messages
```javascript
// For specific scenarios
const customError = getSpecificErrorMessage('/organizations/123/', 'DELETE', 403);
// Returns: "You do not have permission to delete this organization."
```

## Benefits

1. **User-Friendly**: Clear, specific messages instead of generic ones
2. **Actionable**: Users understand exactly what they can't do
3. **Contextual**: Messages are relevant to the specific action attempted
4. **Consistent**: Same error handling across all components
5. **Maintainable**: Centralized error message logic
6. **Extensible**: Easy to add new error types and messages

## Migration Guide

### For Existing Components

1. **Import the utility**:
   ```javascript
   import { handleApiError } from '../utils/errorMessages';
   ```

2. **Update error handlers**:
   ```javascript
   // Before
   toast.error(error.response?.data?.error || 'Generic error message');
   
   // After
   toast.error(handleApiError(error, 'Generic error message'));
   ```

3. **Remove manual error parsing**:
   ```javascript
   // Before
   const errorMessage = error.response?.data?.error || 
                       error.response?.data?.message || 
                       'Something went wrong';
   
   // After
   const errorMessage = handleApiError(error, 'Something went wrong');
   ```

### For New Components

Always use `handleApiError` for consistent error handling:

```javascript
import { handleApiError } from '../utils/errorMessages';

const MyComponent = () => {
  const mutation = useMutation({
    mutationFn: myApiCall,
    onError: (error) => {
      toast.error(handleApiError(error, 'Operation failed'));
    }
  });
};
```

## Testing

The error handling system can be tested by:

1. **Simulating different HTTP status codes**
2. **Testing different endpoints and methods**
3. **Verifying specific error messages are shown**
4. **Ensuring fallback messages work correctly**

## Future Enhancements

- **Internationalization**: Support for multiple languages
- **Error Categories**: Group similar errors for better UX
- **Retry Logic**: Automatic retry for certain error types
- **Error Analytics**: Track common errors for improvement
- **Custom Error Pages**: Dedicated pages for specific error types
