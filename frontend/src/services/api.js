import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running on standard Vite port with proxy or served in production, use relative /api
  return "/api";
};

const API = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests and attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("buildnotes_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, remove from storage
      const token = localStorage.getItem("buildnotes_token");
      if (token && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("buildnotes_token");
        localStorage.removeItem("buildnotes_user");
        // Dispatch custom event to notify auth context
        window.dispatchEvent(new Event("auth:logout"));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
