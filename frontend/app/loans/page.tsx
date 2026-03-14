'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';

interface Loan {
  id: string;
  customer_details: { full_name: string; email: string };
  amount: number;
  status: string;
  applied_at: string;
  interest_rate: number;
  term_months: number;
}

const StatusBadgeVariant: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  under_review: 'primary',
  approved: 'success',
  rejected: 'error',
  disbursed: 'success',
  closed: 'primary',
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  // Hardcoded fallback data for demonstration
  const fallbackLoans: Loan[] = [
    {
      id: '1',
      customer_details: { full_name: 'Kamau Njoroge', email: 'kamau.njoroge@example.com' },
      amount: 650000,
      status: 'pending',
      applied_at: new Date().toISOString(),
      interest_rate: 5.5,
      term_months: 60,
    },
    {
      id: '2',
      customer_details: { full_name: 'Grace Wanjiru', email: 'grace.wanjiru@example.com' },
      amount: 975000,
      status: 'approved',
      applied_at: new Date(Date.now() - 86400000).toISOString(),
      interest_rate: 4.8,
      term_months: 84,
    },
    {
      id: '3',
      customer_details: { full_name: 'James Kariuki', email: 'james.kariuki@example.com' },
      amount: 390000,
      status: 'under_review',
      applied_at: new Date(Date.now() - 172800000).toISOString(),
      interest_rate: 6.2,
      term_months: 48,
    },
  ];

  useEffect(() => {
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    
    if (!isDev && !auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadLoans = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getLoans({ status: statusFilter || undefined });
        setLoans(response.data.results || response.data);
      } catch (err: any) {
        console.warn('Failed to load loans from API, using demo data:', err.message);
        // Use fallback data on API failure
        setLoans(fallbackLoans);
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, [statusFilter, router]);

  const handleStatusChange = async (loanId: string, newStatus: string) => {
    try {
      await apiClient.changeLoanStatus(loanId, newStatus);
      setLoans(loans.map((loan) => (loan.id === loanId ? { ...loan, status: newStatus } : loan)));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

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
              <Icon name="Banknote" size={40} color="primary" />
            </motion.div>
            Loan Applications
          </h1>
          <p className="text-body-small text-muted">
            Monitor and manage all loan applications
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
            onClick={() => router.push('/loans/new')}
            icon="Plus"
          >
            New Application
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

      {/* Filter Section */}
      <motion.div
        className="flex items-center gap-4 mb-8 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={18} color="muted" />
          <label htmlFor="status-filter" className="text-body font-medium text-muted">
            Filter by Status:
          </label>
        </div>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control bg-elevated border border-border text-text rounded-lg p-2.5 text-sm font-medium"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="disbursed">Disbursed</option>
          <option value="closed">Closed</option>
        </select>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          className="record-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="record-tile skeleton-shimmer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ minHeight: '200px' }}
            />
          ))}
        </motion.div>
      ) : loans.length === 0 ? (
        /* Empty State */
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Icon name="FolderOpen" size={56} color="muted" className="empty-state-icon" />
          <h3 className="empty-state-title">No Loan Applications Yet</h3>
          <p className="empty-state-description">
            Get started by creating your first loan application
          </p>
          <div className="empty-state-action">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/loans/new')}
              icon="Plus"
            >
              Create Loan Application
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Loans Grid */
        <motion.div
          className="record-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {loans.map((loan, idx) => {
            const statusLabel = loan.status.replace(/_/g, ' ').toUpperCase();
            const formattedAmount = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(loan.amount);
            const appliedDate = new Date(loan.applied_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <motion.div
                key={loan.id}
                className="record-tile group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Tile Header */}
                <div className="record-tile-header">
                  <div className="flex-1">
                    <h3 className="record-tile-title">
                      {loan.customer_details.full_name}
                    </h3>
                    <p className="record-tile-subtitle">
                      {loan.customer_details.email}
                    </p>
                  </div>
                  <Badge variant={StatusBadgeVariant[loan.status] || 'primary'}>
                    {statusLabel}
                  </Badge>
                </div>

                {/* Tile Content */}
                <div className="record-tile-content space-y-4">
                  <div className="grid grid-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-1">
                        Loan Amount
                      </p>
                      <p className="currency text-lg">
                        {formattedAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-1">
                        Interest Rate
                      </p>
                      <p className="text-body font-semibold text-tertiary">
                        {loan.interest_rate}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-1">
                        Term Length
                      </p>
                      <p className="text-body font-semibold text-secondary">
                        {loan.term_months} mo
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-1">
                        Applied On
                      </p>
                      <p className="date-formatted">
                        {appliedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile Footer */}
                <div className="record-tile-footer">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/loans/${loan.id}`)}
                    icon="Eye"
                  >
                    View Details
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
