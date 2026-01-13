export type MessageType = 'text' | 'image' | 'video' | 'file';
export interface CreateCommunityMessageData {
    id?: string;
    communityId: string;
    senderId: string;
    content: string;
    type?: MessageType;
    fileUrl?: string | null;
    fileName?: string | null;
    replyToId?: string | null;
    forwardedFromId?: string | null;
}
export interface ReactionData {
    emoji: string;
    userId: string;
    userName?: string;
    userAvatar?: string;
    user?: {
        id: string;
        name: string;
        avatar?: string;
        avatarUrl?: string;
    };
}
export interface ReactionUser {
    id: string;
    name: string;
    avatar?: string | null;
}
export declare class CommunityMessage {
    private _id;
    private _communityId;
    private _senderId;
    private _content;
    private _type;
    private _fileUrl;
    private _fileName;
    private _isPinned;
    private _pinnedAt;
    private _pinnedBy;
    private _replyToId;
    private _sourceMessageId;
    private _isDeleted;
    private _deletedAt;
    private _createdAt;
    private _updatedAt;
    private _senderName;
    private _senderAvatar;
    private _reactions?;
    constructor(data: CreateCommunityMessageData);
    get id(): string;
    get communityId(): string;
    get senderId(): string;
    get content(): string;
    get type(): MessageType;
    get fileUrl(): string | null;
    get fileName(): string | null;
    get isPinned(): boolean;
    get pinnedAt(): Date | null;
    get pinnedBy(): string | null;
    get replyToId(): string | null;
    get forwardedFromId(): string | null;
    get isDeleted(): boolean;
    get deletedAt(): Date | null;
    get createdAt(): Date;
    get updatedAt(): Date;
    get senderName(): string;
    get senderAvatar(): string | null;
    pin(userId: string): void;
    unpin(): void;
    delete(): void;
    toJSON(): Record<string, unknown>;
    static fromDatabaseRow(row: Record<string, unknown>): CommunityMessage;
}
//# sourceMappingURL=CommunityMessage.d.ts.map