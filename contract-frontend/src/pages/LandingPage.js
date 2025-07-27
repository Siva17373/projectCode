import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Shield, Clock, Phone, Mail, MapPin, Zap, Award, TrendingUp, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Verified Professionals",
      description: "All contractors are background-checked and verified for your peace of mind",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Rated & Reviewed",
      description: "Real reviews from real customers help you make informed decisions",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Instant Booking",
      description: "Book services instantly and get responses within hours",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: "Quality Guarantee",
      description: "Our quality assurance team ensures exceptional service delivery",
      color: "from-green-500 to-green-600"
    }
  ];

  const services = [
    { name: "Plumbing", icon: "🔧", jobs: "1.2K+" },
    { name: "Electrical", icon: "⚡", jobs: "980+" },
    { name: "Carpentry", icon: "🪚", jobs: "850+" },
    { name: "Painting", icon: "🎨", jobs: "750+" },
    { name: "Cleaning", icon: "🧽", jobs: "2.1K+" },
    { name: "Landscaping", icon: "🌿", jobs: "640+" },
    { name: "HVAC", icon: "❄️", jobs: "420+" },
    { name: "Roofing", icon: "🏠", jobs: "380+" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      rating: 5,
      text: "ConTract transformed my home renovation experience. The plumber I found was professional, punctual, and incredibly skilled!",
      avatar: "SJ",
      location: "Austin, TX"
    },
    {
      name: "Mike Chen",
      role: "Contractor",
      rating: 5,
      text: "As a contractor, ConTract has been a game-changer for my business. The quality of leads increased my revenue by 40%.",
      avatar: "MC",
      location: "San Francisco, CA"
    },
    {
      name: "Lisa Rodriguez",
      role: "Property Manager",
      rating: 5,
      text: "Managing 15 properties became so much easier with ConTract. I can quickly find reliable contractors for any issue.",
      avatar: "LR",
      location: "Miami, FL"
    }
  ];

  const stats = [
    { number: "25K+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
    { number: "12K+", label: "Verified Contractors", icon: <Shield className="h-5 w-5" /> },
    { number: "150K+", label: "Jobs Completed", icon: <CheckCircle className="h-5 w-5" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Star className="h-5 w-5" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                <TrendingUp className="h-4 w-4 mr-2" />
                #1 Contractor Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Find Perfect
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Contractors
                </span>
                <span className="block text-4xl lg:text-5xl text-white/90">in Minutes</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                Connect with verified professionals for all your home improvement needs. 
                Quality work, competitive prices, and guaranteed satisfaction.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/register" 
                  state={{ userType: 'client' }}
                  className="group bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Find Contractors
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/register" 
                  state={{ userType: 'contractor' }}
                  className="group border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center hover:border-white/50"
                >
                  Join as Contractor
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-center mb-2 text-yellow-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  {/* Mock Search Bar */}
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">🔍</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-2 bg-gray-100 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Contractor Cards */}
                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${features[i-1]?.color || 'from-blue-500 to-blue-600'} animate-pulse`}></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Why Choose ConTract
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built for Modern
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Home Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reimagined how homeowners connect with skilled professionals, 
              making it faster, safer, and more reliable than ever before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-700 font-medium mb-4">
              <Star className="h-4 w-4 mr-2" />
              Popular Services
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Every Service You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From quick fixes to major renovations, find the perfect contractor for any job
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer transform hover:-translate-y-1">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">{service.jobs} completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-green-700 font-medium mb-4">
              <Users className="h-4 w-4 mr-2" />
              Customer Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community has to say about their ConTract experience
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg font-bold text-2xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                </div>
                
                <blockquote className="text-2xl lg:text-3xl font-medium text-center mb-8 leading-relaxed max-w-4xl mx-auto">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current mx-1" />
                    ))}
                  </div>
                  <div className="font-bold text-xl">{testimonials[currentTestimonial].name}</div>
                  <div className="text-blue-200">{testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}</div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers and contractors building the future of home services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/register" 
              state={{ userType: 'client' }}
              className="group bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 py-5 rounded-xl transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Users className="mr-3 h-5 w-5" />
              I Need Services
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              to="/register" 
              state={{ userType: 'contractor' }}
              className="group border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold px-10 py-5 rounded-xl transition-all duration-300 inline-flex items-center justify-center hover:border-white/50"
            >
              <Shield className="mr-3 h-5 w-5" />
              I Provide Services
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ConTract
              </h3>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Revolutionizing the way homeowners connect with trusted professionals. 
                Building relationships, delivering quality, one project at a time.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">For Clients</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link to="/search" className="hover:text-blue-400 transition-colors duration-200">Find Contractors</Link></li>
                <li><Link to="/register" className="hover:text-blue-400 transition-colors duration-200">Sign Up</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors duration-200">How It Works</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors duration-200">Safety</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">For Contractors</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link to="/register" state={{ userType: 'contractor' }} className="hover:text-blue-400 transition-colors duration-200">Join ConTract</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors duration-200">Resources</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors duration-200">Success Stories</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors duration-200">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ConTract. All rights reserved. Built with ❤️ for better connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;