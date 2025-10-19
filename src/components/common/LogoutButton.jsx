import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import Button from './Button';
import { useLogout } from '../../hooks/useLogout';

const LogoutButton = ({ 
  variant = 'ghost', 
  size = 'sm', 
  showIcon = true, 
  children = 'Logout',
  className = '',
  onLogout = null,
  ...props 
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { handleLogout } = useLogout();

  const handleClick = async () => {
    console.log('Logout button clicked');
    setIsLoggingOut(true);
    
    try {
      await handleLogout({
        showToast: true,
        redirectTo: '/login',
        toastMessage: 'You have been logged out successfully',
        onSuccess: onLogout
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Don't set loading to false here since we're navigating away
      // The component will be unmounted when navigation happens
      console.log('Logout process completed');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        loading={isLoggingOut}
        disabled={isLoggingOut}
        icon={showIcon ? <LogOut className="w-4 h-4" /> : null}
        className={className}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default LogoutButton;