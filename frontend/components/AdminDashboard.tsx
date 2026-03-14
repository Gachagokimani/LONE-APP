'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';

interface DashboardData {
  total_loans: number;
  total_customers: number;
  total_disbursed: number;
  loans_by_status: Array<{ status: string; count: number }>;
  recent_events: any[];
}

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

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
      const fallbackData: DashboardData = {
        total_loans: 45,
        total_customers: 28,
        total_disbursed: 162500000, // 162.5M KES
        loans_by_status: [
          { status: 'pending', count: 8 },
          { status: 'under_review', count: 12 },
          { status: 'approved', count: 15 },
          { status: 'disbursed', count: 10 },
          { status: 'closed', count: 3 },
        ],
        recent_events: [],
      };

      try {
        const response = await apiClient.getAdminDashboard();
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
            {[1, 2, 3].map((i) => (
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
              title="Total Loan Applications"
              value={dashboardData?.total_loans || 0}
              icon="Banknote"
              delay={0.1}
            />
            <StatCard
              title="Active Customers"
              value={dashboardData?.total_customers || 0}
              icon="Users"
              delay={0.15}
            />
            <StatCard
              title="Total Disbursed Amount"
              value={`$${((dashboardData?.total_disbursed || 0) / 1000).toFixed(0)}K`}
              icon="DollarSign"
              delay={0.2}
            />
          </>
        )}
      </div>

      {/* Chart Section */}
      {loading ? (
        <motion.div
          className="card skeleton-shimmer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ minHeight: '350px' }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', damping: 25 }}
        >
          <Card hoverable>
            <div className="mb-6 pb-6 border-b border-border">
              <h2 className="text-heading text-primary font-bold mb-2 flex items-center gap-2">
                <Icon name="BarChart2" size={24} color="primary" />
                Loan Distribution by Status
              </h2>
              <p className="text-body-small text-muted">
                Overview of how many loan applications are in each status
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dashboardData?.loans_by_status.map((item) => ({
                  name: item.status.replace(/_/g, ' ').charAt(0).toUpperCase() + item.status.replace(/_/g, ' ').slice(1),
                  count: item.count,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.625rem',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  labelStyle={{ color: 'var(--text)' }}
                  cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                />
                <Legend
                  wrapperStyle={{
                    color: 'var(--text-muted)',
                    paddingTop: '1.5rem',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
