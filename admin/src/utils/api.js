/**
 * JWT Token Management
 */
const TOKEN_NAME = 'adminToken';

// Set token in cookie
export const setAdminToken = (token) => {
  if (!token) return;
  
  try {
    // For client-side
    if (typeof document !== 'undefined') {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // 7 days
      document.cookie = `${TOKEN_NAME}=${token}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`;
    }
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

// Get token from cookie
export const getAdminToken = () => {
  if (typeof document === 'undefined') return null;
  
  try {
    const name = `${TOKEN_NAME}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Clear token from cookie
export const clearAdminToken = () => {
  if (typeof document === 'undefined') return;
  
  try {
    document.cookie = `${TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Check if token is valid (not expired)
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

/**
 * Fetch wrapper with JWT token injection
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = getAdminToken();
  
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add authorization header if token exists
  if (token) {
    fetchOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, fetchOptions);

    // If 401 Unauthorized, clear token and redirect to login
    if (response.status === 401) {
      clearAdminToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin-login';
      }
      throw new Error('Token expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await parseJsonSafely(response);
      throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

/**
 * Safe JSON parsing helper
 */
export const parseJsonSafely = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * Generic API call function
 */
const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;
    
    const response = await fetchWithAuth(fullUrl, {
      method,
      ...(data && { body: JSON.stringify(data) }),
      ...config,
    });

    return await parseJsonSafely(response);
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

/**
 * API Methods
 */

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

