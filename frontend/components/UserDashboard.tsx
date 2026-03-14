'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';

interface UserDashboardData {
  my_loans_count: number;
  my_loans_by_status: Array<{ status: string; count: number }>;
  total_borrowed: number;
  recent_loans: any[];
}

const StatusBadgeVariant: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  under_review: 'primary',
  approved: 'success',
  rejected: 'error',
  disbursed: 'success',
  closed: 'primary',
};

const StatCard = ({ title, value, icon, delay }: { title: string; value: string | number; icon: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', damping: 25 }}
  >
    <Card hoverable>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
            {title}
          </p>
          <p className="text-heading text-primary font-bold">
            {value}
          </p>
        </div>
        <div className="ml-4 p-3 rounded-lg bg-primary bg-opacity-10">
          <Icon name={icon as any} size={32} color="primary" />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
      const fallbackData: UserDashboardData = {
        my_loans_count: 3,
        my_loans_by_status: [
          { status: 'disbursed', count: 2 },
          { status: 'pending', count: 1 },
        ],
        total_borrowed: 1950000, // 1.95M KES
        recent_loans: [
          {
            id: '1',
            amount: 650000, // 650K KES
            status: 'disbursed',
            applied_at: new Date(Date.now() - 86400000 * 30).toISOString(),
            interest_rate: 5.5,
          },
          {
            id: '2',
            amount: 975000, // 975K KES
            status: 'disbursed',
            applied_at: new Date(Date.now() - 86400000 * 60).toISOString(),
            interest_rate: 4.8,
          },
          {
            id: '3',
            amount: 325000, // 325K KES
            status: 'pending',
            applied_at: new Date(Date.now() - 86400000 * 7).toISOString(),
            interest_rate: 6.2,
          },
        ],
      };

      try {
        const response = await apiClient.getUserDashboard();
        setDashboardData(response.data);
      } catch (err: any) {
        // In dev mode, use fallback data instead of error
        if (isDev) {
          setDashboardData(fallbackData);
        } else {
          setError(err.response?.data?.error || 'Failed to load dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return (
      <motion.div
        className="alert alert-error flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Icon name="AlertCircle" size={20} color="error" />
        <span className="flex-1 ml-3">{error}</span>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="record-grid">
        {loading ? (
          <>
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className="card skeleton-shimmer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ minHeight: '120px' }}
              />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Active Loan Applications"
              value={dashboardData?.my_loans_count || 0}
              icon="Banknote"
              delay={0.1}
            />
            <StatCard
              title="Total Amount Borrowed"
              value={`$${((dashboardData?.total_borrowed || 0) / 1000).toFixed(1)}K`}
              icon="TrendingUp"
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Recent Loans Table */}
      {loading ? (
        <motion.div
          className="card skeleton-shimmer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ minHeight: '300px' }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', damping: 25 }}
        >
          <Card hoverable>
            <div className="mb-6 pb-6 border-b border-border">
              <h2 className="text-heading text-primary font-bold mb-2 flex items-center gap-2">
                <Icon name="History" size={24} color="primary" />
                Recent Loan Applications
              </h2>
              <p className="text-body-small text-muted">
                Your most recent loan applications and their current status
              </p>
            </div>

            {dashboardData?.recent_loans && dashboardData.recent_loans.length > 0 ? (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recent_loans.map((loan, idx) => {
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
                        <motion.tr
                          key={loan.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                          <td className="font-semibold text-primary">
                            #{loan.id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="currency">
                            {formattedAmount}
                          </td>
                          <td>
                            <Badge variant={StatusBadgeVariant[loan.status] || 'primary'}>
                              {loan.status.replace(/_/g, ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="date-formatted">
                            {appliedDate}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <Icon name="FileText" size={48} color="muted" className="empty-state-icon" />
                <h3 className="empty-state-title">No Loans Yet</h3>
                <p className="empty-state-description">
                  You haven't submitted any loan applications yet
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}

