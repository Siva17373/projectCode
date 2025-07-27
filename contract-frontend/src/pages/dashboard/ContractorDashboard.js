import React, { useState, useEffect } from 'react';
import { 
  Calendar, DollarSign, Star, TrendingUp, Users, Clock, MapPin, 
  Phone, MessageCircle, CheckCircle, AlertCircle, Edit3, Eye, 
  BarChart3, User, Settings, Briefcase, Award, Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useContractorApi from '../../hooks/useContractorApi';

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use custom API hook
  const {
    loading,
    error,
    fetchDashboardData,
    fetchEarningsData,
    respondToJob,
    updateJobStatus,
    updateProfile
  } = useContractorApi();

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    user: {},
    stats: {},
    jobRequests: [],
    activeJobs: [],
    recentReviews: []
  });

  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    periodEarnings: 0,
    averagePerJob: 0,
    pendingAmount: 0,
    transactions: []
  });

  // State for quote modal
  const [quoteModal, setQuoteModal] = useState({ isOpen: false, jobId: null, jobTitle: '' });
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    businessName: '',
    services: '',
    experience: '',
    phone: '',
    address: ''
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      // Update profile form when dashboard data is loaded
      if (data.user) {
        setProfileForm({
          name: (data.user.firstName || '') + ' ' + (data.user.lastName || ''),
          businessName: data.user.businessName || '',
          services: data.user.services?.join(', ') || '',
          experience: data.user.experience || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  // Load earnings data
  const loadEarningsData = async (period = 'month') => {
    try {
      const data = await fetchEarningsData(period);
      setEarningsData(data);
    } catch (err) {
      console.error('Failed to load earnings data:', err);
    }
  };

  // Handle job request response
  const handleJobResponse = async (bookingId, action, quote = null) => {
    try {
      await respondToJob(bookingId, action, quote);
      await loadDashboardData(); // Refresh data
      const actionText = action === 'accept' ? 'accepted' : action === 'reject' ? 'declined' : 'quoted';
      alert(`Job ${actionText} successfully!`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Handle job status update
  const handleJobStatusUpdate = async (bookingId, status) => {
    try {
      setDashboardData(prev => ({
        ...prev,
        activeJobs: prev.activeJobs.map(job => 
          job.id === bookingId 
            ? { ...job, status: status.replace('-', '_'), progress: status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0 }
            : job
        )
      }));

      await updateJobStatus(bookingId, status);
      await loadDashboardData(); // Refresh to get accurate data
      alert('Job status updated successfully!');
    } catch (err) {
      await loadDashboardData();
      alert(`Error: ${err.message}`);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (profileData) => {
    try {
      if (!profileData.name.trim()) throw new Error('Name is required');
      await updateProfile(profileData);
      await loadDashboardData();
      alert('Profile updated successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Quote modal functions
  const openQuoteModal = (jobId, jobTitle) => setQuoteModal({ isOpen: true, jobId, jobTitle });
  const closeQuoteModal = () => setQuoteModal({ isOpen: false, jobId: null, jobTitle: '' });
  const submitQuote = async (amount, message) => await handleJobResponse(quoteModal.jobId, 'quote', amount);

  // Profile form handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const profileData = {
      name: profileForm.name,
      businessName: profileForm.businessName,
      services: profileForm.services.split(',').map(s => ({
        category: s.trim(),
        description: '',
        price: 50,
        priceType: 'hourly'
      })),
      experience: parseInt(profileForm.experience) || 0,
      phone: profileForm.phone,
      address: profileForm.address
    };
    await handleProfileUpdate(profileData);
    setIsEditing(false);
  };

  useEffect(() => { loadDashboardData(); }, []);
  useEffect(() => { if (activeTab === 'earnings') loadEarningsData(); }, [activeTab]);

  // Utility functions
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
      case 'accepted': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'in_progress': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
      case 'accepted': return <Calendar className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending_approval': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));

  // Quick Quote Modal Component
  const QuoteModal = ({ isOpen, onClose, onSubmit, jobTitle }) => {
    const [quote, setQuote] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!quote || isNaN(quote) || parseFloat(quote) <= 0) {
        alert('Please enter a valid quote amount');
        return;
      }
      onSubmit(parseFloat(quote), message);
      setQuote('');
      setMessage('');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Send Quote for {jobTitle}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your quote"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add a message to your quote..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Quote
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && !dashboardData.stats.totalEarnings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  // Error state
  if (error && !dashboardData.stats.totalEarnings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ----- TAB RENDERERS -----

  // Overview Tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome + Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {dashboardData.user?.firstName || user?.name?.split(' ')[0] || 'Contractor'}!
        </h1>
        <p className="text-blue-100 mb-6">
          Here's an overview of your business performance and upcoming opportunities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors cursor-pointer">
            <DollarSign className="h-6 w-6 mb-2" />
            <div className="font-semibold">${dashboardData.stats?.monthlyEarnings?.toLocaleString() || 0}</div>
            <div className="text-sm text-blue-100">This month's earnings</div>
          </div>
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors cursor-pointer">
            <Star className="h-6 w-6 mb-2" />
            <div className="font-semibold">{dashboardData.stats?.averageRating || 0}/5.0</div>
            <div className="text-sm text-blue-100">Average rating</div>
          </div>
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors cursor-pointer">
            <Users className="h-6 w-6 mb-2" />
            <div className="font-semibold">{dashboardData.jobRequests?.length || 0}</div>
            <div className="text-sm text-blue-100">New job requests</div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${dashboardData.stats?.totalEarnings?.toLocaleString() || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats?.completedJobs || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{dashboardData.stats?.activeJobs || 0} this month
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats?.averageRating || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Based on {dashboardData.stats?.totalReviews || 0} reviews
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats?.responseRate || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            Excellent response time
          </div>
        </div>
      </div>
      {/* Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Jobs</h2>
            <button 
              onClick={() => setActiveTab('jobs')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.activeJobs?.slice(0, 3).map((job) => (
              <div key={job.id} className="flex flex-col md:flex-row md:items-start border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">Client: {job.client.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center border ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Due: {new Date(job.estimatedCompletion).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>${job.payment}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{job.client.phone}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Due: {new Date(job.estimatedCompletion).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${job.payment}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-48">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                  {job.status === 'accepted' && (
                    <button 
                      onClick={() => handleJobStatusUpdate(job.id, 'in_progress')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      Start Job
                    </button>
                  )}
                  {job.status === 'in_progress' && (
                    <button 
                      onClick={() => handleJobStatusUpdate(job.id, 'completed')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
            {(!dashboardData.activeJobs || dashboardData.activeJobs.length === 0) && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
                <p className="text-gray-600">Jobs you accept will appear here</p>
              </div>
            )}
          </div>
        </div>
        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
            <button 
              onClick={() => setActiveTab('profile')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentReviews?.length > 0 ? (
              dashboardData.recentReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{review.clientName}</div>
                      <div className="text-sm text-gray-600">{review.job} • {new Date(review.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Job Requests Tab
  const renderJobRequestsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Requests</h2>
        <div className="flex space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Carpentry</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Urgency</option>
            <option>High Priority</option>
            <option>Medium Priority</option>
            <option>Low Priority</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {dashboardData.jobRequests?.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {request.client.avatar || request.client.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency} priority
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {request.client.name}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {request.client.location} ({request.distance})
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      {request.client.rating}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{request.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Budget:</span><br />
                      {request.budget}
                    </div>
                    <div>
                      <span className="font-medium">Preferred Date:</span><br />
                      {new Date(request.preferredDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Posted:</span><br />
                      {request.postedTime}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => openQuoteModal(request.id, request.title)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  Send Quote
                </button>
                <button 
                  onClick={() => handleJobResponse(request.id, 'accept')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={loading}
                >
                  Accept Job
                </button>
                <button 
                  onClick={() => handleJobResponse(request.id, 'reject')}
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
                  disabled={loading}
                >
                  Not Interested
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {(!dashboardData.jobRequests || dashboardData.jobRequests.length === 0) && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job requests available</h3>
          <p className="text-gray-600 mb-4">
            Check back later for new opportunities matching your services
          </p>
        </div>
      )}
    </div>
  );

  // My Jobs Tab
  const renderJobsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
        <div className="flex space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Pending Approval</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {dashboardData.activeJobs?.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {job.client.avatar || job.client.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center border ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">Client: {job.client.name}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Due: {new Date(job.estimatedCompletion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${job.payment}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{job.client.phone}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Due: {new Date(job.estimatedCompletion).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${job.payment}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </button>
                {job.status === 'accepted' && (
                  <button 
                    onClick={() => handleJobStatusUpdate(job.id, 'in_progress')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    Start Job
                  </button>
                )}
                {job.status === 'in_progress' && (
                  <button 
                    onClick={() => handleJobStatusUpdate(job.id, 'completed')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!dashboardData.activeJobs || dashboardData.activeJobs.length === 0) && (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No active jobs</p>
          </div>
        )}
      </div>
    </div>
  );

  // Earnings Tab  
  const renderEarningsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
        <div className="flex space-x-3">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => loadEarningsData(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
            <p className="text-3xl font-bold text-blue-600">${earningsData.totalEarnings?.toLocaleString() || 0}</p>
            <p className="text-sm text-green-600 mt-1">All time</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Period Earnings</p>
            <p className="text-3xl font-bold text-gray-900">${earningsData.periodEarnings?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-600 mt-1">From {earningsData.jobCount || 0} jobs</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average per Job</p>
            <p className="text-3xl font-bold text-gray-900">${Math.round(earningsData.averagePerJob || 0)}</p>
            <p className="text-sm text-blue-600 mt-1">Per completed job</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">${earningsData.pendingAmount || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Awaiting payment</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Earnings chart will be displayed here</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {earningsData.transactions?.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{transaction.job}</h4>
                <p className="text-sm text-gray-600">Client: {transaction.client}</p>
                <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${transaction.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {(!earningsData.transactions || earningsData.transactions.length === 0) && (
          <div className="text-center py-8">
            <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );

  // Profile Tab
  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={profileForm.businessName}
                  onChange={(e) => setProfileForm({...profileForm, businessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services (comma-separated)
                </label>
                <input
                  type="text"
                  value={profileForm.services}
                  onChange={(e) => setProfileForm({...profileForm, services: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Plumbing, Electrical, Carpentry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={profileForm.experience}
                  onChange={(e) => setProfileForm({...profileForm, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {dashboardData.user?.firstName?.[0]}{dashboardData.user?.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {dashboardData.user?.businessName || `${dashboardData.user?.firstName || ''} ${dashboardData.user?.lastName || ''}`}
                </h3>
                <p className="text-gray-600">{dashboardData.user?.services?.join(', ') || 'Professional Contractor'}</p>
                <div className="flex items-center mt-2">
                  <div className="flex mr-3">
                    {renderStars(dashboardData.stats?.averageRating || 0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {dashboardData.stats?.averageRating || 0} ({dashboardData.stats?.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.stats?.completedJobs || 0}</div>
                <div className="text-sm text-gray-600">Jobs Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.stats?.responseRate || 0}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.stats?.repeatClients || 0}%</div>
                <div className="text-sm text-gray-600">Repeat Clients</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.user?.experience || '0'}+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <Edit3 className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Update Profile</div>
                <div className="text-sm text-gray-600">Edit your services, rates, and availability</div>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">View Public Profile</div>
                <div className="text-sm text-gray-600">See how clients view your profile</div>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Add Certifications</div>
                <div className="text-sm text-gray-600">Showcase your professional credentials</div>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Account Settings</div>
                <div className="text-sm text-gray-600">Manage notifications and preferences</div>
              </div>
            </div>
          </button>
        </div>
      </div>
      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-green-900">Great Response Rate!</div>
                <div className="text-sm text-green-700">You respond to {dashboardData.stats?.responseRate || 0}% of job requests</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-blue-900">Excellent Ratings</div>
                <div className="text-sm text-blue-700">Your average rating is {dashboardData.stats?.averageRating || 0}/5.0</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <div className="font-medium text-yellow-900">Growing Business</div>
                <div className="text-sm text-yellow-700">{dashboardData.stats?.repeatClients || 0}% of your clients are repeat customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tabs Navigation
  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'requests', label: 'Job Requests', icon: Briefcase },
          { id: 'jobs', label: 'My Jobs', icon: Calendar },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.id === 'requests' && dashboardData.jobRequests?.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                  {dashboardData.jobRequests.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Tab Selector
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'requests': return renderJobRequestsTab();
      case 'jobs': return renderJobsTab();
      case 'earnings': return renderEarningsTab();
      case 'profile': return renderProfileTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contractor Dashboard</h1>
            <p className="text-gray-600">Manage your business and track your performance</p>
          </div>
          {renderTabNavigation()}
          {renderActiveTab()}
        </div>
      </div>
      <QuoteModal
        isOpen={quoteModal.isOpen}
        onClose={closeQuoteModal}
        onSubmit={submitQuote}
        jobTitle={quoteModal.jobTitle}
      />
    </>
  );
};

export default ContractorDashboard;
