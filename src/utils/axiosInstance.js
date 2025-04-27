// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
});

// Intercept every request and attach the token under x-auth-token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;   // ← your backend looks here
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
