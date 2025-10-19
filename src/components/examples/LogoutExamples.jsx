import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import LogoutButton from '../common/LogoutButton';
import Button from '../common/Button';
import { useLogout } from '../../hooks/useLogout';

/**
 * Example component demonstrating different ways to use logout functionality
 * This can be used as a reference for implementing logout in other components
 */
const LogoutExamples = () => {
  const { handleLogout } = useLogout();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Logout Examples</h2>
        <p className="text-slate-600 mb-6">
          Here are different ways to implement logout functionality throughout the app.
        </p>
      </div>

      {/* Example 1: Simple LogoutButton */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Simple LogoutButton</h3>
        <p className="text-slate-600 mb-4">
          Basic logout button with default styling and behavior.
        </p>
        <LogoutButton>
          Sign Out
        </LogoutButton>
      </div>

      {/* Example 2: LogoutButton with custom styling */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Custom Styled LogoutButton</h3>
        <p className="text-slate-600 mb-4">
          Logout button with custom styling and icon.
        </p>
        <LogoutButton
          variant="outline"
          size="lg"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          showIcon={true}
        >
          Logout
        </LogoutButton>
      </div>

      {/* Example 3: Using useLogout hook directly */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Using useLogout Hook Directly</h3>
        <p className="text-slate-600 mb-4">
          Custom implementation using the useLogout hook for more control.
        </p>
        <div className="space-x-3">
          <Button
            variant="primary"
            onClick={() => handleLogout({
              showToast: true,
              redirectTo: '/login',
              toastMessage: 'Goodbye! You have been logged out.'
            })}
            icon={<LogOut className="w-4 h-4" />}
          >
            Logout with Custom Message
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleLogout({
              showToast: false,
              redirectTo: '/login',
              onSuccess: () => console.log('Logout successful!')
            })}
          >
            Silent Logout
          </Button>
        </div>
      </div>

      {/* Example 4: Navigation menu style */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Navigation Menu Style</h3>
        <p className="text-slate-600 mb-4">
          Logout button styled for navigation menus and dropdowns.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 max-w-xs">
          <div className="space-y-2">
            <button className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-white hover:text-slate-900 rounded-md transition-colors">
              <User className="w-4 h-4 mr-3" />
              Profile
            </button>
            <button className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-white hover:text-slate-900 rounded-md transition-colors">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
            <div className="border-t border-slate-200 pt-2">
              <LogoutButton
                variant="ghost"
                size="sm"
                className="w-full justify-start px-3 py-2 text-sm text-slate-700 hover:bg-white hover:text-slate-900"
                showIcon={true}
              >
                Sign out
              </LogoutButton>
            </div>
          </div>
        </div>
      </div>

      {/* Example 5: Programmatic logout */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">5. Programmatic Logout</h3>
        <p className="text-slate-600 mb-4">
          Logout that can be triggered programmatically (e.g., on session timeout).
        </p>
        <Button
          variant="outline"
          onClick={() => {
            // Example: Auto-logout after 5 seconds
            setTimeout(() => {
              handleLogout({
                showToast: true,
                redirectTo: '/login',
                toastMessage: 'Session expired. Please log in again.'
              });
            }, 5000);
          }}
        >
          Simulate Auto-Logout (5s)
        </Button>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Usage Instructions</h3>
        <div className="text-blue-800 space-y-2 text-sm">
          <p><strong>1. LogoutButton Component:</strong> Use for simple logout buttons with consistent styling.</p>
          <p><strong>2. useLogout Hook:</strong> Use for custom implementations with more control over behavior.</p>
          <p><strong>3. Logout Route:</strong> Navigate to <code>/logout</code> for automatic logout with loading state.</p>
          <p><strong>4. Options:</strong> Customize toast messages, redirect routes, and success/error callbacks.</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutExamples;
