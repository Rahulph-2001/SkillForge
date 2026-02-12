// App Attributes and Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful. Please check your email for verification code.',
    LOGIN_SUCCESS: 'Login successful.',
    VERIFY_OTP_SUCCESS: 'Email successfully verified. Welcome to skillswap!',
    RESEND_OTP_SUCCESS: 'A new verification code has been sent to your email.',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    ADMIN_LOGIN_SUCCESS: 'Admin login successful.',
    GOOGLE_AUTH_SUCCESS: 'Google authentication successful.',
    LIST_USERS_SUCCESS: 'Users listed successfully.',
    SUSPEND_USER_SUCCESS: (name: string) => `User ${name} has been suspended successfully`,
    PASSWORD_RESET_SUCCESS: 'Password reset successfully. You can now login with your new password.',
    DASHBOARD_STATS_FETCHED: 'Dashboard statistics retrieved successfully',
  },
  ADMIN: {
    DASHBOARD_STATS_FETCHED: 'Dashboard statistics retrieved successfully',
  },
  GENERAL: {
    HEALTH_CHECK: 'Service is healthy.',
  },
  PAYMENT: {
    INTENT_CREATED: 'Payment intent created successfully',
    CONFIRMED: 'Payment confirmed successfully',
    REFUNDED: 'Payment refunded successfully',
  },
  VIDEO_CALL: {
    ROOM_CREATED: 'Video call room created successfully',
    JOINED: 'Joined video call successfully',
    LEFT: 'Left video call successfully',
    ENDED: 'Video call ended successfully',
  },
  PROJECT_APPLICATION: {
    SUBMITTED: 'Application submitted successfully',
    FETCHED: 'Applications retrieved successfully',
    UPDATED: 'Application status updated successfully',
    WITHDRAWN: 'Application withdrawn successfully',
  },

  USER: {
    PROFILE_FETCHED: 'Profile retrieved successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    REVIEWS_FETCHED: 'Reviews retrieved successfully',
  },

  SKILL: {
    CREATED: 'Skill created successfully.',
    FETCHED: 'Skills retrieved successfully.',
    UPDATED: 'Skill updated successfully.',
    DELETED: 'Skill deleted successfully.',
    DETAILS_FETCHED: 'Skill details retrieved successfully',
    APPROVED: 'Skill approved successfully',
    REJECTED: 'Skill rejected successfully',
    BLOCKED: 'Skill blocked successfully',
    UNBLOCKED: 'Skill unblocked successfully',
    PENDING_FETCHED: (count: number) => `Found ${count} skills pending approval`,
    ALL_FETCHED: (count: number) => `Found ${count} skills`,
  },

  BOOKING: {
    CREATED: 'Booking created successfully',
    ACCEPTED: 'Booking accepted successfully',
    DECLINED: 'Booking declined successfully',
    CANCELLED: 'Booking cancelled successfully',
    RESCHEDULE_REQUESTED: 'Reschedule request submitted successfully. Waiting for approval.',
    RESCHEDULE_ACCEPTED: 'Reschedule request accepted successfully',
    RESCHEDULE_DECLINED: 'Reschedule request declined',
    SESSIONS_FETCHED: 'Sessions retrieved successfully',
  },

  MCQ: {
    TEST_FETCHED: 'Test retrieved successfully',
    TEST_SUBMITTED_PASS: 'Congratulations! You passed the test!',
    TEST_SUBMITTED_FAIL: 'Test completed',
    HISTORY_FETCHED: 'Test history retrieved successfully',
  },

  SUBSCRIPTION: {
    PLANS_FETCHED: 'Subscription plans retrieved successfully',
    STATS_FETCHED: 'Subscription statistics retrieved successfully',
    PLAN_CREATED: 'Subscription plan created successfully',
    PLAN_UPDATED: 'Subscription plan updated successfully',
    PLAN_DELETED: 'Subscription plan deleted successfully',
    SUBSCRIPTION_FETCHED: 'Subscription retrieved successfully',
    SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
  },

  FEATURE: {
    CREATED: 'Feature created successfully',
    UPDATED: 'Feature updated successfully',
    DELETED: 'Feature deleted successfully',
    FETCHED: 'Features retrieved successfully',
    FEATURE_FETCHED: 'Feature retrieved successfully',
  },

  TEMPLATE: {
    QUESTION_CREATED: 'Question created successfully',
    QUESTIONS_FETCHED: 'Questions retrieved successfully',
    QUESTION_UPDATED: 'Question updated successfully',
    QUESTION_DELETED: 'Question deleted successfully',
    SKILL_CREATED: 'Skill template created successfully',
    SKILL_FETCHED: 'Skill templates retrieved successfully',
    SKILL_UPDATED: 'Skill template updated successfully',
    SKILL_DELETED: 'Skill template deleted successfully',
    SKILL_STATUS_TOGGLED: 'Skill template status toggled successfully',
    ACTIVE_FETCHED: 'Active skill templates retrieved successfully',
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
    FETCHED: 'Communities retrieved successfully',
    DETAILS_FETCHED: 'Community details retrieved successfully',
    MESSAGES_FETCHED: 'Messages retrieved successfully',
    MEMBER_REMOVED: 'Member removed successfully',
    MEMBERS_FETCHED: 'Members retrieved successfully',
    REACTION_ADDED: 'Reaction added successfully',
    REACTION_REMOVED: 'Reaction removed successfully',
  },

  WALLET: {
    STATS_FETCHED: 'Wallet statistics retrieved successfully',
    TRANSACTIONS_FETCHED: 'Wallet transactions retrieved successfully',
    WALLET_CREDITED: 'Admin wallet credited successfully',
  },

  SESSION: {
    TIME_VALIDATED: 'Session time validated successfully',
  },

  REVIEW: {
    CREATED: 'Review submitted successfully',
  },

  PROJECT: {
    CREATED: 'Project created successfully',
    FETCHED: 'Projects fetched successfully',
    DETAILS_FETCHED: 'Project details fetched successfully',
    UPDATED: 'Project updated successfully',
    DELETED: 'Project deleted successfully',
    MY_PROJECTS_FETCHED: 'My projects fetched successfully',
    CONTRIBUTING_FETCHED: 'Contributing projects fetched successfully',
    COMPLETION_REQUESTED: 'Project completion requested successfully',
    COMPLETION_REVIEWED: 'Project review submitted successfully',
  },

  INTERVIEW: {
    SCHEDULED: 'Interview scheduled successfully',
    FETCHED: 'Interviews retrieved successfully',
    CANCELLED: 'Interview cancelled successfully',
  },

  NOTIFICATION: {
    FETCHED: 'Notifications retrieved successfully',
    COUNT_FETCHED: 'Unread count retrieved successfully',
    MARKED_READ: 'Notification marked as read',
    ALL_MARKED_READ: 'All notifications marked as read',
    DELETED: 'Notification deleted successfully',
  },

  CREDITS: {
    PACKAGE_CREATED: 'Credit package created successfully',
    PACKAGES_FETCHED: 'Credit packages retrieved successfully',
    PACKAGE_UPDATED: 'Credit package updated successfully',
    PACKAGE_DELETED: 'Credit package deleted successfully',
  },
} as const;

export const ERROR_MESSAGES = {
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
  NOTIFICATION: {
    NOT_FOUND: 'Notification not found',
    UNAUTHORIZED: 'You are not authorized to access this notification',
    CREATION_FAILED: 'Failed to create notification',
  },

  SESSION: {
    NOT_STARTED_YET: 'Session has not started yet. Please wait until the scheduled time.',
    SESSION_EXPIRED: 'This session has already ended.',
    NOT_CONFIRMED: 'Session must be confirmed before joining.',
    JOIN_WINDOW_NOT_OPEN: 'You can only join the session within 15 minutes before the start time.',
    SESSION_TIME_VALIDATION_FAILED: 'Failed to validate session time.',
  },
  PAYMENT: {
    INTENT_CREATION_FAILED: 'Failed to create payment intent',
    CONFIRMATION_FAILED: 'Payment confirmation failed',
    REFUND_FAILED: 'Payment refund failed',
    NOT_FOUND: 'Payment not found',
    INVALID_AMOUNT: 'Invalid payment amount',
  },
  PROJECT_APPLICATION: {
    NOT_FOUND: 'Application not found',
    ALREADY_APPLIED: 'You have already applied to this project',
    CANNOT_APPLY_OWN: 'Cannot apply to your own project',
    PROJECT_NOT_OPEN: 'Project is not accepting applications',
    UNAUTHORIZED: 'You are not authorized to perform this action',
  },
  PROJECT: {
    NOT_FOUND: 'Project not found',
    CREATION_FAILED: 'Failed to create project',
    UPDATE_FAILED: 'Failed to update project',
  },

  USER: {
    NOT_FOUND: 'User not found',
    PROFILE_FETCH_FAILED: 'Failed to fetch profile',
    REVIEWS_FETCH_FAILED: 'Failed to fetch reviews',
  },

  BOOKING: {
    ACCEPT_FAILED: 'Failed to accept booking',
    DECLINE_FAILED: 'Failed to decline booking',
    CANCEL_FAILED: 'Failed to cancel booking',
    RESCHEDULE_FAILED: 'Failed to request reschedule',
    RESCHEDULE_ACCEPT_FAILED: 'Failed to accept reschedule',
    RESCHEDULE_DECLINE_FAILED: 'Failed to decline reschedule',
    SESSIONS_FETCH_FAILED: 'Failed to retrieve sessions',
    REQUIRED_FIELDS: 'New date, time, and reason are required',
    REASON_REQUIRED: 'Reason is required to decline a reschedule request',
  },

  MCQ: {
    TEMPLATE_NOT_FOUND: 'Skill template not found',
    TEMPLATE_INACTIVE: 'This skill template is not currently available',
    INVALID_LEVEL: 'Invalid level for this skill template',
    NO_QUESTIONS: 'No questions available for this test',
    INVALID_REQUEST: 'Invalid request data',
    TEST_FETCH_FAILED: 'Failed to retrieve test',
    TEST_SUBMIT_FAILED: 'Failed to submit test',
    HISTORY_FETCH_FAILED: 'Failed to retrieve test history',
  },

  SKILL: {
    CREATION_FAILED: 'Failed to create skill.',
    NOT_FOUND: 'Skill not found.',
    UPDATE_FAILED: 'Failed to update skill.',
    DELETE_FAILED: 'Failed to delete skill.',
    INVALID_DATA: 'Invalid skill data provided.',
    IMAGE_UPLOAD_FAILED: 'Failed to upload skill image.',
    REJECTION_REASON_REQUIRED: 'Rejection reason is required',
    BLOCK_REASON_REQUIRED: 'Block reason is required',
  },

  FEATURE: {
    NOT_FOUND: 'Feature not found',
    ALREADY_EXISTS: 'Feature with this name already exists for this plan',
    IN_USE: 'Feature is in use by subscription plans and cannot be deleted',
    INVALID_TYPE: 'Invalid feature type',
    LIMIT_REQUIRED: 'Limit value is required for numeric limit features',
  },

  REVIEW: {
    CREATED: 'Review submitted successfully',
    NOT_FOUND: 'Review not found',
    ALREADY_EXISTS: 'Review already exists for this session',
    CREATION_FAILED: 'Failed to submit review',
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
  WALLET: {
    STATS_FETCH_FAILED: 'Failed to fetch wallet statistics',
    TRANSACTIONS_FETCH_FAILED: 'Failed to fetch wallet transactions',
    ADMIN_NOT_FOUND: 'No admin user found in the system',
    CREDIT_FAILED: 'Failed to credit admin wallet',
  },

  VALIDATION: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
  },
  CREDITS: {
    PACKAGE_NOT_FOUND: 'Credit package not found',
  },
} as const;

export const API_MESSAGES = {
  MCQ_IMPORT_START: 'MCQ import job started successfully.',
  MCQ_IMPORT_FILE_MISSING: 'No file uploaded. Please select a CSV or Excel file.',
  MCQ_IMPORT_INVALID_FILE_TYPE: 'Invalid file format. Only CSV and XLSX/XLS files are supported.',
  MCQ_IMPORT_SUCCESS: 'MCQ questions imported successfully.',
  MCQ_IMPORT_PARTIAL_SUCCESS: 'MCQ questions imported with some errors. Please check the error file.',
  VALIDATION_INVALID_FILE_CONTENT: 'The file content is invalid or missing required columns in one or more rows.',
  //
}