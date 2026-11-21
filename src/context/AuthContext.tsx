'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'customer' | 'vendor' | 'admin';
  businessName?: string;
  subscriptionPlan: 'free' | 'premium';
  subscriptionExpiresAt?: string;
  isBlocked: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  loginWithGoogle: (data: any) => Promise<User>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize token and user from localStorage on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('pizzahub_token');
        const storedUser = localStorage.getItem('pizzahub_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Fetch fresh user profile from backend to ensure roles/subscription/block status are synchronized
          try {
            const res = await api.get('/auth/me');
            if (res.data.success && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
            }
          } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
              localStorage.removeItem('pizzahub_token');
              localStorage.removeItem('pizzahub_user');
              document.cookie = 'pizzahub_token=; path=/; max-age=0;';
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (e) {
        console.error('Error hydrating auth state:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const saveAuthSession = (authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('pizzahub_token', authToken);
    localStorage.setItem('pizzahub_user', JSON.stringify(authUser));
    // Set cookie for SSR compatibility
    document.cookie = `pizzahub_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Login failed');
    }
    saveAuthSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async (data: any): Promise<User> => {
    const res = await api.post('/auth/register', data);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Registration failed');
    }
    saveAuthSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const loginWithGoogle = async (data: any): Promise<User> => {
    const res = await api.post('/auth/google', data);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Google authentication failed');
    }
    saveAuthSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    try {
      setToken(null);
      setUser(null);
      localStorage.removeItem('pizzahub_token');
      localStorage.removeItem('pizzahub_user');
      document.cookie = 'pizzahub_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
    } catch (e) {
      console.error('Logout cleanup error:', e);
    }
    // Hard navigate to login to clear all in-memory React states cleanly
    window.location.replace('/login');
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('pizzahub_user', JSON.stringify(updated));
      return updated;
    });
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
