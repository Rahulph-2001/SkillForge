"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReaction = void 0;
const uuid_1 = require("uuid");
class MessageReaction {
    constructor(data) {
        this._id = data.id || (0, uuid_1.v4)();
        this._messageId = data.messageId;
        this._userId = data.userId;
        this._emoji = data.emoji;
        this._createdAt = new Date();
    }
    // Getters
    get id() { return this._id; }
    get messageId() { return this._messageId; }
    get userId() { return this._userId; }
    get emoji() { return this._emoji; }
    get createdAt() { return this._createdAt; }
    get userName() { return this._userName; }
    get userAvatar() { return this._userAvatar; }
    toJSON() {
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
    static fromDatabaseRow(row) {
        const reaction = new MessageReaction({
            id: row.id,
            messageId: (row.message_id || row.messageId),
            userId: (row.user_id || row.userId),
            emoji: row.emoji,
        });
        const reactionAny = reaction;
        reactionAny._createdAt = (row.created_at || row.createdAt) || new Date();
        // Map user details if available
        if (row.user) {
            reactionAny._userName = row.user.name || null;
            reactionAny._userAvatar = row.user.avatarUrl || null;
        }
        return reaction;
    }
}
exports.MessageReaction = MessageReaction;
//# sourceMappingURL=MessageReaction.js.map