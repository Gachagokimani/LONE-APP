'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { User, UserRole } from '@/lib/types';

interface ProfileInfoSectionProps {
  user: User;
  onSave: (updates: Partial<User>) => Promise<void>;
  isLoading?: boolean;
}

/**
 * ProfileInfoSection Component
 * Displays and edits user profile information
 */
export default function ProfileInfoSection({
  user,
  onSave,
  isLoading = false,
}: ProfileInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <motion.div
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="section-header">
        <Icon name="User" size={24} color="crimson" />
        <div>
          <h3 className="section-title">Profile Information</h3>
          <p className="text-xs text-muted">Manage your personal information</p>
        </div>
      </div>

      <div className="settings-content">
        {!isEditing ? (
          <>
            {/* Profile View */}
            <div className="profile-view">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              </div>

              <div className="profile-info-cards">
                <div className="info-card">
                  <span className="info-chip">First Name</span>
                  <p className="info-value">{user.firstName}</p>
                </div>
                <div className="info-card">
                  <span className="info-chip">Last Name</span>
                  <p className="info-value">{user.lastName}</p>
                </div>
                <div className="info-card">
                  <span className="info-chip">Email</span>
                  <p className="info-value">{user.email}</p>
                </div>
                <div className="info-card">
                  <span className="info-chip">Phone</span>
                  <p className="info-value">{user.phone}</p>
                </div>
                {user.department && (
                  <div className="info-card">
                    <span className="info-chip">Department</span>
                    <p className="info-value">{user.department}</p>
                  </div>
                )}
                <div className="info-card">
                  <span className="info-chip">Member Since</span>
                  <p className="info-value">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <motion.button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name="Edit2" size={18} />
                Edit Profile
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Profile Edit Form */}
            <div className="profile-edit">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
