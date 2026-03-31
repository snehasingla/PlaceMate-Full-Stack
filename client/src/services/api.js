// src/services/api.js
// Central Axios instance — all API calls go through this
// The proxy in vite.config.js forwards /api → http://localhost:5000/api

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // IMPORTANT: required to send/receive httpOnly cookies
});

// Response interceptor — handles expired token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We let React Router and AuthContext handle 401 redirects to avoid infinite reload loops
    return Promise.reject(error);
  }
);

export default api;
