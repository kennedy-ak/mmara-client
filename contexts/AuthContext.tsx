/**
 * Authentication Context Provider
 * Manages user authentication state across the app
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import {
  authService,
  setTokens,
  clearTokens,
  getUser,
  setUser,
  isTokenExpired,
  getAccessToken,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync tokens to cookies for middleware
  useEffect(() => {
    const syncTokens = () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        document.cookie = 'access_token=; path=/; max-age=0';
      }
    };

    syncTokens();
  }, [user]); // Sync when user state changes

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getUser();
        const token = getAccessToken();

        if (storedUser && token && !isTokenExpired()) {
          setUserState(storedUser);
          // Optionally refresh user data from server
          try {
            const freshUser = await authService.getCurrentUser();
            setUserState(freshUser);
            setUser(freshUser);
          } catch {
            // If refresh fails, use stored user
          }
        } else {
          // Token expired or no user - clear everything
          clearTokens();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setTokens(result.tokens);
    setUserState(result.user);
    setUser(result.user);
  };

  const register = async (
    email: string,
    password: string,
    fullName?: string,
    phone?: string
  ) => {
    const newUser = await authService.register({
      email,
      password,
      full_name: fullName,
      phone,
    });
    // Auto-login after registration
    await login(email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUserState(null);
    // Clear cookie
    document.cookie = 'access_token=; path=/; max-age=0';
  };

  const refreshUser = async () => {
    const freshUser = await authService.getCurrentUser();
    setUserState(freshUser);
    setUser(freshUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
