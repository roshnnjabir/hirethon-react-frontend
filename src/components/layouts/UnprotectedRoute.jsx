import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

/**
 * UnprotectedRoute - For public pages like Login/Register
 * Redirects to dashboard if already authenticated
 */
const UnprotectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (user) {
    // User is already logged in, redirect to dashboard or the page they were trying to access
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default UnprotectedRoute;
