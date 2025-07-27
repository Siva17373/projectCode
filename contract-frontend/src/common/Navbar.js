import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, User, LogOut, Settings, Search, Calendar, 
  Bookmark, MessageCircle, Bell, ChevronDown, Home,
  Briefcase, Award, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const clientNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Find Contractors', path: '/search', icon: Search },
    { name: 'My Bookings', path: '/bookings', icon: Calendar },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Messages', path: '/chat', icon: MessageCircle }
  ];

  const contractorNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Job Requests', path: '/jobs', icon: Briefcase },
    { name: 'My Jobs', path: '/my-jobs', icon: Calendar },
    { name: 'Earnings', path: '/earnings', icon: DollarSign },
    { name: 'Messages', path: '/chat', icon: MessageCircle }
  ];

  const getNavItems = () => {
    if (!isAuthenticated) return [];
    return user?.role === 'contractor' ? contractorNavItems : clientNavItems;
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderAuthenticatedNav = () => (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:space-x-1">
        {getNavItems().map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActivePath(item.path)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Notifications & Profile */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <span className="text-sm font-medium">{user?.firstName}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-3" />
                View Profile
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Link>
              
              {user?.role === 'contractor' && (
                <Link
                  to="/profile/setup"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Award className="h-4 w-4 mr-3" />
                  Complete Profile
                </Link>
              )}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </>
  );

  const renderUnauthenticatedNav = () => (
    <>
      <div className="hidden md:flex md:items-center md:space-x-6">
        <Link
          to="/search"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Find Contractors
        </Link>
        <Link
          to="/how-it-works"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          How It Works
        </Link>
        <Link
          to="/register"
          state={{ userType: 'contractor' }}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Join as Contractor
        </Link>
      </div>

      <div className="hidden md:flex md:items-center md:space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </>
  );

  const renderMobileMenu = () => (
    <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
        {isAuthenticated ? (
          <>
            {/* Mobile Navigation Items */}
            {getNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 pt-4">
              {/* Profile Section */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
              
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                View Profile
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Unauthenticated Mobile Menu */}
            <Link
              to="/search"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Contractors
            </Link>
            <Link
              to="/how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/register"
              state={{ userType: 'contractor' }}
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join as Contractor
            </Link>
            
            <div className="border-t border-gray-200 pt-4">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Don't show navbar on auth pages
  if (['/login', '/register', '/forgot-password'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ConTract
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? renderAuthenticatedNav() : renderUnauthenticatedNav()}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      {/* Click outside to close profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;