'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { UserRole } from '@/lib/types';

interface OnboardUserModal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
  }) => Promise<void>;
  isLoading?: boolean;
}

/**
 * OnboardUserModal Component
 * Admin form for onboarding new users
 */
export default function OnboardUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: OnboardUserModal) {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: UserRole.LOAN_OFFICER,
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' ? (value as UserRole) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: UserRole.LOAN_OFFICER,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to onboard user');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-container max-w-md"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header mb-4">
          <h3 className="modal-title">Onboard New User</h3>
          <button onClick={onClose} className="modal-close">
            <Icon name="X" size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <Icon name="AlertCircle" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
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
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value={UserRole.LOAN_OFFICER}>Loan Officer</option>
              <option value={UserRole.MANAGER}>Manager</option>
              <option value={UserRole.ADMIN}>Administrator</option>
            </select>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Create User
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
