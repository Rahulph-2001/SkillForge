
import { v4 as uuidv4 } from 'uuid';

export interface CreateProjectMessageProps {
    id?: string;
    projectId: string;
    senderId: string;
    content: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    sender?: {
        id: string;
        name: string;
        avatarUrl?: string | null;
    };
}

export class ProjectMessage {
    private readonly _id: string;
    private readonly _projectId: string;
    private readonly _senderId: string;
    private readonly _content: string;
    private _isRead: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    // Relations/Hydrated data
    private _sender?: {
        id: string;
        name: string;
        avatarUrl?: string | null;
    };

    constructor(props: CreateProjectMessageProps) {
        this._id = props.id || uuidv4();
        this._projectId = props.projectId;
        this._senderId = props.senderId;
        this._content = props.content;
        this._isRead = props.isRead || false;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this._sender = props.sender;

        this.validate();
    }

    private validate(): void {
        if (!this._projectId) {
            throw new Error('Project ID is required');
        }
        if (!this._senderId) {
            throw new Error('Sender ID is required');
        }
        if (!this._content || this._content.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }
    }

    // Getters
    public get id(): string { return this._id; }
    public get projectId(): string { return this._projectId; }
    public get senderId(): string { return this._senderId; }
    public get content(): string { return this._content; }
    public get isRead(): boolean { return this._isRead; }
    public get createdAt(): Date { return this._createdAt; }
    public get updatedAt(): Date { return this._updatedAt; }
    public get sender() { return this._sender; }

    // Domain behaviors
    public markAsRead(): void {
        this._isRead = true;
        this._updatedAt = new Date();
    }
}
