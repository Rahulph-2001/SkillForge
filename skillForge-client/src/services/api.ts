import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',

    withCredentials: true,
    timeout: 30000, // 30 seconds timeout
});


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);



api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Handle Network Errors universally (API down, no internet)
        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            const { toast } = await import('react-hot-toast');
            toast.error('Network Error: Please check your internet connection.');
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const errorData = error.response?.data as { message?: string; error?: string };
        const errorMessage = typeof errorData?.error === 'string'
            ? errorData.error
            : (typeof errorData?.message === 'string' ? errorData.message : 'An unexpected error occurred');

        // Handle 403 Forbidden - User account suspended
        if (status === 403 && (errorMessage.toLowerCase().includes('suspended') || errorMessage.toLowerCase().includes('account'))) {
            const { store } = await import('../store/store');
            const { resetAuth } = await import('../store/slices/authSlice');
            store.dispatch(resetAuth());

            if (window.location.pathname !== '/login' && window.location.pathname !== '/admin/login') {
                const isAdminRoute = window.location.pathname.startsWith('/admin');
                const loginPath = isAdminRoute ? '/admin/login' : '/login';
                sessionStorage.setItem('suspensionMessage', errorMessage);
                window.location.href = loginPath;
            }
        }

        // Handle 401 Unauthorized - Invalid/expired token
        if (status === 401) {
            const requestUrl = error.config?.url || '';
            const excludedEndpoints = ['/auth/validate-status', '/auth/me', '/auth/login', '/auth/verify-otp', '/auth/google/callback'];
            const isExcluded = excludedEndpoints.some(endpoint => requestUrl.includes(endpoint));

            if (!isExcluded) {
                const { store } = await import('../store/store');
                const { resetAuth } = await import('../store/slices/authSlice');
                store.dispatch(resetAuth());

                const publicPaths = ['/', '/plans', '/login', '/admin/login'];
                const isPublicPage = publicPaths.includes(window.location.pathname);

                if (!isPublicPage && !window.location.pathname.startsWith('/auth')) {
                    const isAdminRoute = window.location.pathname.startsWith('/admin');
                    window.location.href = isAdminRoute ? '/admin/login' : '/login';
                }
            }
        }

        // Global 500 Internal Server Errors
        if (status && status >= 500) {
            const { toast } = await import('react-hot-toast');
            toast.error('Internal Server Error. Our engineers have been notified.');
        }

        return Promise.reject(error);
    }
);

export default api;

