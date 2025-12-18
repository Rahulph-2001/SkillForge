export declare const SUCCESS_MESSAGES: {
    readonly AUTH: {
        readonly REGISTER_SUCCESS: "Registration successful. Please check your email for verification code.";
        readonly LOGIN_SUCCESS: "Login successful.";
        readonly VERIFY_OTP_SUCCESS: "Email successfully verified. Welcome to skillswap!";
        readonly RESEND_OTP_SUCCESS: "A new verification code has been sent to your email.";
        readonly LOGOUT_SUCCESS: "Logged out successfully.";
        readonly ADMIN_LOGIN_SUCCESS: "Admin login successful.";
        readonly GOOGLE_AUTH_SUCCESS: "Google authentication successful.";
        readonly LIST_USERS_SUCCESS: "Users listed successfully.";
        readonly SUSPEND_USER_SUCCESS: (name: string) => string;
        readonly PASSWORD_RESET_SUCCESS: "Password reset successfully. You can now login with your new password.";
    };
    readonly GENERAL: {
        readonly HEALTH_CHECK: "Service is healthy.";
    };
    readonly SKILL: {
        readonly CREATED: "Skill created successfully.";
        readonly FETCHED: "Skills retrieved successfully.";
        readonly UPDATED: "Skill updated successfully.";
        readonly DELETED: "Skill deleted successfully.";
    };
    readonly COMMUNITY: {
        readonly CREATED: "Community created successfully";
        readonly UPDATED: "Community updated successfully";
        readonly JOINED: "Joined community successfully";
        readonly LEFT: "Left community successfully";
        readonly MESSAGE_SENT: "Message sent successfully";
        readonly MESSAGE_PINNED: "Message pinned successfully";
        readonly MESSAGE_UNPINNED: "Message unpinned successfully";
        readonly MESSAGE_DELETED: "Message deleted successfully";
    };
};
export declare const ERROR_MESSAGES: {
    readonly AUTH: {
        readonly INVALID_EMAIL: "Please provide a valid email address";
        readonly PASSWORD_REQUIRED: "Password is required";
        readonly PASSWORD_MIN_LENGTH: "Password must be at least 8 characters";
        readonly PASSWORDS_MISMATCH: "Passwords do not match";
        readonly EMAIL_REQUIRED: "Email is required";
        readonly FULL_NAME_INVALID: "Full name must be at least 2 characters long and contain only letters and spaces";
        readonly OTP_INVALID: "Invalid or expired OTP";
        readonly OTP_MAX_ATTEMPTS: "Maximum verification attempts exceeded. Please request a new OTP.";
        readonly USER_NOT_FOUND: "User not found. Please sign up first.";
        readonly EMAIL_ALREADY_VERIFIED: "Email is already verified. Please login.";
        readonly INVALID_CREDENTIALS: "Invalid credentials";
        readonly ACCOUNT_INACTIVE: "Account is inactive or deleted";
        readonly ACCOUNT_SUSPENDED: "Your account has been suspended. Please contact support.";
        readonly ACCESS_DENIED: "Access denied. Admin privileges required.";
        readonly GOOGLE_PROFILE_MISSING_EMAIL: "Google profile is missing an email address.";
        readonly EMAIL_ALREADY_EXISTS: "User with this email already exists";
    };
    readonly ADMIN: {
        readonly ACCESS_REQUIRED: "Admin access required";
        readonly USER_NOT_FOUND: "User not found";
        readonly CANNOT_SUSPEND_ADMIN: "Cannot suspend admin users";
    };
    readonly GENERAL: {
        readonly VALIDATION_FAILED: "Validation Failed";
        readonly RESOURCE_NOT_FOUND: "Resource not found";
        readonly CONFLICT_EXISTS: "Resource already exists";
        readonly UNAUTHORIZED: "Unauthorized";
        readonly FORBIDDEN: "Forbidden";
        readonly INTERNAL_SERVER_ERROR: "Internal server error";
        readonly TOO_MANY_REQUESTS: "Too many requests, try again later.";
        readonly EMAIL_SEND_FAILED: "Failed to send email. Please try again.";
    };
    readonly COMMUNITY: {
        readonly NOT_FOUND: "Community not found";
        readonly ALREADY_MEMBER: "Already a member of this community";
        readonly NOT_MEMBER: "Not a member of this community";
        readonly INSUFFICIENT_CREDITS: "Insufficient credits to join community";
        readonly ADMIN_CANNOT_LEAVE: "Community admin cannot leave";
        readonly ONLY_ADMIN_CAN_UPDATE: "Only admin can update community";
        readonly ONLY_ADMIN_CAN_PIN: "Only admin can pin messages";
        readonly MESSAGE_NOT_FOUND: "Message not found";
    };
    readonly SKILL: {
        readonly CREATION_FAILED: "Failed to create skill.";
        readonly NOT_FOUND: "Skill not found.";
        readonly UPDATE_FAILED: "Failed to update skill.";
        readonly DELETE_FAILED: "Failed to delete skill.";
        readonly INVALID_DATA: "Invalid skill data provided.";
        readonly IMAGE_UPLOAD_FAILED: "Failed to upload skill image.";
    };
};
export declare const API_MESSAGES: {
    MCQ_IMPORT_START: string;
    MCQ_IMPORT_FILE_MISSING: string;
    MCQ_IMPORT_INVALID_FILE_TYPE: string;
    MCQ_IMPORT_SUCCESS: string;
    MCQ_IMPORT_PARTIAL_SUCCESS: string;
    VALIDATION_INVALID_FILE_CONTENT: string;
};
//# sourceMappingURL=messages.d.ts.map