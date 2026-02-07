export declare enum NotificationType {
    SESSION_CONFIRMED = "SESSION_CONFIRMED",
    SESSION_DECLINED = "SESSION_DECLINED",
    SESSION_CANCELLED = "SESSION_CANCELLED",
    SESSION_COMPLETED = "SESSION_COMPLETED",
    RESCHEDULE_REQUESTED = "RESCHEDULE_REQUESTED",
    RESCHEDULE_ACCEPTED = "RESCHEDULE_ACCEPTED",
    RESCHEDULE_DECLINED = "RESCHEDULE_DECLINED",
    NEW_MESSAGE = "NEW_MESSAGE",
    CREDITS_EARNED = "CREDITS_EARNED",
    CREDITS_RECEIVED = "CREDITS_RECEIVED",
    COMMUNITY_UPDATE = "COMMUNITY_UPDATE",
    BOOKING_REQUEST = "BOOKING_REQUEST",
    PROFILE_VERIFIED = "PROFILE_VERIFIED",
    PROJECT_APPLICATION_RECEIVED = "PROJECT_APPLICATION_RECEIVED",
    PROJECT_APPLICATION_ACCEPTED = "PROJECT_APPLICATION_ACCEPTED",
    PROJECT_APPLICATION_REJECTED = "PROJECT_APPLICATION_REJECTED",
    PROJECT_COMPLETION_REQUESTED = "PROJECT_COMPLETION_REQUESTED",
    PROJECT_COMPLETION_APPROVED = "PROJECT_COMPLETION_APPROVED",
    PROJECT_COMPLETION_REJECTED = "PROJECT_COMPLETION_REJECTED",
    SKILL_APPROVED = "SKILL_APPROVED",
    SKILL_REJECTED = "SKILL_REJECTED",
    SKILL_BLOCKED = "SKILL_BLOCKED",
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
    SUBSCRIPTION_RENEWED = "SUBSCRIPTION_RENEWED",
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED"
}
export interface CreateNotificationProps {
    id?: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown> | null;
    isRead?: boolean;
    readAt?: Date | null;
    createdAt?: Date;
}
export declare class Notification {
    private readonly _id;
    private readonly _userId;
    private readonly _type;
    private readonly _title;
    private readonly _message;
    private readonly _data;
    private _isRead;
    private _readAt;
    private readonly _createdAt;
    constructor(props: CreateNotificationProps);
    private validate;
    get id(): string;
    get userId(): string;
    get type(): NotificationType;
    get title(): string;
    get message(): string;
    get data(): Record<string, unknown> | null;
    get isRead(): boolean;
    get readAt(): Date | null;
    get createdAt(): Date;
    markAsRead(): void;
    toJSON(): Record<string, unknown>;
    static fromDatabaseRow(row: Record<string, unknown>): Notification;
}
//# sourceMappingURL=Notification.d.ts.map