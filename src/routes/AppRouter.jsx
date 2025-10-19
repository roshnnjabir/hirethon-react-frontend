import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layouts/ProtectedRoute';
import UnprotectedRoute from '../components/layouts/UnprotectedRoute';
import Spinner from '../components/common/Spinner';

// Lazy load pages for better performance
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const InviteAccept = lazy(() => import('../pages/auth/InviteAccept'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const URLsPage = lazy(() => import('../pages/urls/URLsPage'));
const AnalyticsPage = lazy(() => import('../pages/analytics/AnalyticsPage'));
const ProfileSettings = lazy(() => import('../pages/settings/ProfileSettings'));
const RedirectHandler = lazy(() => import('../pages/url/RedirectHandler'));
const AccessDenied = lazy(() => import('../pages/AccessDenied'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-neutral-600">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes - Redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <UnprotectedRoute>
              <Login />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <UnprotectedRoute>
              <Register />
            </UnprotectedRoute>
          }
        />
        
        {/* Invite acceptance - accessible to both logged in and logged out users */}
        <Route path="/invite/:token" element={<InviteAccept />} />
        
        {/* Access Denied page - shown when user doesn't have permission */}
        <Route path="/access-denied" element={<AccessDenied />} />
        
        {/* URL Redirect Route (Public) - catches /:namespace/:shortcode */}
        <Route path="/:namespace/:shortcode" element={<RedirectHandler />} />
        
        {/* Protected Routes - Require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/urls"
          element={
            <ProtectedRoute>
              <URLsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
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
    </Suspense>
  );
};

export default AppRouter;
