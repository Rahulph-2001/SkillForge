import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
    withCredentials: true, // Important for cookies/sessions
});

// Add a request interceptor to attach the token if needed (though cookies are often used)
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
