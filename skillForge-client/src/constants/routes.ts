
export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  VERIFY_OTP: '/verify-otp',
  WELCOME: '/welcome',
  GOOGLE_CALLBACK: '/auth/google/callback',
  
  // User routes
  USER_HOME: '/home',
  EXPLORE: '/explore',
  MY_SKILLS: '/my-skills',
  DASHBOARD: '/dashboard',
  
  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

