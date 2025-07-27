class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    this.timeout = 10000; // 10 seconds timeout
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Create request headers
  createHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle different error types
      if (response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to perform this action.');
      } else if (response.status === 404) {
        throw new Error('Resource not found.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.createHeaders(options.headers),
      timeout: this.timeout,
      ...options,
    };

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection and server status.');
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // File upload request
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data to form
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/api/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Client-specific API methods
export const clientApi = {
  // Get dashboard stats
  getStats: () => apiService.get('/api/client/stats'),
  
  // Get bookings with optional filters
  getBookings: (params = {}) => apiService.get('/api/client/bookings', params),
  
  // Get saved contractors
  getSavedContractors: () => apiService.get('/api/client/saved-contractors'),
  
  // Save a contractor
  saveContractor: (contractorId) => apiService.post('/api/client/saved-contractors', { contractorId }),
  
  // Remove saved contractor
  removeSavedContractor: (contractorId) => apiService.delete(`/api/client/saved-contractors/${contractorId}`),
  
  // Get recommendations
  getRecommendations: () => apiService.get('/api/client/recommendations'),
  
  // Get profile
  getProfile: () => apiService.get('/api/client/profile'),
  
  // Update profile
  updateProfile: (profileData) => apiService.put('/api/client/profile', profileData),
  
  // Get recent activity
  getRecentActivity: (params = {}) => apiService.get('/api/client/recent-activity', params),
};

// Auth API methods
export const authApi = {
  login: (credentials) => apiService.post('/api/auth/login', credentials),
  register: (userData) => apiService.post('/api/auth/register', userData),
  getMe: () => apiService.get('/api/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
};

// Booking API methods
export const bookingApi = {
  create: (bookingData) => apiService.post('/api/bookings', bookingData),
  getById: (bookingId) => apiService.get(`/api/bookings/${bookingId}`),
  update: (bookingId, updates) => apiService.put(`/api/bookings/${bookingId}`, updates),
  cancel: (bookingId) => apiService.delete(`/api/bookings/${bookingId}`),
};

export default apiService;