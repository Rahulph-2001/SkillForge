export const ROUTES = {
    // Public / Auth
    HOME: '/',
    LANDING: '/home',
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verify-otp',
    WELCOME: '/welcome',
    FORGOT_PASSWORD: '/forgot-password',
    VERIFY_FORGOT_PASSWORD_OTP: '/verify-forgot-password-otp',
    RESET_PASSWORD: '/reset-password',
    AUTH_GOOGLE_CALLBACK: '/auth/google/callback',

    // Static / Footer
    ABOUT: '/about',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    HOW_IT_WORKS: '/how-it-works',
    GUIDELINES: '/guidelines',
    CAREERS: '/careers',
    PRESS: '/press',
    BLOG: '/blog',
    BECOME_TEACHER: '/become-teacher',

    // User Panel
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    PROFILE_EDIT: '/profile/edit',
    EXPLORE: '/explore',
    PLANS: '/plans',
    NOTIFICATIONS: '/notifications',
    WALLET: '/wallet',
    CREDITS: '/credits',
    SESSIONS: '/sessions',
    SESSION_MANAGEMENT: '/session-management',
    MY_APPLICATIONS: '/my-applications',
    MY_PROJECTS: '/my-projects',
    MY_SKILLS: '/my-skills',
    PROVIDER_PROFILE: (id: string | number) => `/provider/${id}` as const,
    PUBLIC_PROFILE: (id: string | number) => `/profile/${id}` as const,

    // Skills & Tests
    SKILL_DETAILS: (id: string | number) => `/skills/${id}` as const,
    MCQ_TEST: (id: string | number) => `/mcq-test/${id}` as const,

    // Communities
    COMMUNITIES: '/communities',
    COMMUNITY_DETAILS: (id: string | number) => `/communities/${id}` as const,
    COMMUNITY_SETTINGS: (id: string | number) => `/communities/${id}/settings` as const,

    // Projects
    PROJECTS: '/projects',
    PROJECT_CREATE: '/projects/create',
    PROJECT_DETAILS: (id: string | number) => `/projects/${id}` as const,
    PROJECT_MANAGE: (id: string | number) => `/projects/${id}/manage` as const,
    PROJECT_APPLICATIONS: (id: string | number) => `/projects/${id}/applications` as const,

    // Video Calls
    SESSION_CALL: (id: string | number) => `/session/${id}/call` as const,
    INTERVIEW_CALL: (id: string | number) => `/session/interview/${id}/call` as const,
    PROVIDER_AVAILABILITY: '/provider/availability',

    // Admin Panel
    ADMIN: {
        LOGIN: '/admin/login',
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        SUBSCRIPTIONS: '/admin/subscriptions',
        FEATURES: '/admin/feature-management',
        SKILL_TEMPLATES: '/admin/skill-templates',
        SKILL_TEMPLATE_CREATE: '/admin/skill-templates/new',
        SKILL_TEMPLATE_EDIT: (id: string | number) => `/admin/skill-templates/${id}/edit` as const,
        SKILLS: '/admin/skills',
        WALLET: '/admin/wallet',
        COMMUNITIES: '/admin/communities',
        SESSIONS: '/admin/sessions',
        PROJECTS: '/admin/projects',
        REPORTS: '/admin/reports',
        CREDITS: '/admin/credits',
        WITHDRAWALS: '/admin/withdrawals',
        NOTIFICATIONS: '/admin/notifications',
    }
} as const;
