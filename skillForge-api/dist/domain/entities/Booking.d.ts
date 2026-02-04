export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    REJECTED = "rejected",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESCHEDULE_REQUESTED = "reschedule_requested",
    IN_SESSION = "in_session"
}
export declare enum SessionType {
    VIRTUAL = "Virtual",
    IN_PERSON = "In-Person",
    BOTH = "Both"
}
export interface RescheduleInfo {
    newDate: string;
    newTime: string;
    reason: string;
    requestedBy: 'learner' | 'provider';
    requestedAt: Date;
    newStartAt?: Date;
    newEndAt?: Date;
}
export interface BookingProps {
    id?: string;
    skillId: string;
    skillTitle?: string;
    providerId: string;
    providerName?: string;
    providerAvatar?: string | null;
    learnerId: string;
    learnerName?: string;
    learnerAvatar?: string | null;
    preferredDate: string;
    preferredTime: string;
    duration?: number;
    sessionType?: SessionType;
    message: string | null;
    notes?: string;
    status: BookingStatus;
    sessionCost: number;
    rescheduleInfo?: RescheduleInfo | null;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
    startAt?: Date;
    endAt?: Date;
    isReviewed?: boolean;
}
export declare class Booking {
    private readonly props;
    private constructor();
    static create(props: BookingProps): Booking;
    private validate;
    get id(): string | undefined;
    get skillId(): string;
    get skillTitle(): string | undefined;
    get providerId(): string;
    get providerName(): string | undefined;
    get providerAvatar(): string | null | undefined;
    get learnerId(): string;
    get learnerName(): string | undefined;
    get learnerAvatar(): string | null | undefined;
    get preferredDate(): string;
    get preferredTime(): string;
    get duration(): number | undefined;
    get sessionType(): SessionType | undefined;
    get message(): string | null;
    get notes(): string | undefined;
    get status(): BookingStatus;
    get sessionCost(): number;
    get rescheduleInfo(): RescheduleInfo | null | undefined;
    get rejectionReason(): string | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    get startAt(): Date | undefined;
    get endAt(): Date | undefined;
    get isReviewed(): boolean;
    canBeAccepted(): boolean;
    canBeRejected(): boolean;
    canBeCancelled(): boolean;
    canBeRescheduled(): boolean;
    canBeCompleted(): boolean;
    isInSession(): boolean;
    isRescheduleRequest(): boolean;
    isPending(): boolean;
    isConfirmed(): boolean;
    isCompleted(): boolean;
    isCancelled(): boolean;
    toObject(): BookingProps;
}
//# sourceMappingURL=Booking.d.ts.map