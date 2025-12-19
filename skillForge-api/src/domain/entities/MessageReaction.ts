import { v4 as uuidv4 } from 'uuid';

export interface CreateMessageReactionData {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
}

export class MessageReaction {
    private _id: string;
    private _messageId: string;
    private _userId: string;
    private _emoji: string;
    private _createdAt: Date;
    private _userName?: string;
    private _userAvatar?: string;

    constructor(data: CreateMessageReactionData) {
        this._id = data.id || uuidv4();
        this._messageId = data.messageId;
        this._userId = data.userId;
        this._emoji = data.emoji;
        this._createdAt = new Date();
    }

    // Getters
    get id(): string { return this._id; }
    get messageId(): string { return this._messageId; }
    get userId(): string { return this._userId; }
    get emoji(): string { return this._emoji; }
    get createdAt(): Date { return this._createdAt; }
    get userName(): string | undefined { return this._userName; }
    get userAvatar(): string | undefined { return this._userAvatar; }

    public toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            messageId: this._messageId,
            userId: this._userId,
            emoji: this._emoji,
            createdAt: this._createdAt,
            userName: this._userName,
            userAvatar: this._userAvatar,
        };
    }

    public static fromDatabaseRow(row: Record<string, any>): MessageReaction {
        const reaction = new MessageReaction({
            id: row.id as string,
            messageId: (row.message_id || row.messageId) as string,
            userId: (row.user_id || row.userId) as string,
            emoji: row.emoji as string,
        });

        const reactionAny = reaction as unknown as Record<string, unknown>;
        reactionAny._createdAt = (row.created_at || row.createdAt) as Date || new Date();

        // Map user details if available
        if (row.user) {
            reactionAny._userName = row.user.name || null;
            reactionAny._userAvatar = row.user.avatarUrl || null;
        }

        return reaction;
    }
}
