
import React, { createContext, useEffect, useState } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from '@/types';
import { LoginButton } from './LoginButton';

interface AuthContextType {
  authState: AuthState;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  authState: {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  },
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: session.user,
            error: null,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
        }
        
        // Show toast based on auth event
        if (event === 'SIGNED_IN') {
          toast.success('Logged in successfully!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Logged out successfully');
        }
      }
    );

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: session.user,
          error: null,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };
  
  return (
    <AuthContext.Provider value={{ authState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-accent p-4">
      <div className="w-full max-w-md animate-fade-in space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mindful Mail Pilot</h1>
          <p className="mt-2 text-muted-foreground">Your intelligent email assistant</p>
        </div>
        
        <div className="space-y-4 pt-4">
          <p className="text-center text-sm text-muted-foreground">Sign in to continue:</p>
          <div className="flex flex-col gap-4">
            <LoginButton platform="gmail" />
            <LoginButton platform="outlook" />
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};
