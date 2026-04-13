'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { User, getRoleDisplayName, getRoleColor, UserRole } from '@/lib/types';

interface AdminUserManagementProps {
  users: User[];
  onDecommission: (userId: string) => Promise<void>;
  onReactivate: (userId: string) => Promise<void>;
  onChangeRole: (userId: string, newRole: UserRole) => Promise<void>;
  isLoading?: boolean;
}

/**
 * AdminUserManagement Component
 * Admin-only user management interface
 * Decommission, reactivate, and change user roles
 */
export default function AdminUserManagement({
  users,
  onDecommission,
  onReactivate,
  onChangeRole,
  isLoading = false,
}: AdminUserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredUsers = users.filter((user) => {
    if (filterStatus === 'active') return user.isActive;
    if (filterStatus === 'inactive') return !user.isActive;
    return true;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await onChangeRole(userId, newRole);
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  return (
    <motion.div
      className="admin-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="section-header">
        <Icon name="Users" size={24} color="crimson" />
        <div>
          <h3 className="section-title">User Management</h3>
          <p className="text-xs text-muted">Manage team members and access levels</p>
        </div>
      </div>

      <div className="admin-content">
        {/* Filters */}
        <div className="admin-filters">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              {status === 'all' ? 'All Users' : status === 'active' ? 'Active' : 'Inactive'}
            </motion.button>
          ))}
        </div>

        <div className="user-card-grid">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              className={`user-card ${user.isActive ? 'user-card-active' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <div className="user-card-top">
                <div className="user-cell">
                  <div className="user-avatar-sm">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted">{user.username}</p>
                  </div>
                </div>

                <div className="user-chip-group">
                  <Badge color={getRoleColor(user.role) as any}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                  <Badge color={user.isActive ? 'emerald' : 'rose'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="user-card-meta">
                <span className="text-xs text-muted">
                  Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </span>
              </div>

              <div className="user-card-actions">
                <div className="role-chip-row">
                  {([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER] as const).map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      className={`role-chip ${user.role === roleOption ? 'active' : ''}`}
                      onClick={() => handleRoleChange(user.id, roleOption)}
                      disabled={isLoading}
                    >
                      {getRoleDisplayName(roleOption)}
                    </button>
                  ))}
                </div>
                <div className="action-buttons">
                  {user.isActive ? (
                    <motion.button
                      onClick={() => onDecommission(user.id)}
                      className="btn-sm btn-danger"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading}
                      title="Decommission this user"
                    >
                      <Icon name="Power" size={14} />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => onReactivate(user.id)}
                      className="btn-sm btn-success"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading}
                      title="Reactivate this user"
                    >
                      <Icon name="Check" size={14} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <Icon name="Users" size={48} color="muted" />
            <p className="text-muted">No users found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
