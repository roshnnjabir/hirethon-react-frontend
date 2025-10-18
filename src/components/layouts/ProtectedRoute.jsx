import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check permissions if required
  if (requiredPermissions.length > 0) {
    // This would need to be implemented based on your permission system
    // For now, we'll just check if user exists
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
