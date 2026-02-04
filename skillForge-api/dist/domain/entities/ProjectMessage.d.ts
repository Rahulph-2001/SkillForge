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
export declare class ProjectMessage {
    private readonly _id;
    private readonly _projectId;
    private readonly _senderId;
    private readonly _content;
    private _isRead;
    private readonly _createdAt;
    private _updatedAt;
    private _sender?;
    constructor(props: CreateProjectMessageProps);
    private validate;
    get id(): string;
    get projectId(): string;
    get senderId(): string;
    get content(): string;
    get isRead(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    get sender(): {
        id: string;
        name: string;
        avatarUrl?: string | null;
    } | undefined;
    markAsRead(): void;
}
//# sourceMappingURL=ProjectMessage.d.ts.map