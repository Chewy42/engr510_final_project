import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Custom error class for API errors
export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  // Try both localStorage and sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(new APIError(error.message || 'Failed to setup request'));
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      
      // Try to get a user-friendly error message
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    `Server error: ${error.response.status}`;

      // Handle specific status codes
      if (error.response.status === 401) {
        // Clear token on unauthorized
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/auth/signin';
        errorMessage = 'Session expired. Please sign in again.';
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response.status === 404) {
        errorMessage = 'The requested resource was not found';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      errorMessage = 'No response received from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      errorMessage = 'Failed to make request. Please try again.';
    }

    return Promise.reject(new APIError(errorMessage));
  }
);
