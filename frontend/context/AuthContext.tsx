'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, UserPermissions, getRolePermissions, Theme } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  permissions: UserPermissions;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Manages user authentication state and permissions
 * Uses React Context for global user data access
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if dev mode - use mock user
        const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
        
        if (isDev) {
          // Mock admin user for dev mode
          const mockUser: User = {
            id: 'dev-user-1',
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@mkopo.ke',
            phone: '+254 712 345 678',
            role: UserRole.ADMIN,
            department: 'Administration',
            isActive: true,
            createdAt: '2026-01-01',
            lastLogin: new Date().toISOString(),
            settings: {
              themeMode: Theme.DARK,
              emailNotifications: true,
              smsNotifications: true,
              aiChatEnabled: true,
              twoFactorEnabled: false,
              language: 'en',
              timeZone: 'Africa/Nairobi',
            },
          };
          setUser(mockUser);
        } else {
          // In production, fetch from API
          const response = await apiClient.getUsers();
          const userData = response.data[0]; // Get first user (current user)
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const permissions = user ? getRolePermissions(user.role) : getRolePermissions(UserRole.GUEST);

  const logout = () => {
    setUser(null);
    // Clear auth token
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getUsers();
      const userData = response.data[0];
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    permissions,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook - Access auth context anywhere in the app
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
