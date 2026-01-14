import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


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
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        // Handle 403 Forbidden - User account suspended
        if (error.response?.status === 403) {
            const errorData = error.response?.data as any;
            
            // Get error message string safely (handle both string and object formats)
            const errorMessage = typeof errorData?.error === 'string' 
                ? errorData.error 
                : (typeof errorData?.message === 'string' ? errorData.message : '');
            
            // Check if this is a suspension error
            if (errorMessage.toLowerCase().includes('suspended') || 
                errorMessage.toLowerCase().includes('account')) {
                
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
                        errorMessage || 'Your account has been suspended. Please contact support.');
                    
                    window.location.href = loginPath;
                }
            }
        }
        
        // Handle 401 Unauthorized - Invalid/expired token
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            
            // Don't auto-logout for these endpoints (they're expected to return 401)
            const excludedEndpoints = [
                '/auth/validate-status',
                '/auth/me',
                '/auth/login',
                '/auth/verify-otp',
                '/auth/google/callback'
            ];
            
            const isExcluded = excludedEndpoints.some(endpoint => requestUrl.includes(endpoint));
            
            if (!isExcluded) {
                // Lazy import to avoid circular dependency
                const { store } = await import('../store/store');
                const { resetAuth } = await import('../store/slices/authSlice');
                
                // Clear user data from Redux store
                store.dispatch(resetAuth());
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/login' && 
                    window.location.pathname !== '/admin/login' &&
                    !window.location.pathname.startsWith('/auth')) {
                    
                    const isAdminRoute = window.location.pathname.startsWith('/admin');
                    const loginPath = isAdminRoute ? '/admin/login' : '/login';
                    window.location.href = loginPath;
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;

