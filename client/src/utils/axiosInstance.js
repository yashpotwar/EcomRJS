import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.29.71:5000/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // for admin
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;