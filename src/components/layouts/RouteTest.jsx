import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

// This component can be temporarily added to any page to test routing behavior
const RouteTest = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border text-sm">
      <h3 className="font-semibold mb-2">Route Test Info</h3>
      <div className="space-y-1">
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? user.email : 'None'}</div>
        <div><strong>Current Path:</strong> {location.pathname}</div>
        <div><strong>From State:</strong> {location.state?.from?.pathname || 'None'}</div>
      </div>
    </div>
  );
};

export default RouteTest;
