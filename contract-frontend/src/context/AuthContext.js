import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/authAPI';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// ✅ Updated to use React state instead of localStorage for initial state
const initialState = {
  user: null,
  token: null, // We'll get this from localStorage in useEffect
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'LOGIN_SUCCESS':
      // Store token in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGOUT':
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'AUTH_ERROR':
      // Remove token from localStorage on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (token) {
          console.log('🔍 Token found, verifying...'); // Debug log
          const response = await authAPI.verifyToken();
          console.log('✅ Token verified, user:', response.data); // Debug log
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { 
              user: response.data.user || response.data, // Handle both response formats
              token 
            }
          });
        } else {
          console.log('❌ No token found'); // Debug log
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('❌ Token verification failed:', error); // Debug log
        dispatch({ type: 'AUTH_ERROR', payload: error.message });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🔐 Attempting login for:', email); // Debug log
      
      const response = await authAPI.login({ email, password });
      console.log('✅ Login API response:', response.data); // Debug log
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error); // Debug log
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('📝 Attempting registration for:', userData.email); // Debug log
      
      const response = await authAPI.register(userData);
      console.log('✅ Registration API response:', response.data); // Debug log
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error); // Debug log
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user'); // Debug log
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;