/**
 * API endpoint constants
 * Centralized API endpoint definitions
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin/login',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },
  ADMIN: {
    USERS: '/admin/users',
    SUSPEND_USER: '/admin/users/suspend',
  },
} as const;

