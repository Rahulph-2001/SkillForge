import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * API Client Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout
});


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Cookies are automatically sent with withCredentials: true
        // Access token is in HTTP-only cookie, so we don't need to add it manually
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);


/**
 * Response Interceptor
 * Handles token refresh and error responses
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        // Just reject the error - let Redux handle the logic
        // Avoid hard redirects that interfere with PersistGate and React Router
        return Promise.reject(error);
    }
);

export default api;

