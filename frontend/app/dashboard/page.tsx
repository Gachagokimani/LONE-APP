'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // In dev mode, skip authentication check
      const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
      
      if (!isDev && !auth.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        // Get current user to determine role
        const response = await apiClient.getUsers();
        setUserRole('admin'); // Placeholder - should be fetched from backend
      } catch (err) {
        console.error('Failed to load user:', err);
        // In dev mode, set admin role instead of redirecting
        if (isDev) {
          setUserRole('admin');
        } else {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header Section */}
      <motion.div
        className="section-header mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1">
          <h1 className="text-display text-primary mb-2 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon name="BarChart3" size={40} color="primary" />
            </motion.div>
            Dashboard
          </h1>
          <p className="text-body-small text-muted">
            Welcome back! Here's your comprehensive loan portfolio overview.
          </p>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Stats Skeleton */}
          <div className="record-grid">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="card skeleton-shimmer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ height: '140px' }}
              />
            ))}
          </div>
          
          {/* Chart Skeleton */}
          <motion.div
            className="card skeleton-shimmer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ height: '300px' }}
          />
        </motion.div>
      ) : (
        /* Main Content */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </motion.div>
      )}
    </motion.div>
  );
}

