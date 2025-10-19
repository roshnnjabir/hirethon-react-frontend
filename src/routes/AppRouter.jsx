import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const AppRouter = () => {
  return (
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
  );
};

export default AppRouter;
