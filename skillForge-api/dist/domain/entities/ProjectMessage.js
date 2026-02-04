"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMessage = void 0;
const uuid_1 = require("uuid");
class ProjectMessage {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._projectId = props.projectId;
        this._senderId = props.senderId;
        this._content = props.content;
        this._isRead = props.isRead || false;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this._sender = props.sender;
        this.validate();
    }
    validate() {
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
    get id() { return this._id; }
    get projectId() { return this._projectId; }
    get senderId() { return this._senderId; }
    get content() { return this._content; }
    get isRead() { return this._isRead; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get sender() { return this._sender; }
    // Domain behaviors
    markAsRead() {
        this._isRead = true;
        this._updatedAt = new Date();
    }
}
exports.ProjectMessage = ProjectMessage;
//# sourceMappingURL=ProjectMessage.js.map