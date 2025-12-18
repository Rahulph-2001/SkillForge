"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_MESSAGES = exports.ERROR_MESSAGES = exports.SUCCESS_MESSAGES = void 0;
exports.SUCCESS_MESSAGES = {
    AUTH: {
        REGISTER_SUCCESS: 'Registration successful. Please check your email for verification code.',
        LOGIN_SUCCESS: 'Login successful.',
        VERIFY_OTP_SUCCESS: 'Email successfully verified. Welcome to skillswap!',
        RESEND_OTP_SUCCESS: 'A new verification code has been sent to your email.',
        LOGOUT_SUCCESS: 'Logged out successfully.',
        ADMIN_LOGIN_SUCCESS: 'Admin login successful.',
        GOOGLE_AUTH_SUCCESS: 'Google authentication successful.',
        LIST_USERS_SUCCESS: 'Users listed successfully.',
        SUSPEND_USER_SUCCESS: (name) => `User ${name} has been suspended successfully`,
        PASSWORD_RESET_SUCCESS: 'Password reset successfully. You can now login with your new password.',
    },
    GENERAL: {
        HEALTH_CHECK: 'Service is healthy.',
    },
    SKILL: {
        CREATED: 'Skill created successfully.',
        FETCHED: 'Skills retrieved successfully.',
        UPDATED: 'Skill updated successfully.',
        DELETED: 'Skill deleted successfully.',
    },
    COMMUNITY: {
        CREATED: 'Community created successfully',
        UPDATED: 'Community updated successfully',
        JOINED: 'Joined community successfully',
        LEFT: 'Left community successfully',
        MESSAGE_SENT: 'Message sent successfully',
        MESSAGE_PINNED: 'Message pinned successfully',
        MESSAGE_UNPINNED: 'Message unpinned successfully',
        MESSAGE_DELETED: 'Message deleted successfully',
    },
};
exports.ERROR_MESSAGES = {
    AUTH: {
        INVALID_EMAIL: 'Please provide a valid email address',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
        PASSWORDS_MISMATCH: 'Passwords do not match',
        EMAIL_REQUIRED: 'Email is required',
        FULL_NAME_INVALID: 'Full name must be at least 2 characters long and contain only letters and spaces',
        OTP_INVALID: 'Invalid or expired OTP',
        OTP_MAX_ATTEMPTS: 'Maximum verification attempts exceeded. Please request a new OTP.',
        USER_NOT_FOUND: 'User not found. Please sign up first.',
        EMAIL_ALREADY_VERIFIED: 'Email is already verified. Please login.',
        INVALID_CREDENTIALS: 'Invalid credentials',
        ACCOUNT_INACTIVE: 'Account is inactive or deleted',
        ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',
        ACCESS_DENIED: 'Access denied. Admin privileges required.',
        GOOGLE_PROFILE_MISSING_EMAIL: 'Google profile is missing an email address.',
        EMAIL_ALREADY_EXISTS: 'User with this email already exists',
    },
    ADMIN: {
        ACCESS_REQUIRED: 'Admin access required',
        USER_NOT_FOUND: 'User not found',
        CANNOT_SUSPEND_ADMIN: 'Cannot suspend admin users',
    },
    GENERAL: {
        VALIDATION_FAILED: 'Validation Failed',
        RESOURCE_NOT_FOUND: 'Resource not found',
        CONFLICT_EXISTS: 'Resource already exists',
        UNAUTHORIZED: 'Unauthorized',
        FORBIDDEN: 'Forbidden',
        INTERNAL_SERVER_ERROR: 'Internal server error',
        TOO_MANY_REQUESTS: 'Too many requests, try again later.',
        EMAIL_SEND_FAILED: 'Failed to send email. Please try again.',
    },
    COMMUNITY: {
        NOT_FOUND: 'Community not found',
        ALREADY_MEMBER: 'Already a member of this community',
        NOT_MEMBER: 'Not a member of this community',
        INSUFFICIENT_CREDITS: 'Insufficient credits to join community',
        ADMIN_CANNOT_LEAVE: 'Community admin cannot leave',
        ONLY_ADMIN_CAN_UPDATE: 'Only admin can update community',
        ONLY_ADMIN_CAN_PIN: 'Only admin can pin messages',
        MESSAGE_NOT_FOUND: 'Message not found',
    },
    SKILL: {
        CREATION_FAILED: 'Failed to create skill.',
        NOT_FOUND: 'Skill not found.',
        UPDATE_FAILED: 'Failed to update skill.',
        DELETE_FAILED: 'Failed to delete skill.',
        INVALID_DATA: 'Invalid skill data provided.',
        IMAGE_UPLOAD_FAILED: 'Failed to upload skill image.',
    },
};
exports.API_MESSAGES = {
    MCQ_IMPORT_START: 'MCQ import job started successfully.',
    MCQ_IMPORT_FILE_MISSING: 'No file uploaded. Please select a CSV or Excel file.',
    MCQ_IMPORT_INVALID_FILE_TYPE: 'Invalid file format. Only CSV and XLSX/XLS files are supported.',
    MCQ_IMPORT_SUCCESS: 'MCQ questions imported successfully.',
    MCQ_IMPORT_PARTIAL_SUCCESS: 'MCQ questions imported with some errors. Please check the error file.',
    VALIDATION_INVALID_FILE_CONTENT: 'The file content is invalid or missing required columns in one or more rows.',
    //
};
//# sourceMappingURL=messages.js.map