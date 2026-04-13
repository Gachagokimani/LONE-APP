'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { UserSettings } from '@/lib/types';

interface NotificationSectionProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

/**
 * NotificationSection Component
 * Email and SMS notification preferences
 */
export default function NotificationSection({
  settings,
  onUpdate,
  isLoading = false,
}: NotificationSectionProps) {
  const [emailNotifs, setEmailNotifs] = useState(settings.emailNotifications);
  const [smsNotifs, setSmsNotifs] = useState(settings.smsNotifications);

  const handleEmailToggle = async () => {
    const newValue = !emailNotifs;
    setEmailNotifs(newValue);
    try {
      await onUpdate({ emailNotifications: newValue });
    } catch (error) {
      setEmailNotifs(!newValue);
    }
  };

  const handleSmsToggle = async () => {
    const newValue = !smsNotifs;
    setSmsNotifs(newValue);
    try {
      await onUpdate({ smsNotifications: newValue });
    } catch (error) {
      setSmsNotifs(!newValue);
    }
  };

  return (
    <motion.div
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="section-header">
        <Icon name="Bell" size={24} color="orange" animate="ping" />
        <div>
          <h3 className="section-title">Notification Preferences</h3>
          <p className="text-xs text-muted">Choose how and when you want to be notified</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="notification-grid">
          <motion.div
            className="notification-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="notification-card-header">
              <div className="notification-card-title">
                <Icon name="Mail" size={18} color="blue" />
                <div>
                  <h4 className="notification-title">Email Notifications</h4>
                  <p className="text-sm text-muted">
                    Receive updates about loans and important system events
                  </p>
                </div>
              </div>
              <span className={`status-chip ${emailNotifs ? 'status-chip-success' : 'status-chip-warning'}`}>
                {emailNotifs ? 'Active' : 'Paused'}
              </span>
            </div>

            <motion.button
              className={`toggle-switch ${emailNotifs ? 'active' : ''}`}
              onClick={handleEmailToggle}
              disabled={isLoading}
              whileTap={{ scale: 0.95 }}
              aria-pressed={emailNotifs}
            >
              <motion.div
                className="toggle-switch-thumb"
                animate={{ x: emailNotifs ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          <motion.div
            className="notification-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="notification-card-header">
              <div className="notification-card-title">
                <Icon name="MessageSquare" size={18} color="cyan" />
                <div>
                  <h4 className="notification-title">SMS Notifications</h4>
                  <p className="text-sm text-muted">
                    Get critical alerts via text message to {settings.emailNotifications ? 'your phone' : 'N/A'}
                  </p>
                </div>
              </div>
              <span className={`status-chip ${smsNotifs ? 'status-chip-success' : 'status-chip-warning'}`}>
                {smsNotifs ? 'Active' : 'Paused'}
              </span>
            </div>

            <motion.button
              className={`toggle-switch ${smsNotifs ? 'active' : ''}`}
              onClick={handleSmsToggle}
              disabled={isLoading}
              whileTap={{ scale: 0.95 }}
              aria-pressed={smsNotifs}
            >
              <motion.div
                className="toggle-switch-thumb"
                animate={{ x: smsNotifs ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Notification Center */}
        <div className="notification-center">
          <h4 className="text-sm font-semibold mb-3">Update Contact Information for Alerts</h4>
          <div className="alert alert-info">
            <Icon name="Info" size={18} />
            <span>
              Keep your email and phone updated to receive critical notifications about your account
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
