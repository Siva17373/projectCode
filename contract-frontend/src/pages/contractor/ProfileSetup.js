import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Camera, Upload, X, Plus, MapPin, DollarSign, Clock, Star, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileSetup = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Common profile data
  const [profileData, setProfileData] = useState({
    profileImage: null,
    bio: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // Contractor specific
    businessName: '',
    businessType: 'individual',
    experience: '',
    services: [],
    hourlyRate: '',
    availability: {
      monday: { available: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
      thursday: { available: false, startTime: '09:00', endTime: '17:00' },
      friday: { available: false, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '09:00', endTime: '17:00' },
      sunday: { available: false, startTime: '09:00', endTime: '17:00' }
    },
    skills: [],
    certifications: [],
    portfolio: [],
    // Client specific
    preferences: {
      communicationMethod: 'both',
      budgetRange: '',
      serviceTypes: []
    }
  });

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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
            portfolio: [...prev.portfolio, { id: Date.now(), image: e.target.result, title: '', description: '' }]
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

  const addCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', year: '' }]
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

// Replace the existing handleSubmit function in your ProfileSetup.js with this:

const handleSubmit = async () => {
  setLoading(true);
  try {
    // Here you would typically send the data to your API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    updateUser({ profileCompleted: true, ...profileData });
    toast.success('Profile setup completed successfully!');
    
    // Role-based redirect after profile completion
    const userRole = user?.role;
    
    if (userRole === 'contractor') {
      navigate('/contractor-dashboard', { replace: true });
    } else if (userRole === 'client') {
      navigate('/client-dashboard', { replace: true });
    } else {
      // Fallback
      navigate('/dashboard', { replace: true });
    }
    
  } catch (error) {
    toast.error('Failed to save profile. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const renderStepIndicator = () => {
    const totalSteps = user?.role === 'contractor' ? 4 : 2;
    
    return (
      <div className="flex items-center justify-center mb-8">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index + 1 <= currentStep
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-200 text-secondary-600'
            }`}>
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                index + 1 < currentStep ? 'bg-primary-600' : 'bg-secondary-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Basic Information</h2>
        <p className="text-secondary-600">Let's start with your basic profile information</p>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 bg-secondary-200 rounded-full flex items-center justify-center overflow-hidden">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="h-12 w-12 text-secondary-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
            <Camera className="h-5 w-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'profile')}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {user?.role === 'contractor' ? 'Professional Bio' : 'About You'}
        </label>
        <textarea
          rows={4}
          className="input-field resize-none"
          placeholder={user?.role === 'contractor' 
            ? "Tell potential clients about your experience and expertise..."
            : "Tell contractors a bit about yourself..."
          }
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Street Address
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter your address"
            value={profileData.address}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            City
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="City"
            value={profileData.city}
            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            State
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="State"
            value={profileData.state}
            onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="ZIP Code"
            value={profileData.zipCode}
            onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderContractorBusinessInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Business Information</h2>
        <p className="text-secondary-600">Tell us about your business</p>
      </div>

      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Business Name
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Your business name or 'Individual' for personal services"
          value={profileData.businessName}
          onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
        />
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Business Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-secondary-50">
            <input
              type="radio"
              name="businessType"
              value="individual"
              checked={profileData.businessType === 'individual'}
              onChange={(e) => setProfileData(prev => ({ ...prev, businessType: e.target.value }))}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Individual</div>
              <div className="text-sm text-secondary-600">Solo contractor</div>
            </div>
          </label>
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-secondary-50">
            <input
              type="radio"
              name="businessType"
              value="company"
              checked={profileData.businessType === 'company'}
              onChange={(e) => setProfileData(prev => ({ ...prev, businessType: e.target.value }))}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Company</div>
              <div className="text-sm text-secondary-600">Business entity</div>
            </div>
          </label>
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Years of Experience
        </label>
        <select
          className="input-field"
          value={profileData.experience}
          onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
        >
          <option value="">Select experience level</option>
          <option value="0-1">Less than 1 year</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      {/* Hourly Rate */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Hourly Rate (USD)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="number"
            className="input-field pl-10"
            placeholder="50"
            value={profileData.hourlyRate}
            onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
          />
        </div>
        <p className="text-sm text-secondary-600 mt-1">You can always adjust this later</p>
      </div>
    </div>
  );

  const renderServicesAndSkills = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Services & Skills</h2>
        <p className="text-secondary-600">What services do you offer?</p>
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Select Your Services
        </label>
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
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Additional Skills & Qualifications
        </label>
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
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-secondary-700">
            Certifications (Optional)
          </label>
          <button
            type="button"
            onClick={addCertification}
            className="btn-secondary text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Certification
          </button>
        </div>
        
        <div className="space-y-3">
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
        </div>
      </div>
    </div>
  );

  const renderAvailabilityAndPortfolio = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Availability & Portfolio</h2>
        <p className="text-secondary-600">Set your schedule and showcase your work</p>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Weekly Availability
        </label>
        <div className="space-y-3">
          {Object.entries(profileData.availability).map(([day, schedule]) => (
            <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-20">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={schedule.available}
                    onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium capitalize">{day}</span>
                </label>
              </div>
              {schedule.available && (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-secondary-700">
            Portfolio (Optional)
          </label>
          <label className="btn-secondary text-sm flex items-center cursor-pointer">
            <Upload className="h-4 w-4 mr-1" />
            Add Work Sample
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'portfolio')}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.portfolio.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt="Portfolio item"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removePortfolioItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3 space-y-2">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClientPreferences = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Your Preferences</h2>
        <p className="text-secondary-600">Help us find the right contractors for you</p>
      </div>

      {/* Communication Preference */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Preferred Communication Method
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'chat', label: 'In-app Chat', desc: 'Message through the app' },
            { value: 'phone', label: 'Phone Calls', desc: 'Direct phone contact' },
            { value: 'both', label: 'Both', desc: 'Any method works' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-secondary-50">
              <input
                type="radio"
                name="communicationMethod"
                value={option.value}
                checked={profileData.preferences.communicationMethod === option.value}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, communicationMethod: e.target.value }
                }))}
                className="mr-3"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-secondary-600">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Typical Budget Range per Project
        </label>
        <select
          className="input-field"
          value={profileData.preferences.budgetRange}
          onChange={(e) => setProfileData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, budgetRange: e.target.value }
          }))}
        >
          <option value="">Select budget range</option>
          <option value="0-100">$0 - $100</option>
          <option value="100-500">$100 - $500</option>
          <option value="500-1000">$500 - $1,000</option>
          <option value="1000-5000">$1,000 - $5,000</option>
          <option value="5000+">$5,000+</option>
        </select>
      </div>

      {/* Service Types of Interest */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Services You're Interested In
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceCategories.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => {
                const currentServices = profileData.preferences.serviceTypes;
                const newServices = currentServices.includes(service)
                  ? currentServices.filter(s => s !== service)
                  : [...currentServices, service];
                setProfileData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, serviceTypes: newServices }
                }));
              }}
              className={`p-3 text-left border rounded-lg transition-colors ${
                profileData.preferences.serviceTypes.includes(service)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-300 hover:border-secondary-400'
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const getTotalSteps = () => user?.role === 'contractor' ? 4 : 2;

  const renderCurrentStep = () => {
    if (user?.role === 'contractor') {
      switch (currentStep) {
        case 1: return renderBasicInfo();
        case 2: return renderContractorBusinessInfo();
        case 3: return renderServicesAndSkills();
        case 4: return renderAvailabilityAndPortfolio();
        default: return renderBasicInfo();
      }
    } else {
      switch (currentStep) {
        case 1: return renderBasicInfo();
        case 2: return renderClientPreferences();
        default: return renderBasicInfo();
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-secondary-600">
            {user?.role === 'contractor' 
              ? 'Set up your professional profile to start receiving job requests'
              : 'Complete your profile to find and hire the best contractors'
            }
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-xl shadow-custom p-8">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < getTotalSteps() ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-primary"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;