// Create a config file: src/config/api.js
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  ENDPOINTS: {
    AUTH: '/api/auth',
    CLIENT: '/api/client',
    CONTRACTOR: '/api/contractor',
    BOOKINGS: '/api/bookings'
  }
};

export default API_CONFIG;
