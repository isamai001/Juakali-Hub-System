/**
 * ============================================================
 * API Configuration
 * ============================================================
 * Centralized API endpoint configuration for frontend.
 */

// API Base URL - Change this based on your environment
const API_BASE_URL = "http://localhost:3000/api/v1";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Helper function to clear auth
const clearAuth = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Helper function to get user info
const getUser = () => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

// Helper function to set user info
const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Common fetch wrapper with auth header
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
};
