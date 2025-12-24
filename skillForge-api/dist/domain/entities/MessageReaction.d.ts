export interface CreateMessageReactionData {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
}
export declare class MessageReaction {
    private _id;
    private _messageId;
    private _userId;
    private _emoji;
    private _createdAt;
    private _userName?;
    private _userAvatar?;
    constructor(data: CreateMessageReactionData);
    get id(): string;
    get messageId(): string;
    get userId(): string;
    get emoji(): string;
    get createdAt(): Date;
    get userName(): string | undefined;
    get userAvatar(): string | undefined;
    toJSON(): Record<string, unknown>;
    static fromDatabaseRow(row: Record<string, any>): MessageReaction;
}
//# sourceMappingURL=MessageReaction.d.ts.map