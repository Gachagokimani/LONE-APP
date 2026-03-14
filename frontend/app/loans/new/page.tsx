'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

export default function NewLoanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    interest_rate: '',
    term_months: '',
    purpose: '',
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadCustomers = async () => {
      try {
        const response = await apiClient.getCustomers();
        setCustomers(response.data.results || response.data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      }
    };

    loadCustomers();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loanData = {
        customer: formData.customer,
        amount: parseFloat(formData.amount),
        interest_rate: parseFloat(formData.interest_rate),
        term_months: parseInt(formData.term_months),
        purpose: formData.purpose,
      };

      const response = await apiClient.createLoan(loanData);
      router.push(`/loans/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.isAuthenticated()) {
    return <div className="loading">Checking authentication...</div>;
  }

  return (
    <div>
      <button onClick={() => router.back()} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <div className="container" style={{ maxWidth: '600px' }}>
        <h1>Create New Loan Application</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer">Customer</label>
            <select
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Loan Amount ($)</label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="10000"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="interest_rate">Interest Rate (% per annum)</label>
            <input
              id="interest_rate"
              type="number"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleInputChange}
              placeholder="5.5"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="term_months">Term (Months)</label>
            <input
              id="term_months"
              type="number"
              name="term_months"
              value={formData.term_months}
              onChange={handleInputChange}
              placeholder="12"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Loan Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the purpose of this loan"
              rows={4}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Loan Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
