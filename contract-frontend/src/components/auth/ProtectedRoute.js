// Update your ProtectedRoute component (usually in components/auth/ProtectedRoute.js)

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has the right role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on their actual role
    if (user.role === 'client') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (user.role === 'contractor') {
      return <Navigate to="/contractor-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Only redirect to profile setup if user explicitly needs it
  // Remove this automatic redirect or make it conditional
  // if (!user.profileCompleted && !location.pathname.includes('/profile/setup')) {
  //   return <Navigate to="/profile/setup" replace />;
  // }

  return children;
};

export default ProtectedRoute;