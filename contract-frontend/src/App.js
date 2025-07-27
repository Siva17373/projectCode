import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import ClientProfileSetup from './pages/client/ClientProfileSetup';
import { useAuth } from './context/AuthContext';

// Dashboard Pages
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ContractorDashboard from './pages/dashboard/ContractorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Profile Pages
import ContractorProfile from './pages/contractor/ContractorProfile';
import ProfileSetup from './pages/contractor/ProfileSetup';

// Other Pages
import SearchContractors from './pages/client/SearchContractors';
import BookingHistory from './pages/client/BookingHistory';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-secondary-50">
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Protected Dashboard Routes - THESE ARE THE NEW ROUTES */}
                <Route path="/client-dashboard" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/contractor-dashboard" element={
                  <ProtectedRoute allowedRoles={['contractor']}>
                    <ContractorDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Generic Dashboard Route - redirects based on role */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } />
                
                {/* Other Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ContractorProfile />
                  </ProtectedRoute>
                } />
                
                {/* Role-specific profile setup routes */}
                <Route path="/contractor/profile-setup" element={
                  <ProtectedRoute allowedRoles={['contractor']}>
                    <ProfileSetup />
                  </ProtectedRoute>
                } />
                
                <Route path="/client/profile-setup" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientProfileSetup />
                  </ProtectedRoute>
                } />
                
                {/* Generic profile setup - redirects to role-specific */}
                <Route path="/profile/setup" element={
                  <ProtectedRoute>
                    <ProfileSetupRouter />
                  </ProtectedRoute>
                } />
                
                <Route path="/search" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <SearchContractors />
                  </ProtectedRoute>
                } />
                
                <Route path="/bookings" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <BookingHistory />
                  </ProtectedRoute>
                } />
                
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Profile Setup Router Component - redirects to role-specific setup
const ProfileSetupRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === 'contractor') {
    return <Navigate to="/contractor/profile-setup" replace />;
  } else if (user?.role === 'client') {
    return <Navigate to="/client/profile-setup" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Dashboard Router Component - Updated to use actual auth context
const DashboardRouter = () => {
  const { user } = useAuth(); // Import useAuth and use actual user data
  
  if (user?.role === 'client') {
    return <Navigate to="/client-dashboard" replace />;
  } else if (user?.role === 'contractor') {
    return <Navigate to="/contractor-dashboard" replace />;
  } else if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default App;