import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Plus, Star, Clock, MapPin, Phone, MessageCircle,
  Calendar, DollarSign, CheckCircle, AlertCircle, Filter,
  User, Bookmark, History, Settings, Edit3, TrendingUp,
  Home, Briefcase, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [stats] = useState({
    totalBookings: 12,
    activeBookings: 2,
    completedBookings: 8,
    savedContractors: 6,
    totalSpent: 2850,
    averageRating: 4.7
  });

  const [recentBookings] = useState([
    {
      id: 1,
      contractor: { 
        name: 'John Smith', 
        avatar: 'JS', 
        rating: 4.8, 
        service: 'Plumbing',
        phone: '+1 (555) 123-4567'
      },
      status: 'in_progress',
      scheduledDate: '2024-01-25',
      description: 'Kitchen sink repair and faucet installation',
      price: 150,
      estimatedDuration: '2-3 hours',
      location: 'Kitchen'
    },
    {
      id: 2,
      contractor: { 
        name: 'Sarah Wilson', 
        avatar: 'SW', 
        rating: 4.9, 
        service: 'Electrical',
        phone: '+1 (555) 987-6543'
      },
      status: 'completed',
      scheduledDate: '2024-01-20',
      description: 'Ceiling fan installation in living room',
      price: 200,
      estimatedDuration: '1-2 hours',
      location: 'Living Room'
    },
    {
      id: 3,
      contractor: { 
        name: 'Mike Johnson', 
        avatar: 'MJ', 
        rating: 4.7, 
        service: 'Painting',
        phone: '+1 (555) 456-7890'
      },
      status: 'scheduled',
      scheduledDate: '2024-01-28',
      description: 'Interior painting - living room and bedroom',
      price: 800,
      estimatedDuration: '2 days',
      location: 'Multiple Rooms'
    }
  ]);

  const [savedContractors] = useState([
    {
      id: 1,
      name: 'David Brown',
      avatar: 'DB',
      rating: 4.9,
      services: ['Carpentry', 'Home Repairs'],
      location: 'Downtown',
      hourlyRate: 75,
      responseTime: '1 hour',
      completedJobs: 156,
      verified: true
    },
    {
      id: 2,
      name: 'Lisa Garcia',
      avatar: 'LG',
      rating: 4.8,
      services: ['Cleaning', 'Organization'],
      location: 'Midtown',
      hourlyRate: 45,
      responseTime: '30 mins',
      completedJobs: 203,
      verified: true
    },
    {
      id: 3,
      name: 'Robert Chen',
      avatar: 'RC',
      rating: 4.7,
      services: ['HVAC', 'Maintenance'],
      location: 'Uptown',
      hourlyRate: 85,
      responseTime: '2 hours',
      completedJobs: 89,
      verified: true
    }
  ]);

  const [recommendations] = useState([
    {
      id: 1,
      name: 'Anna Thompson',
      avatar: 'AT',
      rating: 4.9,
      service: 'Interior Design',
      location: 'Downtown',
      hourlyRate: 120,
      specialties: ['Modern Design', 'Space Planning'],
      availability: 'Available now',
      completedJobs: 87
    },
    {
      id: 2,
      name: 'Carlos Rivera',
      avatar: 'CR',
      rating: 4.8,
      service: 'Landscaping',
      location: 'Suburbs',
      hourlyRate: 60,
      specialties: ['Garden Design', 'Tree Care'],
      availability: 'Available next week',
      completedJobs: 124
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100 mb-6">
          Here's what's happening with your home projects and bookings.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors">
            <Calendar className="h-6 w-6 mb-2" />
            <div className="font-semibold">{stats.activeBookings}</div>
            <div className="text-sm text-blue-100">Active bookings</div>
          </div>
          
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors">
            <Bookmark className="h-6 w-6 mb-2" />
            <div className="font-semibold">{stats.savedContractors}</div>
            <div className="text-sm text-blue-100">Saved contractors</div>
          </div>
          
          <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors">
            <CheckCircle className="h-6 w-6 mb-2" />
            <div className="font-semibold">{stats.completedBookings}</div>
            <div className="text-sm text-blue-100">Completed projects</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/search"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-blue-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            Find Contractors
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Search for verified professionals
          </p>
        </Link>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200 group text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            Post a Job
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Get quotes from contractors
          </p>
        </button>

        <Link
          to="/bookings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-purple-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <History className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
            My Bookings
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            View all your bookings
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-orange-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            Profile Settings
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Update your preferences
          </p>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +2 this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Average: ${Math.round(stats.totalSpent / stats.totalBookings)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Based on your reviews
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Contractors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.savedContractors}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Ready to book
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {booking.contractor.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.description}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.contractor.name} • {booking.contractor.service}
                      </p>
                      <p className="text-sm text-gray-500">{booking.location}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status.replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">${booking.price}</span>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Contractors */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
            <Link to="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recommendations.map((contractor) => (
              <div key={contractor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {contractor.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                      <p className="text-sm text-gray-600">{contractor.service}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(contractor.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{contractor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${contractor.hourlyRate}/hr
                    </div>
                    <div className="text-xs text-green-600">{contractor.availability}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {contractor.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      Save
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <div className="flex space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {booking.contractor.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{booking.description}</h3>
                  <p className="text-gray-600">{booking.contractor.name} • {booking.contractor.service}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {booking.estimatedDuration}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.location}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1 capitalize">{booking.status.replace('_', ' ')}</span>
                </span>
                <div className="text-lg font-bold text-gray-900 mt-2">${booking.price}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(booking.contractor.rating)}
                </div>
                <span className="text-sm text-gray-600">{booking.contractor.rating}</span>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </button>
                {booking.status === 'completed' && (
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Leave Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSavedContractors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Contractors</h2>
        <Link to="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Find More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedContractors.map((contractor) => (
          <div key={contractor.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {contractor.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {contractor.name}
                    {contractor.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-600 ml-1" />
                    )}
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className="flex mr-2">
                      {renderStars(contractor.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{contractor.rating}</span>
                  </div>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                <Bookmark className="h-5 w-5 fill-current" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {contractor.services.map((service, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {service}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {contractor.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${contractor.hourlyRate}/hour
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Responds in {contractor.responseTime}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View Profile
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <Link to="/profile/setup" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Link>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{user?.phone}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>$0 - $100</option>
              <option>$100 - $500</option>
              <option>$500 - $1,000</option>
              <option>$1,000 - $5,000</option>
              <option>$5,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { id: 'booking_updates', label: 'Booking updates and status changes' },
            { id: 'new_messages', label: 'New messages from contractors' },
            { id: 'payment_reminders', label: 'Payment reminders and receipts' },
            { id: 'recommendations', label: 'Contractor recommendations' },
            { id: 'promotions', label: 'Promotions and special offers' }
          ].map((setting) => (
            <label key={setting.id} className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={setting.id !== 'promotions'}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <span className="text-gray-700">{setting.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${stats.totalSpent}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.savedContractors}</div>
            <div className="text-sm text-gray-600">Saved Contractors</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'bookings', label: 'My Bookings', icon: Calendar },
          { id: 'saved', label: 'Saved Contractors', icon: Bookmark },
          { id: 'profile', label: 'Profile', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.id === 'bookings' && stats.activeBookings > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {stats.activeBookings}
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
      case 'bookings':
        return renderBookingsTab();
      case 'saved':
        return renderSavedContractors();
      case 'profile':
        return renderProfileTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and find trusted contractors</p>
        </div>

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ClientDashboard;
            