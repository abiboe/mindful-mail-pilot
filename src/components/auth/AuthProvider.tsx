
import React, { createContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { AuthState, User } from '@/types';
import { LoginButton } from './LoginButton';

interface AuthContextType {
  authState: AuthState;
  login: (platform: 'gmail' | 'outlook') => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authState: {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  },
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    // Check if user is already authenticated in localStorage
    const user = localStorage.getItem('user');
    
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: parsedUser,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'Invalid session data',
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // For demo purposes, we'll simulate auth
  const login = async (platform: 'gmail' | 'outlook') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: platform === 'gmail' ? 'john.doe@gmail.com' : 'john.doe@outlook.com',
        avatar: 'https://i.pravatar.cc/150?img=32',
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        error: null,
      });
      
      toast.success(`Logged in with ${platform} successfully!`);
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Authentication failed. Please try again.',
      }));
      toast.error('Authentication failed. Please try again.');
    }
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
    toast.info('Logged out successfully');
  };
  
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
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
