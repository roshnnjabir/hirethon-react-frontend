import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { OrgProvider } from '../contexts/OrgContext';
import ProtectedRoute from '../components/layouts/ProtectedRoute';

// Import pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import InviteAccept from '../pages/auth/InviteAccept';
import DashboardHome from '../pages/dashboard/DashboardHome';
import OrganizationDetail from '../pages/dashboard/OrganizationDetail';
import NamespaceList from '../pages/dashboard/NamespaceList';
import NamespaceDetail from '../pages/dashboard/NamespaceDetail';
import ShortURLDetail from '../pages/dashboard/ShortURLDetail';
import ProfileSettings from '../pages/settings/ProfileSettings';
import RedirectHandler from '../pages/url/RedirectHandler';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrgProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/invite/:token" element={<InviteAccept />} />
              
              {/* URL Redirect Route (Public) */}
              <Route path="/:namespace/:shortcode" element={<RedirectHandler />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/org/:orgId"
                element={
                  <ProtectedRoute>
                    <OrganizationDetail />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/org/:orgId/namespaces"
                element={
                  <ProtectedRoute>
                    <NamespaceList />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/org/:orgId/namespaces/:namespaceId"
                element={
                  <ProtectedRoute>
                    <NamespaceDetail />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/org/:orgId/namespaces/:namespaceId/url/:urlId"
                element={
                  <ProtectedRoute>
                    <ShortURLDetail />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </OrgProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppRouter;
