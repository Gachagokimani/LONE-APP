'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  employment_status: string;
  monthly_income: number;
  created_at: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadCustomers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCustomers();
        setCustomers(response.data.results || response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [router]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!auth.isAuthenticated()) {
    return (
      <motion.div className="flex-center min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Icon name="Loader2" size={40} className="animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header Section */}
      <motion.div
        className="section-header mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex-1">
          <h1 className="text-display text-primary flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <Icon name="Users" size={40} color="primary" />
            </motion.div>
            Customer Directory
          </h1>
          <p className="text-body-small text-muted">
            Manage and track all customer profiles and information
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/customers/new')}
            icon="Plus"
          >
            Add Customer
          </Button>
        </motion.div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          className="alert alert-error mb-6 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Icon name="AlertCircle" size={20} color="error" />
          <span className="flex-1 ml-3">{error}</span>
          <button
            onClick={() => setError('')}
            className="alert-close"
            aria-label="Close alert"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Search Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="input-with-icon">
          <Icon name="Search" size={20} color="muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name or email..."
            className="flex-1 text-body"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-muted hover:text-primary transition-colors"
              aria-label="Clear search"
            >
              <Icon name="X" size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          className="record-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="record-tile skeleton-shimmer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ minHeight: '220px' }}
            />
          ))}
        </motion.div>
      ) : filteredCustomers.length === 0 ? (
        /* Empty State */
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Icon name="Users" size={56} color="muted" className="empty-state-icon" />
          <h3 className="empty-state-title">
            {searchTerm ? 'No Customers Found' : 'No Customers Yet'}
          </h3>
          <p className="empty-state-description">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first customer to the system'}
          </p>
          {!searchTerm && (
            <div className="empty-state-action">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/customers/new')}
                icon="Plus"
              >
                Add New Customer
              </Button>
            </div>
          )}
        </motion.div>
      ) : (
        /* Customers Grid */
        <motion.div
          className="record-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {filteredCustomers.map((customer, idx) => {
            const formattedIncome = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(customer.monthly_income);
            const joinDate = new Date(customer.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const employmentStatus = customer.employment_status
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

            return (
              <motion.div
                key={customer.id}
                className="record-tile group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Tile Header */}
                <div className="record-tile-header">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <Icon name="User" size={24} color="primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="record-tile-title">
                          {customer.full_name}
                        </h3>
                        <p className="text-xs text-muted">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tile Content */}
                <div className="record-tile-content space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                      <Icon name="Phone" size={14} color="muted" />
                      Contact
                    </span>
                    <span className="text-body-small font-medium text-text">
                      {customer.phone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                      <Icon name="Briefcase" size={14} color="muted" />
                      Employment
                    </span>
                    <span className="text-body-small font-medium text-secondary">
                      {employmentStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                      <Icon name="DollarSign" size={14} color="muted" />
                      Monthly Income
                    </span>
                    <span className="currency text-sm">
                      {formattedIncome}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-2">
                      <Icon name="Calendar" size={14} color="muted" />
                      Joined
                    </span>
                    <span className="date-formatted">
                      {joinDate}
                    </span>
                  </div>
                </div>

                {/* Tile Footer */}
                <div className="record-tile-footer">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                    icon="Eye"
                  >
                    View Profile
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
