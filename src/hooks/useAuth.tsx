
import { useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { AuthContext } from '@/components/auth/AuthProvider';

export const useAuth = () => {
  const { authState, logout, refreshSession } = useContext(AuthContext);
  const { isAuthenticated, isLoading, user, error } = authState;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    refreshSession
  };
};
