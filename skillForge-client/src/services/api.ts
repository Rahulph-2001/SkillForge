import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


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



api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        // Handle 403 Forbidden - User account suspended
        if (error.response?.status === 403) {
            const errorData = error.response?.data as any;
            
            // Check if this is a suspension error
            if (errorData?.error?.toLowerCase().includes('suspended') || 
                errorData?.error?.toLowerCase().includes('account')) {
                
                // Lazy import to avoid circular dependency
                const { store } = await import('../store/store');
                const { resetAuth } = await import('../store/slices/authSlice');
                
                // Clear user data from Redux store
                store.dispatch(resetAuth());
                
                // Redirect to login page with suspension message
                if (window.location.pathname !== '/login' && 
                    window.location.pathname !== '/admin/login') {
                    
                    const isAdminRoute = window.location.pathname.startsWith('/admin');
                    const loginPath = isAdminRoute ? '/admin/login' : '/login';
                    
                    // Store suspension message in sessionStorage for display on login page
                    sessionStorage.setItem('suspensionMessage', 
                        errorData?.error || 'Your account has been suspended. Please contact support.');
                    
                    window.location.href = loginPath;
                }
            }
        }
        
        // Handle 401 Unauthorized - Invalid/expired token
        if (error.response?.status === 401) {
            // Lazy import to avoid circular dependency
            const { store } = await import('../store/store');
            const { resetAuth } = await import('../store/slices/authSlice');
            
            // Clear user data from Redux store
            store.dispatch(resetAuth());
        }
        
        return Promise.reject(error);
    }
);

export default api;

