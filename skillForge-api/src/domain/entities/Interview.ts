import { v4 as uuidv4 } from 'uuid';

export enum InterviewStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
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

export class Interview {
    private readonly _id: string;
    private readonly _applicationId: string;
    private _scheduledAt: Date;
    private _durationMinutes: number;
    private _status: InterviewStatus;
    private _meetingLink: string | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: CreateInterviewProps) {
        this._id = props.id || uuidv4();
        this._applicationId = props.applicationId;
        this._scheduledAt = props.scheduledAt;
        this._durationMinutes = props.durationMinutes || 30;
        this._status = props.status || InterviewStatus.SCHEDULED;
        this._meetingLink = props.meetingLink || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this.validate();
    }

    private validate(): void {
        if (!this._applicationId) throw new Error('Application ID is required');
        if (!this._scheduledAt) throw new Error('Scheduled date is required');
    }

    // Getters
    public get id(): string { return this._id; }
    public get applicationId(): string { return this._applicationId; }
    public get scheduledAt(): Date { return this._scheduledAt; }
    public get durationMinutes(): number { return this._durationMinutes; }
    public get status(): InterviewStatus { return this._status; }
    public get meetingLink(): string | null { return this._meetingLink; }
    public get createdAt(): Date { return this._createdAt; }
    public get updatedAt(): Date { return this._updatedAt; }

    public setMeetingLink(link: string): void {
        this._meetingLink = link;
        this._updatedAt = new Date();
    }

    public cancel(): void {
        this._status = InterviewStatus.CANCELLED;
        this._updatedAt = new Date();
    }

    public complete(): void {
        this._status = InterviewStatus.COMPLETED;
        this._updatedAt = new Date();
    }

    public toJSON() {
        return {
            id: this.id,
            applicationId: this.applicationId,
            scheduledAt: this.scheduledAt,
            durationMinutes: this.durationMinutes,
            status: this.status,
            meetingLink: this.meetingLink,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
