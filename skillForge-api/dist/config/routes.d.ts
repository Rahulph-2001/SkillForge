/**
 * Centralized Route Constants
 * All API routes are defined here for consistency and easy maintenance.
 */
export declare const API_PREFIX = "/api/v1";
export declare const ROUTES: {
    readonly AUTH: "/auth";
    readonly USERS: "/users";
    readonly PROFILE: "/profile";
    readonly SKILLS: "/skills";
    readonly SKILL_TEMPLATES: "/skill-templates";
    readonly SUBSCRIPTIONS: "/subscriptions";
    readonly PAYMENTS: "/payments";
    readonly WALLET: "/wallet";
    readonly BOOKINGS: "/bookings";
    readonly SESSIONS: "/sessions";
    readonly AVAILABILITY: "/availability";
    readonly VIDEO_CALL: "/video-call";
    readonly COMMUNITIES: "/communities";
    readonly PROJECTS: "/projects";
    readonly PROJECT_APPLICATIONS: "/project-applications";
    readonly REVIEWS: "/reviews";
    readonly REPORTS: "/reports";
    readonly MCQ: "/mcq";
    readonly INTERVIEWS: "/interviews";
    readonly NOTIFICATIONS: "/notifications";
    readonly ADMIN: {
        readonly BASE: "/admin";
        readonly SKILLS: "/admin/skills";
        readonly SKILL_TEMPLATES: "/admin/skill-templates";
        readonly TEMPLATE_QUESTIONS: "/admin/skill-templates/:templateId/questions";
        readonly MCQ: "/admin/mcq";
        readonly WALLET: "/admin/wallet";
        readonly SESSIONS: "/admin/sessions";
        readonly REPORTS: "/admin/reports";
    };
    readonly HEALTH: "/health";
};
export declare const ENDPOINTS: {
    readonly AUTH: {
        readonly REGISTER: "/register";
        readonly LOGIN: "/login";
        readonly VERIFY_OTP: "/verify-otp";
        readonly RESEND_OTP: "/resend-otp";
        readonly ME: "/me";
        readonly LOGOUT: "/logout";
        readonly ADMIN_LOGIN: "/admin/login";
        readonly GOOGLE: "/google";
        readonly GOOGLE_CALLBACK: "/google/callback";
        readonly FORGOT_PASSWORD: "/forgot-password";
        readonly VERIFY_FORGOT_PASSWORD_OTP: "/verify-forgot-password-otp";
        readonly RESET_PASSWORD: "/reset-password";
        readonly VALIDATE_STATUS: "/validate-status";
    };
    readonly BOOKING: {
        readonly ROOT: "/";
        readonly MY_BOOKINGS: "/my-bookings";
        readonly UPCOMING: "/upcoming";
        readonly BY_ID: "/:id";
        readonly CANCEL: "/:id/cancel";
        readonly COMPLETE: "/:id/complete";
    };
    readonly SKILL: {
        readonly ROOT: "/";
        readonly ME: "/me";
        readonly BY_ID: "/:id";
        readonly BLOCK: "/:id/block";
    };
    readonly BROWSE_SKILLS: {
        readonly BROWSE: "/browse";
        readonly BY_ID: "/:skillId";
        readonly PROVIDER_SKILLS: "/provider/:providerId";
    };
    readonly COMMUNITY: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly JOIN: "/:id/join";
        readonly LEAVE: "/:id/leave";
        readonly MESSAGES: "/:id/messages";
        readonly MEMBERS: "/:id/members";
        readonly REMOVE_MEMBER: "/:id/members/:memberId";
        readonly PIN_MESSAGE: "/messages/:messageId/pin";
        readonly UNPIN_MESSAGE: "/messages/:messageId/unpin";
        readonly DELETE_MESSAGE: "/messages/:messageId";
        readonly REACTIONS: "/messages/:messageId/reactions";
        readonly REMOVE_REACTION: "/messages/:messageId/reactions/:emoji";
    };
    readonly PROJECT: {
        readonly ROOT: "/";
        readonly MY_PROJECTS: "/my-projects";
        readonly CONTRIBUTING: "/contributing";
        readonly BY_ID: "/:id";
        readonly COMPLETE: "/:id/complete";
        readonly REVIEW: "/:id/review";
    };
    readonly PROJECT_MESSAGE: {
        readonly BASE: "/projects/:projectId/messages";
        readonly ROOT: "/";
        readonly GET_MESSAGES: "/projects/:projectId/messages";
        readonly SEND_MESSAGE: "/projects/:projectId/messages";
    };
    readonly PROJECT_APPLICATION: {
        readonly ROOT: "/";
        readonly MY_APPLICATIONS: "/my-applications";
        readonly PROJECT_APPLICATIONS: "/project/:projectId";
        readonly BY_ID: "/:applicationId";
        readonly UPDATE_STATUS: "/:applicationId/status";
        readonly APPLY: "/projects/:projectId/apply";
        readonly GET_PROJECT_APPS: "/projects/:projectId/applications";
        readonly RECEIVED: "/received";
        readonly WITHDRAW: "/:applicationId/withdraw";
    };
    readonly WALLET: {
        readonly ROOT: "/";
        readonly TRANSACTIONS: "/transactions";
    };
    readonly VIDEO_CALL: {
        readonly ROOM: "/room";
        readonly ROOM_JOIN: "/room/join";
        readonly ROOM_LEAVE: "/room/:roomId/leave";
        readonly ROOM_BY_ID: "/room/:roomId";
        readonly ROOM_END: "/room/:roomId/end";
        readonly ROOM_FOR_BOOKING: "/room/booking/:bookingId";
        readonly BOOKING_ALIAS: "/booking/:bookingId";
        readonly SESSION: "/session/:bookingId";
        readonly SESSION_INFO: "/session/:bookingId/info";
        readonly SESSION_VALIDATE_TIME: "/session/:bookingId/validate-time";
        readonly SESSION_VALIDATE: "/session/:bookingId/validate";
        readonly INTERVIEW_SESSION: "/session/interview/:interviewId";
    };
    readonly AVAILABILITY: {
        readonly ROOT: "/";
        readonly SLOTS: "/:providerId/slots";
    };
    readonly PAYMENT: {
        readonly CREATE_INTENT: "/create-intent";
        readonly CONFIRM: "/confirm";
        readonly WEBHOOK: "/webhook";
    };
    readonly REVIEW: {
        readonly ROOT: "/";
    };
    readonly REPORT: {
        readonly ROOT: "/";
        readonly MY_REPORTS: "/my-reports";
        readonly BY_ID: "/:id";
    };
    readonly SUBSCRIPTION: {
        readonly PLANS: "/plans";
        readonly STATS: "/stats";
        readonly PLAN_BY_ID: "/plans/:id";
    };
    readonly PUBLIC_SUBSCRIPTION: {
        readonly ROOT: "/";
        readonly PLANS: "/plans";
    };
    readonly USER_SUBSCRIPTION: {
        readonly MY_SUBSCRIPTION: "/my-subscription";
        readonly SUBSCRIBE: "/subscribe";
        readonly CANCEL: "/cancel";
        readonly HISTORY: "/history";
        readonly ME: "/me";
        readonly REACTIVATE: "/reactivate";
    };
    readonly SKILL_TEMPLATE: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly TOGGLE_STATUS: "/:id/toggle-status";
    };
    readonly PUBLIC_SKILL_TEMPLATE: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly ACTIVE: "/active";
    };
    readonly SESSION_MANAGEMENT: {
        readonly PROVIDER: "/provider";
        readonly ACCEPT: "/:bookingId/accept";
        readonly DECLINE: "/:bookingId/decline";
        readonly CANCEL: "/:bookingId/cancel";
        readonly RESCHEDULE: "/reschedule/:bookingId";
        readonly RESCHEDULE_ACCEPT: "/reschedule/:bookingId/accept";
        readonly RESCHEDULE_DECLINE: "/:bookingId/reschedule/decline";
    };
    readonly TEMPLATE_QUESTION: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly QUESTION_BY_ID: "/:questionId";
        readonly BULK_DELETE: "/bulk";
    };
    readonly MCQ_TEST: {
        readonly AVAILABLE: "/available";
        readonly START: "/start";
        readonly SUBMIT: "/submit";
        readonly HISTORY: "/history";
        readonly RESULT: "/result/:attemptId";
        readonly START_BY_SKILL: "/start/:skillId";
    };
    readonly MCQ_IMPORT: {
        readonly IMPORT: "/import";
        readonly TEMPLATE: "/import/template";
        readonly START_IMPORT: "/:templateId/import";
        readonly STATUS: "/:templateId/status";
        readonly DOWNLOAD_ERRORS: "/errors/:jobId/download";
    };
    readonly INTERVIEW: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly MY_INTERVIEWS: "/my-interviews";
        readonly REQUEST: "/request";
        readonly RESPOND: "/:id/respond";
        readonly START: "/:id/start";
        readonly SUBMIT_FEEDBACK: "/:id/feedback";
        readonly SCHEDULE: "/schedule";
        readonly BY_APPLICATION: "/application/:applicationId";
    };
    readonly USER_PROFILE: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly ME: "/me";
        readonly AVATAR: "/avatar";
        readonly PUBLIC: "/public/:userId";
        readonly STATS: "/stats/:userId";
        readonly PROVIDER_PROFILE: "/:userId/profile";
        readonly PROVIDER_REVIEWS: "/:userId/reviews";
    };
    readonly FEATURE: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
    };
    readonly ADMIN: {
        readonly USERS: "/users";
        readonly USERS_SUSPEND: "/users/suspend";
        readonly USERS_UNSUSPEND: "/users/unsuspend";
        readonly COMMUNITIES: "/communities";
        readonly COMMUNITY_BY_ID: "/communities/:id";
        readonly COMMUNITY_BLOCK: "/communities/:id/block";
        readonly COMMUNITY_UNBLOCK: "/communities/:id/unblock";
        readonly SUBSCRIPTIONS: "/subscriptions";
        readonly FEATURES: "/features";
        readonly PROJECTS: "/projects";
        readonly PROJECTS_STATS: "/projects/stats";
        readonly PROJECT_BY_ID: "/projects/:projectId";
        readonly PROJECT_SUSPEND: "/projects/:projectId/suspend";
        readonly PAYMENT_REQUESTS_PENDING: "/payment-requests/pending";
        readonly PAYMENT_REQUEST_PROCESS: "/payment-requests/:id/process";
    };
    readonly ADMIN_SKILL: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly TOGGLE_BLOCK: "/:id/toggle-block";
        readonly PENDING: "/pending";
        readonly APPROVE: "/:skillId/approve";
        readonly REJECT: "/:skillId/reject";
        readonly BLOCK: "/:skillId/block";
        readonly UNBLOCK: "/:skillId/unblock";
    };
    readonly ADMIN_WALLET: {
        readonly TRANSACTIONS: "/transactions";
        readonly CREDITS: "/credits";
        readonly STATS: "/stats";
    };
    readonly ADMIN_SESSION: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly COMPLETE: "/:id/complete";
        readonly CANCEL: "/:id/cancel";
        readonly STATS: "/stats";
    };
    readonly ADMIN_REPORT: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly RESOLVE: "/:id/resolve";
        readonly STATS: "/stats";
        readonly RESOLUTION: "/:reportId/resolution";
    };
    readonly NOTIFICATION: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
        readonly UNREAD_COUNT: "/unread-count";
        readonly MARK_READ: "/:id/read";
        readonly MARK_ALL_READ: "/read-all";
    };
    readonly COMMON: {
        readonly ROOT: "/";
        readonly BY_ID: "/:id";
    };
};
//# sourceMappingURL=routes.d.ts.map