import axios from "axios";

//global axios instance to use when performing api calls
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // set base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;