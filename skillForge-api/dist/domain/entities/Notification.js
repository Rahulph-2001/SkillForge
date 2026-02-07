"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationType = void 0;
const uuid_1 = require("uuid");
var NotificationType;
(function (NotificationType) {
    NotificationType["SESSION_CONFIRMED"] = "SESSION_CONFIRMED";
    NotificationType["SESSION_DECLINED"] = "SESSION_DECLINED";
    NotificationType["SESSION_CANCELLED"] = "SESSION_CANCELLED";
    NotificationType["SESSION_COMPLETED"] = "SESSION_COMPLETED";
    NotificationType["RESCHEDULE_REQUESTED"] = "RESCHEDULE_REQUESTED";
    NotificationType["RESCHEDULE_ACCEPTED"] = "RESCHEDULE_ACCEPTED";
    NotificationType["RESCHEDULE_DECLINED"] = "RESCHEDULE_DECLINED";
    NotificationType["NEW_MESSAGE"] = "NEW_MESSAGE";
    NotificationType["CREDITS_EARNED"] = "CREDITS_EARNED";
    NotificationType["CREDITS_RECEIVED"] = "CREDITS_RECEIVED";
    NotificationType["COMMUNITY_UPDATE"] = "COMMUNITY_UPDATE";
    NotificationType["BOOKING_REQUEST"] = "BOOKING_REQUEST";
    NotificationType["PROFILE_VERIFIED"] = "PROFILE_VERIFIED";
    NotificationType["PROJECT_APPLICATION_RECEIVED"] = "PROJECT_APPLICATION_RECEIVED";
    NotificationType["PROJECT_APPLICATION_ACCEPTED"] = "PROJECT_APPLICATION_ACCEPTED";
    NotificationType["PROJECT_APPLICATION_REJECTED"] = "PROJECT_APPLICATION_REJECTED";
    NotificationType["PROJECT_COMPLETION_REQUESTED"] = "PROJECT_COMPLETION_REQUESTED";
    NotificationType["PROJECT_COMPLETION_APPROVED"] = "PROJECT_COMPLETION_APPROVED";
    NotificationType["PROJECT_COMPLETION_REJECTED"] = "PROJECT_COMPLETION_REJECTED";
    NotificationType["SKILL_APPROVED"] = "SKILL_APPROVED";
    NotificationType["SKILL_REJECTED"] = "SKILL_REJECTED";
    NotificationType["SKILL_BLOCKED"] = "SKILL_BLOCKED";
    NotificationType["INTERVIEW_SCHEDULED"] = "INTERVIEW_SCHEDULED";
    NotificationType["SUBSCRIPTION_RENEWED"] = "SUBSCRIPTION_RENEWED";
    NotificationType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class Notification {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
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
    validate() {
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
    get id() { return this._id; }
    get userId() { return this._userId; }
    get type() { return this._type; }
    get title() { return this._title; }
    get message() { return this._message; }
    get data() { return this._data; }
    get isRead() { return this._isRead; }
    get readAt() { return this._readAt; }
    get createdAt() { return this._createdAt; }
    markAsRead() {
        if (this._isRead)
            return;
        this._isRead = true;
        this._readAt = new Date();
    }
    toJSON() {
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
    static fromDatabaseRow(row) {
        return new Notification({
            id: row.id,
            userId: (row.userId || row.user_id),
            type: row.type,
            title: row.title,
            message: row.message,
            data: row.data,
            isRead: (row.isRead ?? row.is_read),
            readAt: (row.readAt || row.read_at),
            createdAt: (row.createdAt || row.created_at),
        });
    }
}
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map