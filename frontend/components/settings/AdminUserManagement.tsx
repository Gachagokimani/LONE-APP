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

        {/* Users Table */}
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'var(--elevated)' }}
                >
                  <td>
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
                  </td>
                  <td>
                    <p className="text-sm">{user.email}</p>
                  </td>
                  <td>
                    <div className="role-selector">
                      <Badge color={getRoleColor(user.role) as any}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </td>
                  <td>
                    <Badge color={user.isActive ? 'emerald' : 'rose'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <p className="text-xs text-muted">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </p>
                  </td>
                  <td>
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
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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
