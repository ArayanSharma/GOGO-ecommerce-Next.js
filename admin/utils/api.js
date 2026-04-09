import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), clear token and redirect to login
    if (error.response?.status === 401) {
      Cookies.remove('adminToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

// Generic API call function
export const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error.response?.data || { error: true, message: error.message };
  }
};

// GET request
export const adminGetData = (endpoint, config = {}) => {
  return apiCall('GET', endpoint, null, config);
};

// POST request
export const adminPostData = (endpoint, data, config = {}) => {
  return apiCall('POST', endpoint, data, config);
};

// PUT request
export const adminPutData = (endpoint, data, config = {}) => {
  return apiCall('PUT', endpoint, data, config);
};

// DELETE request
export const adminDeleteData = (endpoint, config = {}) => {
  return apiCall('DELETE', endpoint, null, config);
};

// Token functions
export const setAdminToken = (token) => {
  if (token) {
    Cookies.set('adminToken', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
};

export const getAdminToken = () => {
  return Cookies.get('adminToken');
};

export const clearAdminToken = () => {
  Cookies.remove('adminToken');
};

// Verify token validity
export const isTokenValid = () => {
  const token = getAdminToken();
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch (error) {
    return false;
  }
};
