import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, DollarSign, Star, TrendingUp, Users, Clock, MapPin, 
  Phone, MessageCircle, CheckCircle, AlertCircle, XCircle, 
  Edit3, Eye, BarChart3, User, Settings, Briefcase, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for contractor dashboard
  const [stats] = useState({
    totalEarnings: 15750,
    monthlyEarnings: 3250,
    completedJobs: 89,
    activeJobs: 3,
    averageRating: 4.8,
    totalReviews: 127,
    responseRate: 95,
    repeatClients: 78
  });

  const [jobRequests] = useState([
    {
      id: 1,
      client: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        location: 'Downtown',
        rating: 4.6
      },
      title: 'Kitchen Sink Repair',
      description: 'Kitchen sink is leaking from the pipe underneath. Need urgent repair.',
      budget: '$100-200',
      preferredDate: '2024-01-26',
      urgency: 'high',
      postedTime: '2 hours ago',
      distance: '2.3 miles'
    },
    {
      id: 2,
      client: {
        name: 'Mike Chen',
        avatar: 'MC',
        location: 'Midtown',
        rating: 4.9
      },
      title: 'Bathroom Fixture Installation',
      description: 'Need to install new bathroom fixtures including faucet and showerhead.',
      budget: '$300-500',
      preferredDate: '2024-01-28',
      urgency: 'medium',
      postedTime: '5 hours ago',
      distance: '4.1 miles'
    },
    {
      id: 3,
      client: {
        name: 'Lisa Rodriguez',
        avatar: 'LR',
        location: 'Uptown',
        rating: 4.7
      },
      title: 'Water Heater Maintenance',
      description: 'Annual water heater maintenance and inspection needed.',
      budget: '$150-300',
      preferredDate: '2024-02-01',
      urgency: 'low',
      postedTime: '1 day ago',
      distance: '6.8 miles'
    }
  ]);

  const [activeJobs] = useState([
    {
      id: 1,
      client: {
        name: 'David Wilson',
        avatar: 'DW',
        phone: '+1 (555) 123-4567'
      },
      title: 'Pipe Replacement',
      status: 'in_progress',
      scheduledDate: '2024-01-25',
      estimatedCompletion: '2024-01-25',
      payment: 450,
      progress: 75
    },
    {
      id: 2,
      client: {
        name: 'Emma Thompson',
        avatar: 'ET',
        phone: '+1 (555) 987-6543'
      },
      title: 'Faucet Installation',
      status: 'scheduled',
      scheduledDate: '2024-01-27',
      estimatedCompletion: '2024-01-27',
      payment: 200,
      progress: 0
    },
    {
      id: 3,
      client: {
        name: 'Robert Brown',
        avatar: 'RB',
        phone: '+1 (555) 456-7890'
      },
      title: 'Toilet Repair',
      status: 'pending_approval',
      scheduledDate: '2024-01-26',
      estimatedCompletion: '2024-01-26',
      payment: 175,
      progress: 100
    }
  ]);

  const [recentReviews] = useState([
    {
      id: 1,
      clientName: 'Jennifer Adams',
      rating: 5,
      date: '2024-01-20',
      comment: 'Excellent work! Very professional and completed the job perfectly.',
      job: 'Sink Installation'
    },
    {
      id: 2,
      clientName: 'Mark Davis',
      rating: 5,
      date: '2024-01-18',
      comment: 'Quick response time and fair pricing. Highly recommended!',
      job: 'Pipe Repair'
    },
    {
      id: 3,
      clientName: 'Amanda Wilson',
      rating: 4,
      date: '2024-01-15',
      comment: 'Good work overall. Arrived on time and cleaned up after.',
      job: 'Faucet Replacement'
    }
  ]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending_approval': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-secondary-300'
        }`}
      />
    ));
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-primary-100 mb-6">
          Here's an overview of your business performance and upcoming opportunities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors">
            <DollarSign className="h-6 w-6 mb-2" />
            <div className="font-semibold">${stats.monthlyEarnings}</div>
            <div className="text-sm text-primary-100">This month's earnings</div>
          </div>
          
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors">
            <Star className="h-6 w-6 mb-2" />
            <div className="font-semibold">{stats.averageRating}/5.0</div>
            <div className="text-sm text-primary-100">Average rating</div>
          </div>
          
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors">
            <Users className="h-6 w-6 mb-2" />
            <div className="font-semibold">{jobRequests.length}</div>
            <div className="text-sm text-primary-100">New job requests</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Earnings</p>
              <p className="text-2xl font-bold text-secondary-900">${stats.totalEarnings.toLocaleString()}</p>
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

        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.completedJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8 this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Average Rating</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-secondary-600">
            Based on {stats.totalReviews} reviews
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Response Rate</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.responseRate}%</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Active Jobs</h2>
            <Link to="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {activeJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{job.title}</h3>
                    <p className="text-sm text-secondary-600">Client: {job.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                    <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-secondary-600 mb-1">
                    <span>Progress</span>
                    <span>{job.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">
                    Due: {new Date(job.estimatedCompletion).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-secondary-900">
                    ${job.payment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-custom p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Reviews</h2>
            <Link to="/profile" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-secondary-900">{review.clientName}</div>
                    <div className="text-sm text-secondary-600">{review.job} • {new Date(review.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-secondary-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobRequestsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">Job Requests</h2>
        <div className="flex space-x-3">
          <select className="input-field text-sm">
            <option>All Categories</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Carpentry</option>
          </select>
          <select className="input-field text-sm">
            <option>All Urgency</option>
            <option>High Priority</option>
            <option>Medium Priority</option>
            <option>Low Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-custom p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {request.client.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-secondary-900">{request.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency} priority
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
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
                  
                  <p className="text-secondary-700 mb-4">{request.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-secondary-600">
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
                <button className="btn-primary text-sm">
                  Send Quote
                </button>
                <button className="btn-secondary text-sm">
                  View Details
                </button>
                <button className="text-secondary-600 hover:text-secondary-800 text-sm">
                  Not Interested
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobRequests.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No job requests available</h3>
          <p className="text-secondary-600 mb-4">
            Check back later for new opportunities matching your services
          </p>
        </div>
      )}
    </div>
  );

  const renderJobsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">My Jobs</h2>
        <div className="flex space-x-3">
          <select className="input-field text-sm">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Pending Approval</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {activeJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-custom p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {job.client.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-secondary-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  
                  <p className="text-secondary-600 mb-3">Client: {job.client.name}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-secondary-600 mb-4">
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

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-secondary-600 mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button className="btn-secondary text-sm flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button className="btn-secondary text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </button>
                {job.status === 'in_progress' && (
                  <button className="btn-primary text-sm">
                    Update Progress
                  </button>
                )}
                {job.status === 'pending_approval' && (
                  <button className="btn-primary text-sm">
                    Request Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEarningsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">Earnings</h2>
        <div className="flex space-x-3">
          <select className="input-field text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="text-center">
            <p className="text-sm font-medium text-secondary-600">Total Earnings</p>
            <p className="text-3xl font-bold text-primary-600">${stats.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">+15% from last month</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="text-center">
            <p className="text-sm font-medium text-secondary-600">This Month</p>
            <p className="text-3xl font-bold text-secondary-900">${stats.monthlyEarnings.toLocaleString()}</p>
            <p className="text-sm text-secondary-600 mt-1">From {activeJobs.length} jobs</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="text-center">
            <p className="text-sm font-medium text-secondary-600">Average per Job</p>
            <p className="text-3xl font-bold text-secondary-900">${Math.round(stats.totalEarnings / stats.completedJobs)}</p>
            <p className="text-sm text-blue-600 mt-1">+8% increase</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-custom">
          <div className="text-center">
            <p className="text-sm font-medium text-secondary-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">$625</p>
            <p className="text-sm text-secondary-600 mt-1">Awaiting payment</p>
          </div>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Earnings Overview</h3>
        <div className="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-secondary-400 mx-auto mb-2" />
            <p className="text-secondary-600">Earnings chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[
            { id: 1, client: 'Sarah Johnson', job: 'Kitchen Sink Repair', amount: 150, date: '2024-01-22', status: 'completed' },
            { id: 2, client: 'Mike Chen', job: 'Faucet Installation', amount: 200, date: '2024-01-20', status: 'completed' },
            { id: 3, client: 'Lisa Rodriguez', job: 'Pipe Repair', amount: 275, date: '2024-01-18', status: 'pending' }
          ].map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-secondary-900">{transaction.job}</h4>
                <p className="text-sm text-secondary-600">Client: {transaction.client}</p>
                <p className="text-xs text-secondary-500">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-secondary-900">${transaction.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">Profile Management</h2>
        <Link to="/profile" className="btn-primary flex items-center">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Link>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-secondary-900">
              {user?.businessName || `${user?.firstName} ${user?.lastName}`}
            </h3>
            <p className="text-secondary-600">{user?.services?.join(', ') || 'Professional Contractor'}</p>
            <div className="flex items-center mt-2">
              <div className="flex mr-3">
                {renderStars(stats.averageRating)}
              </div>
              <span className="text-sm text-secondary-600">
                {stats.averageRating} ({stats.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{stats.completedJobs}</div>
            <div className="text-sm text-secondary-600">Jobs Completed</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{stats.responseRate}%</div>
            <div className="text-sm text-secondary-600">Response Rate</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{stats.repeatClients}%</div>
            <div className="text-sm text-secondary-600">Repeat Clients</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{user?.experience || '5+'}</div>
            <div className="text-sm text-secondary-600">Years Experience</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/profile" className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
            <div className="flex items-center">
              <Edit3 className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-secondary-900">Update Profile</div>
                <div className="text-sm text-secondary-600">Edit your services, rates, and availability</div>
              </div>
            </div>
          </Link>

          <button className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors text-left">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-secondary-900">View Public Profile</div>
                <div className="text-sm text-secondary-600">See how clients view your profile</div>
              </div>
            </div>
          </button>

          <button className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors text-left">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-secondary-900">Add Certifications</div>
                <div className="text-sm text-secondary-600">Showcase your professional credentials</div>
              </div>
            </div>
          </button>

          <button className="p-4 border rounded-lg hover:bg-secondary-50 transition-colors text-left">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <div className="font-medium text-secondary-900">Account Settings</div>
                <div className="text-sm text-secondary-600">Manage notifications and preferences</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Performance Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-green-900">Great Response Rate!</div>
                <div className="text-sm text-green-700">You respond to 95% of job requests</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-blue-900">Excellent Ratings</div>
                <div className="text-sm text-blue-700">Your average rating is 4.8/5.0</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <div className="font-medium text-yellow-900">Growing Business</div>
                <div className="text-sm text-yellow-700">78% of your clients are repeat customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabNavigation = () => (
    <div className="border-b border-secondary-200 mb-8">
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
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.id === 'requests' && jobRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                  {jobRequests.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'requests':
        return renderJobRequestsTab();
      case 'jobs':
        return renderJobsTab();
      case 'earnings':
        return renderEarningsTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Contractor Dashboard</h1>
          <p className="text-secondary-600">Manage your business and track your performance</p>
        </div>

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ContractorDashboard;