import axios from 'axios';

const API_BASE_URL =  'http://localhost:5001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response interceptor error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // You could dispatch a logout action here if you have access to your auth context
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => {
    console.log('🔐 Login API called with:', { email: data.email }); // Don't log password
    console.log('🌐 Making request to:', `${API_BASE_URL}/api/auth/login`);
    return apiClient.post('/api/auth/login', data);
  },
  
  register: (data) => {
    console.log('📝 Register API called with:', { 
      email: data.email, 
      role: data.role, 
      name: data.name 
    }); // Don't log password
    console.log('🌐 Making request to:', `${API_BASE_URL}/api/auth/register`);
    return apiClient.post('/api/auth/register', data);
  },
  
  verifyToken: () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Verify token API called with token:', token ? 'present' : 'missing');
    console.log('🌐 Making request to:', `${API_BASE_URL}/api/auth/me`);
    
    if (!token) {
      return Promise.reject(new Error('No token found'));
    }
    
    return apiClient.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  // Additional utility methods
  refreshToken: () => {
    const token = localStorage.getItem('token');
    return apiClient.post('/api/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  updateProfile: (data) => {
    const token = localStorage.getItem('token');
    return apiClient.put('/api/auth/profile', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  changePassword: (data) => {
    const token = localStorage.getItem('token');
    return apiClient.put('/api/auth/change-password', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  
  forgotPassword: (email) => {
    return apiClient.post('/api/auth/forgot-password', { email });
  },
  
  resetPassword: (data) => {
    return apiClient.post('/api/auth/reset-password', data);
  }
};

// Export the axios instance for other API calls
export default apiClient;