/**
 * Centralized Route Constants
 * All API routes are defined here for consistency and easy maintenance.
 */

// API Version Prefix
export const API_PREFIX = '/api/v1';

// Base Route Paths (used in server.ts for mounting routers)
export const ROUTES = {
    // Auth & User Management
    AUTH: '/auth',
    USERS: '/users',
    PROFILE: '/profile',

    // Skills & Templates
    SKILLS: '/skills',
    SKILL_TEMPLATES: '/skill-templates',

    // Subscriptions & Payments
    SUBSCRIPTIONS: '/subscriptions',
    PAYMENTS: '/payments',
    WALLET: '/wallet',

    // Sessions & Bookings
    BOOKINGS: '/bookings',
    SESSIONS: '/sessions',
    AVAILABILITY: '/availability',
    VIDEO_CALL: '/video-call',

    // Community & Projects
    COMMUNITIES: '/communities',
    PROJECTS: '/projects',
    PROJECT_APPLICATIONS: '/project-applications',

    // Reviews & Reports
    REVIEWS: '/reviews',
    REPORTS: '/reports',

    // MCQ & Interviews
    MCQ: '/mcq',
    INTERVIEWS: '/interviews',

    NOTIFICATIONS: '/notifications',

    // Admin Routes
    ADMIN: {
        BASE: '/admin',
        SKILLS: '/admin/skills',
        SKILL_TEMPLATES: '/admin/skill-templates',
        TEMPLATE_QUESTIONS: '/admin/skill-templates/:templateId/questions',
        MCQ: '/admin/mcq',
        WALLET: '/admin/wallet',
        SESSIONS: '/admin/sessions',
        REPORTS: '/admin/reports',
    },

    // Health Check
    HEALTH: '/health',
} as const;

// Endpoint Paths (used within individual route files)
export const ENDPOINTS = {
    AUTH: {
        REGISTER: '/register',
        LOGIN: '/login',
        VERIFY_OTP: '/verify-otp',
        RESEND_OTP: '/resend-otp',
        ME: '/me',
        LOGOUT: '/logout',
        ADMIN_LOGIN: '/admin/login',
        GOOGLE: '/google',
        GOOGLE_CALLBACK: '/google/callback',
        FORGOT_PASSWORD: '/forgot-password',
        VERIFY_FORGOT_PASSWORD_OTP: '/verify-forgot-password-otp',
        RESET_PASSWORD: '/reset-password',
        VALIDATE_STATUS: '/validate-status',
    },

    BOOKING: {
        ROOT: '/',
        MY_BOOKINGS: '/my-bookings',
        UPCOMING: '/upcoming',
        BY_ID: '/:id',
        CANCEL: '/:id/cancel',
        COMPLETE: '/:id/complete',
    },

    SKILL: {
        ROOT: '/',
        ME: '/me',
        BY_ID: '/:id',
        BLOCK: '/:id/block',
    },

    BROWSE_SKILLS: {
        BROWSE: '/browse',
        BY_ID: '/:skillId',
        PROVIDER_SKILLS: '/provider/:providerId',
    },

    COMMUNITY: {
        ROOT: '/',
        BY_ID: '/:id',
        JOIN: '/:id/join',
        LEAVE: '/:id/leave',
        MESSAGES: '/:id/messages',
        MEMBERS: '/:id/members',
        REMOVE_MEMBER: '/:id/members/:memberId',
        PIN_MESSAGE: '/messages/:messageId/pin',
        UNPIN_MESSAGE: '/messages/:messageId/unpin',
        DELETE_MESSAGE: '/messages/:messageId',
        REACTIONS: '/messages/:messageId/reactions',
        REMOVE_REACTION: '/messages/:messageId/reactions/:emoji',
    },

    PROJECT: {
        ROOT: '/',
        MY_PROJECTS: '/my-projects',
        CONTRIBUTING: '/contributing',
        BY_ID: '/:id',
        COMPLETE: '/:id/complete',
        REVIEW: '/:id/review',
    },

    PROJECT_MESSAGE: {
        BASE: '/projects/:projectId/messages',
        ROOT: '/',
        GET_MESSAGES: '/projects/:projectId/messages',
        SEND_MESSAGE: '/projects/:projectId/messages',
    },

    PROJECT_APPLICATION: {
        ROOT: '/',
        MY_APPLICATIONS: '/my-applications',
        PROJECT_APPLICATIONS: '/project/:projectId',
        BY_ID: '/:applicationId',
        UPDATE_STATUS: '/:applicationId/status',
        APPLY: '/projects/:projectId/apply',
        GET_PROJECT_APPS: '/projects/:projectId/applications',
        RECEIVED: '/received',
        WITHDRAW: '/:applicationId/withdraw',
    },

    WALLET: {
        ROOT: '/',
        TRANSACTIONS: '/transactions',
    },

    VIDEO_CALL: {
        ROOM: '/room',
        ROOM_JOIN: '/room/join',
        ROOM_LEAVE: '/room/:roomId/leave',
        ROOM_BY_ID: '/room/:roomId',
        ROOM_END: '/room/:roomId/end',
        ROOM_FOR_BOOKING: '/room/booking/:bookingId',
        BOOKING_ALIAS: '/booking/:bookingId',
        SESSION: '/session/:bookingId',
        SESSION_INFO: '/session/:bookingId/info',
        SESSION_VALIDATE_TIME: '/session/:bookingId/validate-time',
        SESSION_VALIDATE: '/session/:bookingId/validate',
        INTERVIEW_SESSION: '/session/interview/:interviewId',
    },

    AVAILABILITY: {
        ROOT: '/',
        SLOTS: '/:providerId/slots',
    },

    PAYMENT: {
        CREATE_INTENT: '/create-intent',
        CONFIRM: '/confirm',
        WEBHOOK: '/webhook',
    },

    REVIEW: {
        ROOT: '/',
    },

    REPORT: {
        ROOT: '/',
        MY_REPORTS: '/my-reports',
        BY_ID: '/:id',
    },

    SUBSCRIPTION: {
        PLANS: '/plans',
        STATS: '/stats',
        PLAN_BY_ID: '/plans/:id',
    },

    PUBLIC_SUBSCRIPTION: {
        ROOT: '/',
        PLANS: '/plans',
    },

    USER_SUBSCRIPTION: {
        MY_SUBSCRIPTION: '/my-subscription',
        SUBSCRIBE: '/subscribe',
        CANCEL: '/cancel',
        HISTORY: '/history',
        ME: '/me',
        REACTIVATE: '/reactivate',
    },

    SKILL_TEMPLATE: {
        ROOT: '/',
        BY_ID: '/:id',
        TOGGLE_STATUS: '/:id/toggle-status',
    },

    PUBLIC_SKILL_TEMPLATE: {
        ROOT: '/',
        BY_ID: '/:id',
        ACTIVE: '/active',
    },

    SESSION_MANAGEMENT: {
        PROVIDER: '/provider',
        ACCEPT: '/:bookingId/accept',
        DECLINE: '/:bookingId/decline',
        CANCEL: '/:bookingId/cancel',
        RESCHEDULE: '/reschedule/:bookingId',
        RESCHEDULE_ACCEPT: '/reschedule/:bookingId/accept',
        RESCHEDULE_DECLINE: '/:bookingId/reschedule/decline',
    },

    TEMPLATE_QUESTION: {
        ROOT: '/',
        BY_ID: '/:id',
        QUESTION_BY_ID: '/:questionId',
        BULK_DELETE: '/bulk',
    },

    MCQ_TEST: {
        AVAILABLE: '/available',
        START: '/start',
        SUBMIT: '/submit',
        HISTORY: '/history',
        RESULT: '/result/:attemptId',
        START_BY_SKILL: '/start/:skillId',
    },

    MCQ_IMPORT: {
        IMPORT: '/import',
        TEMPLATE: '/import/template',
        START_IMPORT: '/:templateId/import',
        STATUS: '/:templateId/status',
        DOWNLOAD_ERRORS: '/errors/:jobId/download',
    },

    INTERVIEW: {
        ROOT: '/',
        BY_ID: '/:id',
        MY_INTERVIEWS: '/my-interviews',
        REQUEST: '/request',
        RESPOND: '/:id/respond',
        START: '/:id/start',
        SUBMIT_FEEDBACK: '/:id/feedback',
        SCHEDULE: '/schedule',
        BY_APPLICATION: '/application/:applicationId',
    },

    USER_PROFILE: {
        ROOT: '/',
        BY_ID: '/:id',
        ME: '/me',
        AVATAR: '/avatar',
        PUBLIC: '/public/:userId',
        STATS: '/stats/:userId',
        PROVIDER_PROFILE: '/:userId/profile',
        PROVIDER_REVIEWS: '/:userId/reviews',
    },

    FEATURE: {
        ROOT: '/',
        BY_ID: '/:id',
    },

    ADMIN: {
        USERS: '/users',
        USERS_SUSPEND: '/users/suspend',
        USERS_UNSUSPEND: '/users/unsuspend',
        COMMUNITIES: '/communities',
        COMMUNITY_BY_ID: '/communities/:id',
        COMMUNITY_BLOCK: '/communities/:id/block',
        COMMUNITY_UNBLOCK: '/communities/:id/unblock',
        SUBSCRIPTIONS: '/subscriptions',
        FEATURES: '/features',
        PROJECTS: '/projects',
        PROJECTS_STATS: '/projects/stats',
        PROJECT_BY_ID: '/projects/:projectId',
        PROJECT_SUSPEND: '/projects/:projectId/suspend',
        PAYMENT_REQUESTS_PENDING: '/payment-requests/pending',
        PAYMENT_REQUEST_PROCESS: '/payment-requests/:id/process',
    },

    ADMIN_SKILL: {
        ROOT: '/',
        BY_ID: '/:id',
        TOGGLE_BLOCK: '/:id/toggle-block',
        PENDING: '/pending',
        APPROVE: '/:skillId/approve',
        REJECT: '/:skillId/reject',
        BLOCK: '/:skillId/block',
        UNBLOCK: '/:skillId/unblock',
    },

    ADMIN_WALLET: {
        TRANSACTIONS: '/transactions',
        CREDITS: '/credits',
        STATS: '/stats',
    },

    ADMIN_SESSION: {
        ROOT: '/',
        BY_ID: '/:id',
        COMPLETE: '/:id/complete',
        CANCEL: '/:id/cancel',
        STATS: '/stats',
    },

    ADMIN_REPORT: {
        ROOT: '/',
        BY_ID: '/:id',
        RESOLVE: '/:id/resolve',
        STATS: '/stats',
        RESOLUTION: '/:reportId/resolution',
    },

    NOTIFICATION: {
        ROOT: '/',
        BY_ID: '/:id',
        UNREAD_COUNT: '/unread-count',
        MARK_READ: '/:id/read',
        MARK_ALL_READ: '/read-all',
    },

    // Common patterns
    COMMON: {
        ROOT: '/',
        BY_ID: '/:id',
    },
} as const;
