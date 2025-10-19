import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AccessDenied = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  // Get and decode query parameters
  const rawMessage = searchParams.get('message');
  const message = rawMessage ? decodeURIComponent(rawMessage) : 'You do not have permission to access this resource';
  const organization = searchParams.get('org') ? decodeURIComponent(searchParams.get('org')) : null;
  const url = searchParams.get('url') ? decodeURIComponent(searchParams.get('url')) : null;
  
  // Debug: Log query params
  console.log('Access Denied - Query params:', {
    rawMessage,
    message,
    organization,
    url,
    allParams: Object.fromEntries(searchParams)
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-error-600" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Access Denied
        </h1>
        
        {/* Message */}
        <p className="text-neutral-600 mb-6">
          {message}
        </p>
        
        {/* Organization Info */}
        {organization && (
          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-neutral-700">
              This private link belongs to <strong className="text-neutral-900">{organization}</strong>.
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              You need to be a member of this organization to access it.
            </p>
          </div>
        )}
        
        {/* URL Info */}
        {url && (
          <p className="text-xs text-neutral-400 mb-6">
            Short URL: {url}
          </p>
        )}
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign in with Different Account
          </button>
        </div>
        
        {/* Help Text */}
        <p className="text-xs text-neutral-500 mt-6">
          If you believe you should have access, please contact the organization administrator.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;

