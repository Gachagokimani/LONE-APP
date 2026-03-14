'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { auth } from '@/lib/auth';

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    employment_status: 'employed',
    monthly_income: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const customerData = {
        ...formData,
        monthly_income: parseFloat(formData.monthly_income),
      };

      const response = await apiClient.createCustomer(customerData);
      router.push(`/customers/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create customer');
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
        <h1>Create New Customer</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              id="date_of_birth"
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employment_status">Employment Status</label>
            <select
              id="employment_status"
              name="employment_status"
              value={formData.employment_status}
              onChange={handleInputChange}
            >
              <option value="employed">Employed</option>
              <option value="self_employed">Self Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="monthly_income">Monthly Income ($)</label>
            <input
              id="monthly_income"
              type="number"
              name="monthly_income"
              value={formData.monthly_income}
              onChange={handleInputChange}
              placeholder="5000"
              step="0.01"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}
