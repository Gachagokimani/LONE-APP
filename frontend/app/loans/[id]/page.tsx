'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';

interface LoanDetail {
  id: string;
  customer_details: any;
  amount: number;
  interest_rate: number;
  term_months: number;
  status: string;
  purpose: string;
  applied_at: string;
  current_balance: number;
  total_paid: number;
  disbursed_at?: string;
}

interface LoanEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  metadata: any;
}

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params.id as string;

  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [events, setEvents] = useState<LoanEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    
    if (!isDev && !auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadLoan = async () => {
      const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
      const fallbackLoan: LoanDetail = {
        id: loanId,
        customer_details: { full_name: 'Kamau Njoroge', email: 'kamau.njoroge@example.com' },
        amount: 650000,
        interest_rate: 5.5,
        term_months: 60,
        status: 'approved',
        purpose: 'Home Improvement',
        applied_at: new Date().toISOString(),
        current_balance: 455000,
        total_paid: 195000,
        disbursed_at: new Date(Date.now() - 86400000).toISOString(),
      };

      try {
        const loanResponse = await apiClient.getLoanById(loanId);
        setLoan(loanResponse.data);
        setNewStatus(loanResponse.data.status);

        const eventsResponse = await apiClient.getLoanEvents(loanId);
        setEvents(eventsResponse.data.results || eventsResponse.data);
      } catch (err: any) {
        // In dev mode, use fallback data instead of error
        if (isDev) {
          setLoan(fallbackLoan);
          setNewStatus(fallbackLoan.status);
          setEvents([]);
        } else {
          setError(err.response?.data?.error || 'Failed to load loan');
        }
      } finally {
        setLoading(false);
      }
    };

    loadLoan();
  }, [loanId, router]);

  const handleStatusChange = async () => {
    if (!loan) return;
    try {
      await apiClient.changeLoanStatus(loanId, newStatus);
      setLoan({ ...loan, status: newStatus });
      alert('Status updated successfully');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

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
    return <div className="loading">Loading loan details...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!loan) {
    return <div>Loan not found</div>;
  }

  return (
    <div>
      <button onClick={() => router.back()} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <div className="grid">
        <div className="card">
          <div className="card-header">Loan Amount</div>
          <div className="card-body">${loan.amount.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-header">Current Balance</div>
          <div className="card-body">${loan.current_balance.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-header">Total Paid</div>
          <div className="card-body">${loan.total_paid.toLocaleString()}</div>
        </div>
      </div>

      <div className="container">
        <h2>Loan Details</h2>
        <table>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold', width: '20%' }}>Loan ID</td>
              <td>{loan.id}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Customer</td>
              <td>
                <strong>{loan.customer_details?.full_name}</strong>
                <br />
                {loan.customer_details?.email}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Status</td>
              <td>{getStatusBadge(loan.status)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Purpose</td>
              <td>{loan.purpose}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Interest Rate</td>
              <td>{loan.interest_rate}% per annum</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Term</td>
              <td>{loan.term_months} months</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Applied At</td>
              <td>{new Date(loan.applied_at).toLocaleDateString()}</td>
            </tr>
            {loan.disbursed_at && (
              <tr>
                <td style={{ fontWeight: 'bold' }}>Disbursed At</td>
                <td>{new Date(loan.disbursed_at).toLocaleDateString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="container mt-3">
        <h2>Update Status</h2>
        <div className="form-group">
          <label htmlFor="status-select">New Status</label>
          <select id="status-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="disbursed">Disbursed</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={handleStatusChange} style={{ marginTop: '1rem' }}>
            Update Status
          </button>
        </div>
      </div>

      <div className="container mt-3">
        <h2>Event Timeline</h2>
        {events.length === 0 ? (
          <p className="text-muted">No events recorded</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.event_type}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
