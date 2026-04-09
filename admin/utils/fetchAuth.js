import { getAdminToken, clearAdminToken } from './api';

/**
 * Enhanced fetch wrapper that automatically adds JWT token to all requests
 * and handles token expiration
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

    // Handle other error responses
    if (!response.ok) {
      const errorData = await parseJsonSafely(response);
      throw new Error(
        errorData?.message || `HTTP Error: ${response.status}`
      );
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
 * Common fetch patterns for dashboard API calls
 */

// GET request with auth
export const getWithAuth = (url, options = {}) => {
  return fetchWithAuth(url, {
    method: 'GET',
    ...options,
  });
};

// POST request with auth
export const postWithAuth = (url, data, options = {}) => {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

// PUT request with auth
export const putWithAuth = (url, data, options = {}) => {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

// DELETE request with auth
export const deleteWithAuth = (url, options = {}) => {
  return fetchWithAuth(url, {
    method: 'DELETE',
    ...options,
  });
};
