import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // Adjust if your backend runs on a different port/path
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
