'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { UserRole, User, UserSettings, Theme } from '@/lib/types';
import ProfileInfoSection from '@/components/settings/ProfileInfoSection';
import ThemeSection from '@/components/settings/ThemeSection';
import NotificationSection from '@/components/settings/NotificationSection';
import AISection from '@/components/settings/AISection';
import AdminUserManagement from '@/components/settings/AdminUserManagement';
import OnboardUserModal from '@/components/settings/OnboardUserModal';
import {
  getAllUsers,
  onboardUser,
  decommissionUser,
  reactivateUser,
  changeUserRole,
  updateUserSettings,
  updateUserProfile,
  toggleAIChatFeature,
} from '@/lib/settingsApi';

/**
 * SettingsPage Component
 * Main profile and settings page with role-based sections
 */
export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { theme: currentTheme, isDark, setTheme } = useTheme();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [initialTab, setInitialTab] = useState<'profile' | 'appearance' | 'notifications' | 'ai' | 'users'>('profile');
  const [settings, setSettings] = useState<UserSettings>({
    themeMode: currentTheme,
    emailNotifications: true,
    smsNotifications: false,
    aiChatEnabled: true,
    twoFactorEnabled: false,
    language: 'en',
    timeZone: 'Africa/Nairobi',
  });

  // Fetch all users if admin
  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [user?.role]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOnboardUser = async (userData: any) => {
    try {
      await onboardUser(userData);
      await fetchUsers();
      setShowOnboardModal(false);
    } catch (error) {
      console.error('Failed to onboard user:', error);
      throw error;
    }
  };

  const handleProfileSave = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      await updateUserProfile(user.id, updates);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  };

  const handleSettingsUpdate = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;
    try {
      await updateUserSettings(user.id, newSettings);
      setSettings((prev) => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      await handleSettingsUpdate({ themeMode: newTheme });
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
  };

  const handleDecommissionUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to decommission this user?')) return;
    try {
      await decommissionUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to decommission user:', error);
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      await reactivateUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to reactivate user:', error);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      await changeUserRole(userId, newRole.toString());
      await fetchUsers();
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  if (authLoading) {
    return (
      <motion.div
        className="settings-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="settings-header">
          <Skeleton height="2rem" className="mb-2" />
          <Skeleton height="1rem" />
        </div>
        <div className="settings-container">
          <Skeleton height="2.5rem" className="mb-4" />
          <Skeleton height="18.75rem" />
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="settings-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="settings-empty">
          <Icon name="Lock" size={48} color="muted" />
          <h2>Not Authenticated</h2>
          <p>Please log in to access settings.</p>
          <Link href="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="settings-header">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-muted hover:text-accent-primary transition">
            <Icon name="ChevronLeft" size={20} />
          </Link>
          <h1 className="page-title">Settings</h1>
        </div>
        <p className="text-muted">Manage your profile, preferences, and account settings</p>
      </div>

      {/* Settings Container */}
      <div className="settings-container">
        {/* Tab Navigation */}
        <nav className="settings-nav">
          <motion.button
            onClick={() => setInitialTab('profile')}
            className={`nav-tab ${initialTab === 'profile' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="User" size={18} />
            <span>Profile</span>
          </motion.button>

          <motion.button
            onClick={() => setInitialTab('appearance')}
            className={`nav-tab ${initialTab === 'appearance' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="Palette" size={18} />
            <span>Appearance</span>
          </motion.button>

          <motion.button
            onClick={() => setInitialTab('notifications')}
            className={`nav-tab ${initialTab === 'notifications' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="Bell" size={18} />
            <span>Notifications</span>
          </motion.button>

          <motion.button
            onClick={() => setInitialTab('ai')}
            className={`nav-tab ${initialTab === 'ai' ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="Cpu" size={18} />
            <span>AI Features</span>
          </motion.button>

          {/* Admin-only tab */}
          {user.role === UserRole.ADMIN && (
            <motion.button
              onClick={() => setInitialTab('users')}
              className={`nav-tab ${initialTab === 'users' ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="Users" size={18} />
              <span>User Management</span>
            </motion.button>
          )}
        </nav>

        {/* Tab Content */}
        <div className="settings-content">
          <AnimatePresence mode="wait">
            {initialTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProfileInfoSection user={user} onSave={handleProfileSave} />
              </motion.div>
            )}

            {initialTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ThemeSection
                  currentTheme={currentTheme}
                  isDark={isDark}
                  onThemeChange={handleThemeChange}
                />
              </motion.div>
            )}

            {initialTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <NotificationSection
                  settings={settings}
                  onUpdate={handleSettingsUpdate}
                />
              </motion.div>
            )}

            {initialTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AISection
                  aiChatEnabled={settings.aiChatEnabled}
                  onToggle={(enabled) =>
                    toggleAIChatFeature(user.id, enabled).then(() =>
                      handleSettingsUpdate({ aiChatEnabled: enabled })
                    )
                  }
                />
              </motion.div>
            )}

            {initialTab === 'users' && user.role === UserRole.ADMIN && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="admin-header mb-6">
                  <h2>User Management</h2>
                  <motion.button
                    onClick={() => setShowOnboardModal(true)}
                    className="btn btn-primary mt-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon name="Plus" size={18} />
                    <span>Add New User</span>
                  </motion.button>
                </div>

                {usersLoading ? (
                  <div className="space-y-4">
                    <Skeleton height="3.75rem" />
                    <Skeleton height="3.75rem" />
                    <Skeleton height="3.75rem" />
                  </div>
                ) : (
                  <AdminUserManagement
                    users={allUsers}
                    onDecommission={handleDecommissionUser}
                    onReactivate={handleReactivateUser}
                    onChangeRole={handleChangeRole}
                    isLoading={usersLoading}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Onboard User Modal */}
      <OnboardUserModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSubmit={handleOnboardUser}
      />
    </motion.div>
  );
}
