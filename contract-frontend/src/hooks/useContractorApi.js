import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL =  'http://localhost:5001/api';

export const useContractorApi = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      }); 

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Dashboard data
  const fetchDashboardData = useCallback(async () => {
    return makeRequest('/contractor/dashboard');
  }, [makeRequest]);

  // Earnings data
  const fetchEarningsData = useCallback(async (period = 'month') => {
    return makeRequest(`/contractor/earnings?period=${period}`);
  }, [makeRequest]);

  // Job responses
  const respondToJob = useCallback(async (bookingId, action, quote = null) => {
    return makeRequest('/contractor/respond-to-job', {
      method: 'POST',
      body: JSON.stringify({ bookingId, action, quote }),
    });
  }, [makeRequest]);

  // Job status updates
  const updateJobStatus = useCallback(async (bookingId, status) => {
    return makeRequest('/contractor/update-job-status', {
      method: 'PUT',
      body: JSON.stringify({ bookingId, status }),
    });
  }, [makeRequest]);

  // Profile updates
  const updateProfile = useCallback(async (profileData) => {
    return makeRequest('/contractor/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }, [makeRequest]);

  // Booking operations
  const fetchBookingDetails = useCallback(async (bookingId) => {
    return makeRequest(`/bookings/${bookingId}`);
  }, [makeRequest]);

  const updateBookingStatus = useCallback(async (bookingId, status) => {
    return makeRequest(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }, [makeRequest]);

  const updatePaymentStatus = useCallback(async (bookingId, paymentStatus) => {
    return makeRequest(`/bookings/${bookingId}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus }),
    });
  }, [makeRequest]);

  return {
    loading,
    error,
    fetchDashboardData,
    fetchEarningsData,
    respondToJob,
    updateJobStatus,
    updateProfile,
    fetchBookingDetails,
    updateBookingStatus,
    updatePaymentStatus,
  };
};

export default useContractorApi;