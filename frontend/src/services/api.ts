import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Ensure token is valid and not a string "undefined" or "null"
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Clean up bad localStorage state
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Check if we have a 401 and not already logging out
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Use location assign to force a clean reset to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.assign('/login');
        // Return a silent promise so components don't pop up toasts while redirecting
        return new Promise(() => {}); 
      }
    }
    
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
