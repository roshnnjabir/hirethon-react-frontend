# Logout Functionality Guide

This guide explains how to implement logout functionality throughout the application using the reusable logout system.

## Overview

The logout system provides three main ways to handle user logout:

1. **LogoutButton Component** - A reusable button component
2. **useLogout Hook** - A custom hook for programmatic logout
3. **Logout Route** - A dedicated route for automatic logout

## Components

### 1. LogoutButton Component

A reusable button component that handles logout with consistent styling and behavior.

```jsx
import LogoutButton from '../components/common/LogoutButton';

// Basic usage
<LogoutButton>Sign Out</LogoutButton>

// With custom styling
<LogoutButton
  variant="outline"
  size="lg"
  className="text-red-600 border-red-200 hover:bg-red-50"
  showIcon={true}
>
  Logout
</LogoutButton>
```

**Props:**
- `variant`: Button variant (default: 'ghost')
- `size`: Button size (default: 'sm')
- `showIcon`: Show logout icon (default: true)
- `children`: Button text (default: 'Logout')
- `className`: Additional CSS classes
- `onLogout`: Success callback function

### 2. useLogout Hook

A custom hook that provides programmatic logout functionality with full control over the logout process.

```jsx
import { useLogout } from '../hooks/useLogout';

const MyComponent = () => {
  const { handleLogout } = useLogout();

  const handleCustomLogout = async () => {
    await handleLogout({
      showToast: true,
      redirectTo: '/login',
      toastMessage: 'You have been logged out successfully',
      onSuccess: () => console.log('Logout successful'),
      onError: (error) => console.error('Logout failed:', error)
    });
  };

  return (
    <button onClick={handleCustomLogout}>
      Custom Logout
    </button>
  );
};
```

**Options:**
- `showToast`: Show success toast (default: true)
- `redirectTo`: Redirect route after logout (default: '/login')
- `toastMessage`: Custom toast message
- `onSuccess`: Success callback function
- `onError`: Error callback function

### 3. Logout Route

A dedicated route (`/logout`) that automatically logs out the user and shows a loading state.

```jsx
// Navigate to logout route
navigate('/logout');

// Or use Link component
<Link to="/logout">Logout</Link>
```

## Implementation Examples

### Navigation Menu

```jsx
<div className="user-menu">
  <Link to="/profile">Profile</Link>
  <Link to="/settings">Settings</Link>
  <LogoutButton
    variant="ghost"
    className="w-full justify-start"
    showIcon={true}
  >
    Sign out
  </LogoutButton>
</div>
```

### Header Actions

```jsx
<div className="header-actions">
  <Button variant="outline">Settings</Button>
  <LogoutButton
    variant="outline"
    className="text-red-600 border-red-200 hover:bg-red-50"
  >
    Logout
  </LogoutButton>
</div>
```

### Programmatic Logout

```jsx
const { handleLogout } = useLogout();

// Auto-logout on session timeout
useEffect(() => {
  const timer = setTimeout(() => {
    handleLogout({
      showToast: true,
      toastMessage: 'Session expired. Please log in again.'
    });
  }, 30 * 60 * 1000); // 30 minutes

  return () => clearTimeout(timer);
}, [handleLogout]);
```

### Custom Logout with Confirmation

```jsx
const handleLogoutWithConfirmation = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    handleLogout({
      showToast: true,
      toastMessage: 'You have been logged out successfully'
    });
  }
};
```

## Integration Points

The logout functionality is already integrated in:

1. **Navbar Component** - User dropdown menu
2. **Settings Sidebar** - Footer logout button
3. **Mobile Menu** - Mobile navigation

## Security Features

- Clears all authentication data from localStorage
- Invalidates server-side session
- Redirects to login page
- Shows loading states during logout process
- Handles logout errors gracefully

## Best Practices

1. **Use LogoutButton** for consistent UI/UX across the app
2. **Use useLogout hook** for custom implementations
3. **Always show loading states** during logout process
4. **Provide user feedback** with toast messages
5. **Handle errors gracefully** with fallback behavior
6. **Clear sensitive data** on logout

## Error Handling

The logout system handles various error scenarios:

- Network errors during logout API call
- Server-side logout failures
- Navigation errors
- Session cleanup failures

All errors are logged to console and user-friendly messages are shown via toast notifications.

## Testing

To test logout functionality:

1. **Manual Testing**: Click logout buttons throughout the app
2. **Route Testing**: Navigate to `/logout` directly
3. **Programmatic Testing**: Use the useLogout hook in components
4. **Error Testing**: Simulate network failures during logout

## Future Enhancements

Potential improvements to the logout system:

1. **Confirmation Dialogs**: Add optional confirmation before logout
2. **Session Management**: Integrate with session timeout handling
3. **Multi-tab Logout**: Sync logout across browser tabs
4. **Analytics**: Track logout events for user behavior analysis
5. **Custom Redirects**: Support for different redirect routes based on context
