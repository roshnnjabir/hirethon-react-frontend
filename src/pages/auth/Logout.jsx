import React, { useEffect } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { LogOut, Loader2 } from 'lucide-react';

const Logout = () => {
  const { handleLogout } = useLogout();

  useEffect(() => {
    // Automatically logout when this page is accessed
    handleLogout({
      showToast: true,
      redirectTo: '/login',
      toastMessage: 'You have been logged out successfully'
    });
  }, [handleLogout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl shadow-xl mb-6">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-light text-slate-900 tracking-tight">
            Logging out
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-light">
            Please wait while we sign you out
          </p>
        </div>

        {/* Loading State */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
          </div>
          <p className="text-slate-600 font-light">
            Signing you out securely...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logout;
