'use client';

import { useState, useCallback } from 'react';
import { UserSettings, User } from '@/lib/types';
import {
  getUserSettings,
  updateUserSettings,
  updateUserProfile,
  toggleAIChatFeature,
} from '@/lib/settingsApi';

interface UseSettingsOptions {
  userId: string;
  initialSettings?: UserSettings;
}

interface UseSettingsReturn {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  toggleAIChat: (enabled: boolean) => Promise<void>;
  clearError: () => void;
}

/**
 * useSettings Hook
 * Manages user settings state and API interactions
 */
export function useSettings({ userId, initialSettings }: UseSettingsOptions): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(initialSettings || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await updateUserSettings(userId, newSettings);
        setSettings(response.settings);
      } catch (err: any) {
        setError(err.message || 'Failed to update settings');
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const updateProfile = useCallback(
    async (profile: Partial<User>) => {
      setIsLoading(true);
      setError(null);

      try {
        await updateUserProfile(userId, profile as any);
      } catch (err: any) {
        setError(err.message || 'Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const toggleAIChat = useCallback(
    async (enabled: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await toggleAIChatFeature(userId, enabled);
        if (settings) {
          setSettings({ ...settings, aiChatEnabled: enabled });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to toggle AI chat');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, settings]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateProfile,
    toggleAIChat,
    clearError,
  };
}
