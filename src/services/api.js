import axios from 'axios';

// Base URL for API calls. Make sure REACT_APP_API_URL is set in your environment (.env).
const API_URL = process.env.REACT_APP_API_URL_Live;

// Create a shared axios instance for the app
const api = axios.create({ baseURL: API_URL });

// Request interceptor to add Authorization header when a token exists
// - Reads token from localStorage so thunks/components don't need to attach it manually
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;