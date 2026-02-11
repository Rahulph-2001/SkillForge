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
    readonly PAYMENT: {
        readonly INTENT_CREATED: "Payment intent created successfully";
        readonly CONFIRMED: "Payment confirmed successfully";
        readonly REFUNDED: "Payment refunded successfully";
    };
    readonly VIDEO_CALL: {
        readonly ROOM_CREATED: "Video call room created successfully";
        readonly JOINED: "Joined video call successfully";
        readonly LEFT: "Left video call successfully";
        readonly ENDED: "Video call ended successfully";
    };
    readonly PROJECT_APPLICATION: {
        readonly SUBMITTED: "Application submitted successfully";
        readonly FETCHED: "Applications retrieved successfully";
        readonly UPDATED: "Application status updated successfully";
        readonly WITHDRAWN: "Application withdrawn successfully";
    };
    readonly USER: {
        readonly PROFILE_FETCHED: "Profile retrieved successfully";
        readonly PROFILE_UPDATED: "Profile updated successfully";
        readonly REVIEWS_FETCHED: "Reviews retrieved successfully";
    };
    readonly SKILL: {
        readonly CREATED: "Skill created successfully.";
        readonly FETCHED: "Skills retrieved successfully.";
        readonly UPDATED: "Skill updated successfully.";
        readonly DELETED: "Skill deleted successfully.";
        readonly DETAILS_FETCHED: "Skill details retrieved successfully";
        readonly APPROVED: "Skill approved successfully";
        readonly REJECTED: "Skill rejected successfully";
        readonly BLOCKED: "Skill blocked successfully";
        readonly UNBLOCKED: "Skill unblocked successfully";
        readonly PENDING_FETCHED: (count: number) => string;
        readonly ALL_FETCHED: (count: number) => string;
    };
    readonly BOOKING: {
        readonly CREATED: "Booking created successfully";
        readonly ACCEPTED: "Booking accepted successfully";
        readonly DECLINED: "Booking declined successfully";
        readonly CANCELLED: "Booking cancelled successfully";
        readonly RESCHEDULE_REQUESTED: "Reschedule request submitted successfully. Waiting for approval.";
        readonly RESCHEDULE_ACCEPTED: "Reschedule request accepted successfully";
        readonly RESCHEDULE_DECLINED: "Reschedule request declined";
        readonly SESSIONS_FETCHED: "Sessions retrieved successfully";
    };
    readonly MCQ: {
        readonly TEST_FETCHED: "Test retrieved successfully";
        readonly TEST_SUBMITTED_PASS: "Congratulations! You passed the test!";
        readonly TEST_SUBMITTED_FAIL: "Test completed";
        readonly HISTORY_FETCHED: "Test history retrieved successfully";
    };
    readonly SUBSCRIPTION: {
        readonly PLANS_FETCHED: "Subscription plans retrieved successfully";
        readonly STATS_FETCHED: "Subscription statistics retrieved successfully";
        readonly PLAN_CREATED: "Subscription plan created successfully";
        readonly PLAN_UPDATED: "Subscription plan updated successfully";
        readonly PLAN_DELETED: "Subscription plan deleted successfully";
        readonly SUBSCRIPTION_FETCHED: "Subscription retrieved successfully";
        readonly SUBSCRIPTION_CANCELLED: "Subscription cancelled successfully";
    };
    readonly FEATURE: {
        readonly CREATED: "Feature created successfully";
        readonly UPDATED: "Feature updated successfully";
        readonly DELETED: "Feature deleted successfully";
        readonly FETCHED: "Features retrieved successfully";
        readonly FEATURE_FETCHED: "Feature retrieved successfully";
    };
    readonly TEMPLATE: {
        readonly QUESTION_CREATED: "Question created successfully";
        readonly QUESTIONS_FETCHED: "Questions retrieved successfully";
        readonly QUESTION_UPDATED: "Question updated successfully";
        readonly QUESTION_DELETED: "Question deleted successfully";
        readonly SKILL_CREATED: "Skill template created successfully";
        readonly SKILL_FETCHED: "Skill templates retrieved successfully";
        readonly SKILL_UPDATED: "Skill template updated successfully";
        readonly SKILL_DELETED: "Skill template deleted successfully";
        readonly SKILL_STATUS_TOGGLED: "Skill template status toggled successfully";
        readonly ACTIVE_FETCHED: "Active skill templates retrieved successfully";
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
        readonly FETCHED: "Communities retrieved successfully";
        readonly DETAILS_FETCHED: "Community details retrieved successfully";
        readonly MESSAGES_FETCHED: "Messages retrieved successfully";
        readonly MEMBER_REMOVED: "Member removed successfully";
        readonly MEMBERS_FETCHED: "Members retrieved successfully";
        readonly REACTION_ADDED: "Reaction added successfully";
        readonly REACTION_REMOVED: "Reaction removed successfully";
    };
    readonly WALLET: {
        readonly STATS_FETCHED: "Wallet statistics retrieved successfully";
        readonly TRANSACTIONS_FETCHED: "Wallet transactions retrieved successfully";
        readonly WALLET_CREDITED: "Admin wallet credited successfully";
    };
    readonly SESSION: {
        readonly TIME_VALIDATED: "Session time validated successfully";
    };
    readonly REVIEW: {
        readonly CREATED: "Review submitted successfully";
    };
    readonly PROJECT: {
        readonly CREATED: "Project created successfully";
        readonly FETCHED: "Projects fetched successfully";
        readonly DETAILS_FETCHED: "Project details fetched successfully";
        readonly UPDATED: "Project updated successfully";
        readonly DELETED: "Project deleted successfully";
        readonly MY_PROJECTS_FETCHED: "My projects fetched successfully";
        readonly CONTRIBUTING_FETCHED: "Contributing projects fetched successfully";
        readonly COMPLETION_REQUESTED: "Project completion requested successfully";
        readonly COMPLETION_REVIEWED: "Project review submitted successfully";
    };
    readonly INTERVIEW: {
        readonly SCHEDULED: "Interview scheduled successfully";
        readonly FETCHED: "Interviews retrieved successfully";
        readonly CANCELLED: "Interview cancelled successfully";
    };
    readonly NOTIFICATION: {
        readonly FETCHED: "Notifications retrieved successfully";
        readonly COUNT_FETCHED: "Unread count retrieved successfully";
        readonly MARKED_READ: "Notification marked as read";
        readonly ALL_MARKED_READ: "All notifications marked as read";
        readonly DELETED: "Notification deleted successfully";
    };
    readonly CREDITS: {
        readonly PACKAGE_CREATED: "Credit package created successfully";
        readonly PACKAGES_FETCHED: "Credit packages retrieved successfully";
        readonly PACKAGE_UPDATED: "Credit package updated successfully";
        readonly PACKAGE_DELETED: "Credit package deleted successfully";
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
    readonly NOTIFICATION: {
        readonly NOT_FOUND: "Notification not found";
        readonly UNAUTHORIZED: "You are not authorized to access this notification";
        readonly CREATION_FAILED: "Failed to create notification";
    };
    readonly SESSION: {
        readonly NOT_STARTED_YET: "Session has not started yet. Please wait until the scheduled time.";
        readonly SESSION_EXPIRED: "This session has already ended.";
        readonly NOT_CONFIRMED: "Session must be confirmed before joining.";
        readonly JOIN_WINDOW_NOT_OPEN: "You can only join the session within 15 minutes before the start time.";
        readonly SESSION_TIME_VALIDATION_FAILED: "Failed to validate session time.";
    };
    readonly PAYMENT: {
        readonly INTENT_CREATION_FAILED: "Failed to create payment intent";
        readonly CONFIRMATION_FAILED: "Payment confirmation failed";
        readonly REFUND_FAILED: "Payment refund failed";
        readonly NOT_FOUND: "Payment not found";
        readonly INVALID_AMOUNT: "Invalid payment amount";
    };
    readonly PROJECT_APPLICATION: {
        readonly NOT_FOUND: "Application not found";
        readonly ALREADY_APPLIED: "You have already applied to this project";
        readonly CANNOT_APPLY_OWN: "Cannot apply to your own project";
        readonly PROJECT_NOT_OPEN: "Project is not accepting applications";
        readonly UNAUTHORIZED: "You are not authorized to perform this action";
    };
    readonly PROJECT: {
        readonly NOT_FOUND: "Project not found";
        readonly CREATION_FAILED: "Failed to create project";
        readonly UPDATE_FAILED: "Failed to update project";
    };
    readonly USER: {
        readonly NOT_FOUND: "User not found";
        readonly PROFILE_FETCH_FAILED: "Failed to fetch profile";
        readonly REVIEWS_FETCH_FAILED: "Failed to fetch reviews";
    };
    readonly BOOKING: {
        readonly ACCEPT_FAILED: "Failed to accept booking";
        readonly DECLINE_FAILED: "Failed to decline booking";
        readonly CANCEL_FAILED: "Failed to cancel booking";
        readonly RESCHEDULE_FAILED: "Failed to request reschedule";
        readonly RESCHEDULE_ACCEPT_FAILED: "Failed to accept reschedule";
        readonly RESCHEDULE_DECLINE_FAILED: "Failed to decline reschedule";
        readonly SESSIONS_FETCH_FAILED: "Failed to retrieve sessions";
        readonly REQUIRED_FIELDS: "New date, time, and reason are required";
        readonly REASON_REQUIRED: "Reason is required to decline a reschedule request";
    };
    readonly MCQ: {
        readonly TEMPLATE_NOT_FOUND: "Skill template not found";
        readonly TEMPLATE_INACTIVE: "This skill template is not currently available";
        readonly INVALID_LEVEL: "Invalid level for this skill template";
        readonly NO_QUESTIONS: "No questions available for this test";
        readonly INVALID_REQUEST: "Invalid request data";
        readonly TEST_FETCH_FAILED: "Failed to retrieve test";
        readonly TEST_SUBMIT_FAILED: "Failed to submit test";
        readonly HISTORY_FETCH_FAILED: "Failed to retrieve test history";
    };
    readonly SKILL: {
        readonly CREATION_FAILED: "Failed to create skill.";
        readonly NOT_FOUND: "Skill not found.";
        readonly UPDATE_FAILED: "Failed to update skill.";
        readonly DELETE_FAILED: "Failed to delete skill.";
        readonly INVALID_DATA: "Invalid skill data provided.";
        readonly IMAGE_UPLOAD_FAILED: "Failed to upload skill image.";
        readonly REJECTION_REASON_REQUIRED: "Rejection reason is required";
        readonly BLOCK_REASON_REQUIRED: "Block reason is required";
    };
    readonly FEATURE: {
        readonly NOT_FOUND: "Feature not found";
        readonly ALREADY_EXISTS: "Feature with this name already exists for this plan";
        readonly IN_USE: "Feature is in use by subscription plans and cannot be deleted";
        readonly INVALID_TYPE: "Invalid feature type";
        readonly LIMIT_REQUIRED: "Limit value is required for numeric limit features";
    };
    readonly REVIEW: {
        readonly CREATED: "Review submitted successfully";
        readonly NOT_FOUND: "Review not found";
        readonly ALREADY_EXISTS: "Review already exists for this session";
        readonly CREATION_FAILED: "Failed to submit review";
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
    readonly WALLET: {
        readonly STATS_FETCH_FAILED: "Failed to fetch wallet statistics";
        readonly TRANSACTIONS_FETCH_FAILED: "Failed to fetch wallet transactions";
        readonly ADMIN_NOT_FOUND: "No admin user found in the system";
        readonly CREDIT_FAILED: "Failed to credit admin wallet";
    };
    readonly VALIDATION: {
        readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    };
    readonly CREDITS: {
        readonly PACKAGE_NOT_FOUND: "Credit package not found";
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