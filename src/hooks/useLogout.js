import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Custom hook for handling logout functionality
 * Provides a reusable logout function that can be used throughout the app
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (options = {}) => {
    const {
      showToast = true,
      redirectTo = '/login',
      toastMessage = 'Logged out successfully',
      onSuccess = null,
      onError = null
    } = options;

    try {
      console.log('Starting logout process...');
      
      // Call the logout function from auth context
      await logout();
      
      console.log('Logout completed, showing success message');
      
      if (showToast) {
        toast.success(toastMessage);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        console.log('Navigating to:', redirectTo);
        navigate(redirectTo, { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout fails, we should still try to navigate
      if (showToast) {
        toast.error('Logout completed, but there was an issue with the server.');
      }
      
      if (onError) {
        onError(error);
      }
      
      // Still navigate to login page even if there was an error
      setTimeout(() => {
        console.log('Navigating to login after error:', redirectTo);
        navigate(redirectTo, { replace: true });
      }, 100);
    }
  };

  return { handleLogout };
};

export default useLogout;
