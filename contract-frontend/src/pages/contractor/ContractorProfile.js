import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Edit3, Camera, MapPin, Star, Clock, DollarSign, Phone, Mail, 
  Calendar, Award, Briefcase, Image, Plus, X, Save, Check, 
  User, Shield, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContractorProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Profile data state
  const [profileData, setProfileData] = useState({
    profileImage: user?.profileImage || null,
    businessName: user?.businessName || '',
    bio: user?.bio || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    hourlyRate: user?.hourlyRate || '',
    experience: user?.experience || '',
    services: user?.services || [],
    skills: user?.skills || [],
    certifications: user?.certifications || [],
    portfolio: user?.portfolio || [],
    availability: user?.availability || {
      monday: { available: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
      thursday: { available: false, startTime: '09:00', endTime: '17:00' },
      friday: { available: false, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '09:00', endTime: '17:00' },
      sunday: { available: false, startTime: '09:00', endTime: '17:00' }
    }
  });

  // Mock data for reviews and stats
  const [stats] = useState({
    rating: 4.8,
    totalReviews: 127,
    completedJobs: 89,
    responseTime: '2 hours',
    repeatClients: 78
  });

  const [reviews] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent work! Very professional and completed the job on time. Would definitely hire again.',
      service: 'Plumbing'
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      rating: 5,
      date: '2024-01-10',
      comment: 'Great communication throughout the project. High quality work and fair pricing.',
      service: 'Electrical'
    },
    {
      id: 3,
      clientName: 'Lisa Rodriguez',
      rating: 4,
      date: '2024-01-05',
      comment: 'Good work overall. Arrived on time and cleaned up after the job.',
      service: 'Carpentry'
    }
  ]);

  const serviceCategories = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
    'Landscaping', 'HVAC', 'Roofing', 'Flooring', 'Appliance Repair',
    'Home Security', 'Interior Design', 'Moving Services', 'Other'
  ];

  const skillsList = [
    'Licensed', 'Insured', 'Bonded', 'Emergency Services', '24/7 Available',
    'Free Estimates', 'Warranty Provided', 'Eco-Friendly', 'Senior Discount',
    'Military Discount'
  ];

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'profile') {
          setProfileData(prev => ({ ...prev, profileImage: e.target.result }));
        } else if (type === 'portfolio') {
          setProfileData(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { 
              id: Date.now(), 
              image: e.target.result, 
              title: '', 
              description: '' 
            }]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceToggle = (service) => {
    setProfileData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSkillToggle = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { 
        id: Date.now(), 
        name: '', 
        issuer: '', 
        year: '' 
      }]
    }));
  };

  const updateCertification = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const removePortfolioItem = (id) => {
    setProfileData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(item => item.id !== id)
    }));
  };

  const updatePortfolioItem = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateUser(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      profileImage: user?.profileImage || null,
      businessName: user?.businessName || '',
      bio: user?.bio || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      hourlyRate: user?.hourlyRate || '',
      experience: user?.experience || '',
      services: user?.services || [],
      skills: user?.skills || [],
      certifications: user?.certifications || [],
      portfolio: user?.portfolio || [],
      availability: user?.availability || {}
    });
    setIsEditing(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderProfileHeader = () => (
    <div className="bg-white rounded-xl shadow-custom p-8 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 bg-secondary-200 rounded-full overflow-hidden">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-secondary-400" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Basic Info */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.businessName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="input-field text-2xl font-bold"
                  placeholder="Business Name"
                />
              ) : (
                <h1 className="text-2xl font-bold text-secondary-900">
                  {profileData.businessName || `${user?.firstName} ${user?.lastName}`}
                </h1>
              )}
              {profileData.skills.includes('Licensed') && (
                <Shield className="h-5 w-5 text-green-600" title="Licensed" />
              )}
            </div>
            
            <div className="flex items-center text-secondary-600 space-x-4 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {isEditing ? (
                  <input
                    type="text"
                    value={`${profileData.city}, ${profileData.state}`}
                    onChange={(e) => {
                      const [city, state] = e.target.value.split(', ');
                      setProfileData(prev => ({ ...prev, city: city || '', state: state || '' }));
                    }}
                    className="input-field text-sm"
                    placeholder="City, State"
                  />
                ) : (
                  <span>{profileData.city}, {profileData.state}</span>
                )}
              </div>
              
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                <span>{stats.rating} ({stats.totalReviews} reviews)</span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    className="input-field text-sm w-20"
                    placeholder="Rate"
                  />
                ) : (
                  <span>${profileData.hourlyRate}/hr</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-secondary-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Responds in {stats.responseTime}
              </span>
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                {stats.completedJobs} jobs completed
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">About</h3>
        {isEditing ? (
          <textarea
            rows={4}
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            className="input-field resize-none w-full"
            placeholder="Tell potential clients about your experience and expertise..."
          />
        ) : (
          <p className="text-secondary-700">
            {profileData.bio || 'No bio available. Click edit to add a professional description.'}
          </p>
        )}
      </div>
    </div>
  );

  const renderTabNavigation = () => (
    <div className="border-b border-secondary-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'services', label: 'Services & Skills', icon: Briefcase },
          { id: 'portfolio', label: 'Portfolio', icon: Image },
          { id: 'availability', label: 'Availability', icon: Calendar },
          { id: 'reviews', label: 'Reviews', icon: Star }
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
            </button>
          );
        })}
      </nav>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-custom text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.rating}</div>
          <div className="text-sm text-secondary-600">Average Rating</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-custom text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.completedJobs}</div>
          <div className="text-sm text-secondary-600">Jobs Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-custom text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.totalReviews}</div>
          <div className="text-sm text-secondary-600">Total Reviews</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-custom text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.repeatClients}%</div>
          <div className="text-sm text-secondary-600">Repeat Clients</div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-secondary-500 mr-3" />
            <span className="text-secondary-700">{user?.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-secondary-500 mr-3" />
            <span className="text-secondary-700">{user?.email}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-secondary-500 mr-3 mt-1" />
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    className="input-field text-sm"
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      className="input-field text-sm"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                      className="input-field text-sm"
                      placeholder="State"
                    />
                  </div>
                  <input
                    type="text"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="input-field text-sm"
                    placeholder="ZIP Code"
                  />
                </div>
              ) : (
                <div className="text-secondary-700">
                  <div>{profileData.address}</div>
                  <div>{profileData.city}, {profileData.state} {profileData.zipCode}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-secondary-900">{review.clientName}</div>
                  <div className="text-sm text-secondary-600">{review.service} • {formatDate(review.date)}</div>
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
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      {/* Services */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Services Offered</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceCategories.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => handleServiceToggle(service)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  profileData.services.includes(service)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-300 hover:border-secondary-400'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profileData.services.length > 0 ? (
              profileData.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {service}
                </span>
              ))
            ) : (
              <p className="text-secondary-600">No services selected. Click edit to add services.</p>
            )}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Skills & Qualifications</h3>
        
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skillsList.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  profileData.skills.includes(skill)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-300 hover:border-secondary-400'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profileData.skills.length > 0 ? (
              profileData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-secondary-600">No skills selected. Click edit to add skills.</p>
            )}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Certifications</h3>
          {isEditing && (
            <button
              onClick={addCertification}
              className="btn-secondary text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Certification
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            {profileData.certifications.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-secondary-900">Certification Details</h4>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Certification name"
                    className="input-field"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Issuing organization"
                    className="input-field"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Year obtained"
                    className="input-field"
                    value={cert.year}
                    onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))}
            {profileData.certifications.length === 0 && (
              <p className="text-secondary-600">No certifications added. Click "Add Certification" to get started.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {profileData.certifications.length > 0 ? (
              profileData.certifications.map((cert) => (
                <div key={cert.id} className="flex items-center p-3 bg-secondary-50 rounded-lg">
                  <Award className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium text-secondary-900">{cert.name}</div>
                    <div className="text-sm text-secondary-600">{cert.issuer} • {cert.year}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary-600">No certifications added. Click edit to add certifications.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="bg-white rounded-lg shadow-custom p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">Portfolio</h3>
        {isEditing && (
          <label className="btn-secondary text-sm flex items-center cursor-pointer">
            <Plus className="h-4 w-4 mr-1" />
            Add Work Sample
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'portfolio')}
              className="hidden"
            />
          </label>
        )}
      </div>

      {profileData.portfolio.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.portfolio.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title || 'Portfolio item'}
                  className="w-full h-48 object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => removePortfolioItem(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Project title"
                      className="input-field text-sm"
                      value={item.title}
                      onChange={(e) => updatePortfolioItem(item.id, 'title', e.target.value)}
                    />
                    <textarea
                      rows={2}
                      placeholder="Project description"
                      className="input-field text-sm resize-none"
                      value={item.description}
                      onChange={(e) => updatePortfolioItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-1">
                      {item.title || 'Untitled Project'}
                    </h4>
                    <p className="text-sm text-secondary-600">
                      {item.description || 'No description provided'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-secondary-900 mb-2">No portfolio items yet</h4>
          <p className="text-secondary-600 mb-4">
            Showcase your best work to attract more clients
          </p>
          {isEditing && (
            <label className="btn-primary cursor-pointer">
              Add Your First Project
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'portfolio')}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );

  const renderAvailabilityTab = () => (
    <div className="bg-white rounded-lg shadow-custom p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">Weekly Availability</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(profileData.availability).map(([day, schedule]) => (
          <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-24">
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.available}
                      onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium capitalize">{day}</span>
                  </label>
                ) : (
                  <span className="text-sm font-medium capitalize">{day}</span>
                )}
              </div>
              
              {schedule.available ? (
                isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                      className="input-field text-sm py-1"
                    />
                    <span className="text-secondary-600">to</span>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                      className="input-field text-sm py-1"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-secondary-700">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                )
              ) : (
                <span className="text-sm text-secondary-500">Not available</span>
              )}
            </div>
            
            <div className={`w-3 h-3 rounded-full ${
              schedule.available ? 'bg-green-500' : 'bg-secondary-300'
            }`}></div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Availability Notes</h4>
        <p className="text-sm text-blue-800">
          Your availability helps clients know when to expect responses and schedule appointments. 
          You can always adjust your schedule or mark yourself as unavailable for specific dates.
        </p>
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Rating Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">{stats.rating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(stats.rating)}
            </div>
            <div className="text-secondary-600">Based on {stats.totalReviews} reviews</div>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = Math.floor(Math.random() * 50) + 10; // Mock data
              const percentage = (count / stats.totalReviews) * 100;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{rating} ★</span>
                  <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-secondary-600 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="bg-white rounded-lg shadow-custom p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Customer Reviews</h3>
        
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.clientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">{review.clientName}</div>
                    <div className="text-sm text-secondary-600">
                      {review.service} • {formatDate(review.date)}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-secondary-700 ml-13">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center pt-6">
          <button className="btn-secondary">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'services':
        return renderServicesTab();
      case 'portfolio':
        return renderPortfolioTab();
      case 'availability':
        return renderAvailabilityTab();
      case 'reviews':
        return renderReviewsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ContractorProfile;