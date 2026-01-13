"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMessage = void 0;
const uuid_1 = require("uuid");
class CommunityMessage {
    constructor(data) {
        this._id = data.id || (0, uuid_1.v4)();
        this._communityId = data.communityId;
        this._senderId = data.senderId;
        this._content = data.content;
        this._type = data.type || 'text';
        this._fileUrl = data.fileUrl || null;
        this._fileName = data.fileName || null;
        this._isPinned = false;
        this._pinnedAt = null;
        this._pinnedBy = null;
        this._replyToId = data.replyToId || null;
        this._sourceMessageId = data.forwardedFromId || null;
        this._isDeleted = false;
        this._deletedAt = null;
        const now = new Date();
        this._createdAt = now;
        this._updatedAt = now;
        // Initialize sender fields with defaults (will be populated from DB row)
        this._senderName = 'Unknown User';
        this._senderAvatar = null;
    }
    // Getters
    get id() { return this._id; }
    get communityId() { return this._communityId; }
    get senderId() { return this._senderId; }
    get content() { return this._content; }
    get type() { return this._type; }
    get fileUrl() { return this._fileUrl; }
    get fileName() { return this._fileName; }
    get isPinned() { return this._isPinned; }
    get pinnedAt() { return this._pinnedAt; }
    get pinnedBy() { return this._pinnedBy; }
    get replyToId() { return this._replyToId; }
    get forwardedFromId() { return this._sourceMessageId; }
    get isDeleted() { return this._isDeleted; }
    get deletedAt() { return this._deletedAt; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get senderName() { return this._senderName; }
    get senderAvatar() { return this._senderAvatar; }
    pin(userId) {
        this._isPinned = true;
        this._pinnedAt = new Date();
        this._pinnedBy = userId;
        this._updatedAt = new Date();
    }
    unpin() {
        this._isPinned = false;
        this._pinnedAt = null;
        this._pinnedBy = null;
        this._updatedAt = new Date();
    }
    delete() {
        this._isDeleted = true;
        this._deletedAt = new Date();
        this._updatedAt = new Date();
    }
    toJSON() {
        return {
            id: this._id,
            community_id: this._communityId,
            sender_id: this._senderId,
            content: this._content,
            type: this._type,
            file_url: this._fileUrl,
            file_name: this._fileName,
            is_pinned: this._isPinned,
            pinned_at: this._pinnedAt,
            pinned_by: this._pinnedBy,
            reply_to_id: this._replyToId,
            forwarded_from_id: this._sourceMessageId,
            is_deleted: this._isDeleted,
            deleted_at: this._deletedAt,
            created_at: this._createdAt,
            updated_at: this._updatedAt,
            sender_name: this._senderName,
            sender_avatar: this._senderAvatar,
            reactions: this._reactions || [],
        };
    }
    static fromDatabaseRow(row) {
        const message = new CommunityMessage({
            id: row.id,
            communityId: (row.community_id || row.communityId),
            senderId: (row.sender_id || row.senderId),
            content: row.content,
            type: row.type,
            fileUrl: (row.file_url || row.fileUrl),
            fileName: (row.file_name || row.fileName),
            replyToId: (row.reply_to_id || row.replyToId),
            forwardedFromId: (row.forwarded_from_id || row.forwardedFromId),
        });
        const messageAny = message;
        messageAny._isPinned = (row.is_pinned || row.isPinned) || false;
        messageAny._pinnedAt = (row.pinned_at || row.pinnedAt);
        messageAny._pinnedBy = (row.pinned_by || row.pinnedBy);
        messageAny._isDeleted = (row.is_deleted || row.isDeleted) || false;
        messageAny._deletedAt = (row.deleted_at || row.deletedAt);
        messageAny._createdAt = (row.created_at || row.createdAt) || new Date();
        messageAny._updatedAt = (row.updated_at || row.updatedAt) || new Date();
        // Extract sender details from joined user relation
        messageAny._senderName = row.sender?.name || 'Unknown User';
        messageAny._senderAvatar = row.sender?.avatar || row.sender?.avatarUrl || null;
        // Map reactions if available
        if (row.reactions && Array.isArray(row.reactions)) {
            const reactionsArray = row.reactions;
            const grouped = new Map();
            reactionsArray.forEach((reaction) => {
                const emoji = reaction.emoji;
                if (!grouped.has(emoji)) {
                    grouped.set(emoji, {
                        emoji,
                        users: [],
                        count: 0,
                        hasReacted: false,
                    });
                }
                const group = grouped.get(emoji);
                group.users.push({
                    id: reaction.userId,
                    name: reaction.user?.name || 'Unknown',
                    avatar: reaction.user?.avatarUrl || null,
                });
                group.count++;
            });
            messageAny._reactions = Array.from(grouped.values());
        }
        else {
            messageAny._reactions = [];
        }
        return message;
    }
}
exports.CommunityMessage = CommunityMessage;
//# sourceMappingURL=CommunityMessage.js.map