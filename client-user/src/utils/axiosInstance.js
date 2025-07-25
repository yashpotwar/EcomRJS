// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.29.71:5000/api',  // your base API
});

// Automatically attach token to every request
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // or localStorage if admin
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;