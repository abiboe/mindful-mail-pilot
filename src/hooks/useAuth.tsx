
import { useContext } from 'react';
import { AuthContext } from '@/components/auth/AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    user: context.authState.user,
    isAuthenticated: context.authState.isAuthenticated,
    isLoading: context.authState.isLoading,
    error: context.authState.error,
    login: context.login,
    logout: context.logout,
  };
};
