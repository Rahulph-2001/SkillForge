import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
  SESSION_CONFIRMED = 'SESSION_CONFIRMED',
  SESSION_DECLINED = 'SESSION_DECLINED',
  SESSION_CANCELLED = 'SESSION_CANCELLED',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  RESCHEDULE_REQUESTED = 'RESCHEDULE_REQUESTED',
  RESCHEDULE_ACCEPTED = 'RESCHEDULE_ACCEPTED',
  RESCHEDULE_DECLINED = 'RESCHEDULE_DECLINED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CREDITS_EARNED = 'CREDITS_EARNED',
  CREDITS_RECEIVED = 'CREDITS_RECEIVED',
  COMMUNITY_UPDATE = 'COMMUNITY_UPDATE',
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  PROFILE_VERIFIED = 'PROFILE_VERIFIED',
  PROJECT_APPLICATION_RECEIVED = 'PROJECT_APPLICATION_RECEIVED',
  PROJECT_APPLICATION_ACCEPTED = 'PROJECT_APPLICATION_ACCEPTED',
  PROJECT_APPLICATION_REJECTED = 'PROJECT_APPLICATION_REJECTED',
  PROJECT_COMPLETION_REQUESTED = 'PROJECT_COMPLETION_REQUESTED',
  PROJECT_COMPLETION_APPROVED = 'PROJECT_COMPLETION_APPROVED',
  PROJECT_COMPLETION_REJECTED = 'PROJECT_COMPLETION_REJECTED',
  SKILL_APPROVED = 'SKILL_APPROVED',
  SKILL_REJECTED = 'SKILL_REJECTED',
  SKILL_BLOCKED = 'SKILL_BLOCKED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  SUBSCRIPTION_RENEWED = 'SUBSCRIPTION_RENEWED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',

  // Admin Notifications
  NEW_USER_REGISTERED = 'NEW_USER_REGISTERED',
  NEW_SKILL_PENDING = 'NEW_SKILL_PENDING',
  NEW_REPORT_SUBMITTED = 'NEW_REPORT_SUBMITTED',
  WITHDRAWAL_REQUESTED = 'WITHDRAWAL_REQUESTED',
  PROJECT_ESCROW_RELEASE_REQUESTED = 'PROJECT_ESCROW_RELEASE_REQUESTED',
  NEW_PROJECT_CREATED = 'NEW_PROJECT_CREATED',
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

export class Notification {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _type: NotificationType;
  private readonly _title: string;
  private readonly _message: string;
  private readonly _data: Record<string, unknown> | null;
  private _isRead: boolean;
  private _readAt: Date | null;
  private readonly _createdAt: Date;

  constructor(props: CreateNotificationProps) {
    this._id = props.id || uuidv4();
    this._userId = props.userId;
    this._type = props.type;
    this._title = props.title;
    this._message = props.message;
    this._data = props.data || null;
    this._isRead = props.isRead || false;
    this._readAt = props.readAt || null;
    this._createdAt = props.createdAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._userId) {
      throw new Error('User ID is required');
    }
    if (!this._type) {
      throw new Error('Notification type is required');
    }
    if (!this._title || this._title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!this._message || this._message.trim().length === 0) {
      throw new Error('Message is required');
    }
  }

  public get id(): string { return this._id; }
  public get userId(): string { return this._userId; }
  public get type(): NotificationType { return this._type; }
  public get title(): string { return this._title; }
  public get message(): string { return this._message; }
  public get data(): Record<string, unknown> | null { return this._data; }
  public get isRead(): boolean { return this._isRead; }
  public get readAt(): Date | null { return this._readAt; }
  public get createdAt(): Date { return this._createdAt; }

  public markAsRead(): void {
    if (this._isRead) return;
    this._isRead = true;
    this._readAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      userId: this._userId,
      type: this._type,
      title: this._title,
      message: this._message,
      data: this._data,
      isRead: this._isRead,
      readAt: this._readAt,
      createdAt: this._createdAt,
    };
  }

  public static fromDatabaseRow(row: Record<string, unknown>): Notification {
    return new Notification({
      id: row.id as string,
      userId: (row.userId || row.user_id) as string,
      type: row.type as NotificationType,
      title: row.title as string,
      message: row.message as string,
      data: row.data as Record<string, unknown> | null,
      isRead: (row.isRead ?? row.is_read) as boolean,
      readAt: (row.readAt || row.read_at) as Date | null,
      createdAt: (row.createdAt || row.created_at) as Date,
    });
  }
}