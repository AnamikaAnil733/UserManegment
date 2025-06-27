import axios from 'axios';
import {store} from "../store/store.js";
import { loginSucess, logout } from '../auth/authslice';

const instance = axios.create({
  baseURL: 'http://localhost:7000/api',
  withCredentials: true, // allows sending the refresh token cookie
});

// Request interceptor: attach token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 403 and refresh access token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          'http://localhost:7000/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        store.dispatch(loginSucess({ token: newAccessToken }));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        localStorage.removeItem('token');
        window.location.href = '/login'; // optional redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
