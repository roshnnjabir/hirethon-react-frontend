import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook from AuthContext for convenience
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here
export const useAuthActions = () => {
  const { login, register, logout, updateUser, clearError } = useAuth();
  
  return {
    login,
    register,
    logout,
    updateUser,
    clearError,
  };
};

export const useAuthState = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
