export declare enum InterviewStatus {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export interface CreateInterviewProps {
    id?: string;
    applicationId: string;
    scheduledAt: Date;
    durationMinutes?: number;
    status?: InterviewStatus;
    meetingLink?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Interview {
    private readonly _id;
    private readonly _applicationId;
    private _scheduledAt;
    private _durationMinutes;
    private _status;
    private _meetingLink;
    private readonly _createdAt;
    private _updatedAt;
    constructor(props: CreateInterviewProps);
    private validate;
    get id(): string;
    get applicationId(): string;
    get scheduledAt(): Date;
    get durationMinutes(): number;
    get status(): InterviewStatus;
    get meetingLink(): string | null;
    get createdAt(): Date;
    get updatedAt(): Date;
    setMeetingLink(link: string): void;
    cancel(): void;
    complete(): void;
    toJSON(): {
        id: string;
        applicationId: string;
        scheduledAt: Date;
        durationMinutes: number;
        status: InterviewStatus;
        meetingLink: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=Interview.d.ts.map