"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallRoom = void 0;
const uuid_1 = require("uuid");
class VideoCallRoom {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._roomCode = props.roomCode || this.generateRoomCode();
        this._bookingId = props.bookingId || null;
        this._interviewId = props.interviewId || null;
        this._hostId = props.hostId;
        this._status = props.status || 'waiting';
        this._createdAt = props.createdAt || new Date();
        this._endedAt = props.endedAt || null;
        this.validate();
    }
    validate() {
        if (!this._hostId)
            throw new Error('Host ID is required');
    }
    generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 3; i++)
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        code += '-';
        for (let i = 0; i < 3; i++)
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    }
    get id() { return this._id; }
    get roomCode() { return this._roomCode; }
    get bookingId() { return this._bookingId; }
    get interviewId() { return this._interviewId; }
    get hostId() { return this._hostId; }
    get status() { return this._status; }
    get createdAt() { return this._createdAt; }
    get endedAt() { return this._endedAt; }
    canJoin() { return this._status !== 'ended'; }
    isHost(userId) { return this._hostId === userId; }
    activate() { if (this._status === 'waiting')
        this._status = 'active'; }
    end() { this._status = 'ended'; this._endedAt = new Date(); }
}
exports.VideoCallRoom = VideoCallRoom;
//# sourceMappingURL=VideoCallRoom.js.map