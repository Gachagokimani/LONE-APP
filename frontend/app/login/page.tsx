'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(username, password);
      const { access } = response.data;
      auth.setToken(access);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex-center min-h-screen bg-primary py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-4 flex justify-center"
          >
            <div className="p-3 rounded-full bg-elevated border border-primary border-opacity-30">
              <Icon name="Banknote" size={48} color="primary" />
            </div>
          </motion.div>
          <motion.h1
            className="text-display text-primary mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            🇰🇪 Mkopo Kenya
          </motion.h1>
          <motion.p
            className="text-body text-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Secure Loan Management for Kenyan Businesses
          </motion.p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="alert alert-error mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <Icon name="AlertCircle" size={20} color="error" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          className="card shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="username" className="text-body font-semibold text-primary">
                <Icon name="User" size={16} color="primary" className="mr-2" />
                Username
              </label>
              <div className="input-with-icon">
                <Icon name="User" size={18} color="muted" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="flex-1"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="password" className="text-body font-semibold text-primary">
                <Icon name="Lock" size={16} color="primary" className="mr-2" />
                Password
              </label>
              <div className="input-with-icon">
                <Icon name="Lock" size={18} color="muted" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1"
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                icon="LogIn"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>
          </form>

          {/* Demo Credentials */}
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.div
            className="text-center text-small space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs uppercase tracking-wider text-muted">Demo Credentials</p>
            <div className="flex items-center justify-center gap-3 bg-elevated rounded-lg p-3 border border-border">
              <Icon name="Shield" size={16} color="primary" />
              <span className="text-body font-semibold">
                <span className="text-primary">admin</span>
                {' / '}
                <span className="text-secondary">admin</span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-small mt-6 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Your data is encrypted and secure
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

