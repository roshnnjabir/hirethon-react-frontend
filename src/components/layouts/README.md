# Route Protection Components

This directory contains components for handling route protection in the application.

## Components

### ProtectedRoute
Protects routes that require authentication. Redirects unauthenticated users to the login page.

**Props:**
- `children`: The component to render if user is authenticated
- `requiredPermissions` (optional): Array of permissions required to access the route
- `fallbackPath` (optional): Path to redirect to if not authenticated (default: '/login')

**Usage:**
```jsx
<ProtectedRoute requiredPermissions={['admin']}>
  <AdminPanel />
</ProtectedRoute>
```

### UnprotectedRoute
Protects routes that should only be accessible to unauthenticated users (like login, register pages). Redirects authenticated users away from these pages.

**Props:**
- `children`: The component to render if user is not authenticated
- `redirectTo` (optional): Path to redirect to if user is authenticated (default: '/dashboard')

**Usage:**
```jsx
<UnprotectedRoute>
  <Login />
</UnprotectedRoute>
```

### DefaultRedirect
Handles default routing based on authentication state. Redirects authenticated users to dashboard and unauthenticated users to login.

**Usage:**
```jsx
<Route path="/" element={<DefaultRedirect />} />
```

## Route Types

### Protected Routes
Routes that require authentication:
- `/dashboard` - Main dashboard
- `/org/:orgId` - Organization details
- `/org/:orgId/namespaces` - Namespace list
- `/org/:orgId/namespaces/:namespaceId` - Namespace details
- `/org/:orgId/namespaces/:namespaceId/url/:urlId` - URL details
- `/settings/profile` - Profile settings

### Unprotected Routes
Routes that should only be accessible to unauthenticated users:
- `/login` - Login page
- `/register` - Registration page
- `/invite/:token` - Invite acceptance page

### Public Routes
Routes that are accessible to everyone:
- `/:namespace/:shortcode` - URL redirect handler

## Authentication Flow

1. **App loads**: `AuthContext` checks authentication status
2. **Unauthenticated user visits protected route**: Redirected to `/login`
3. **Authenticated user visits unprotected route**: Redirected to `/dashboard` (or previous location)
4. **User visits root `/`**: Redirected based on authentication state
5. **404 routes**: Redirected based on authentication state

## Permission System (Future Enhancement)

The `ProtectedRoute` component is prepared for a permission system where specific routes can require certain permissions:

```jsx
<ProtectedRoute requiredPermissions={['admin', 'moderator']}>
  <AdminPanel />
</ProtectedRoute>
```

This would check if the user has the required permissions before allowing access to the route.
