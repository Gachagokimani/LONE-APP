'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  employment_status: string;
  monthly_income: number;
  created_at: string;
  updated_at: string;
}

interface Loan {
  id: string;
  amount: number;
  status: string;
  applied_at: string;
  interest_rate: number;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadCustomer = async () => {
      try {
        const customerResponse = await apiClient.getCustomerById(customerId);
        setCustomer(customerResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load customer');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [customerId, router]);

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      pending: 'badge-warning',
      under_review: 'badge-info',
      approved: 'badge-success',
      rejected: 'badge-danger',
      disbursed: 'badge-success',
      closed: 'badge-info',
    }[status] || 'badge-info';

    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading customer details...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div>
      <button onClick={() => router.back()} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <div className="container">
        <h1>{customer.full_name}</h1>

        <table>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold', width: '20%' }}>Email</td>
              <td>{customer.email}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Phone</td>
              <td>{customer.phone}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Date of Birth</td>
              <td>{new Date(customer.date_of_birth).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Address</td>
              <td>{customer.address}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Employment Status</td>
              <td>{customer.employment_status}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Monthly Income</td>
              <td>${customer.monthly_income.toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Member Since</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container mt-3">
        <h2>Loans</h2>
        {!loans || loans.length === 0 ? (
          <p className="text-muted">No loans found for this customer</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Amount</th>
                <th>Interest Rate</th>
                <th>Status</th>
                <th>Applied At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>${loan.amount.toLocaleString()}</td>
                  <td>{loan.interest_rate}%</td>
                  <td>{getStatusBadge(loan.status)}</td>
                  <td>{new Date(loan.applied_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/loans/${loan.id}`)}
                      style={{ background: '#0070f3' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
