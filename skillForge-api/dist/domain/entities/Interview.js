"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interview = exports.InterviewStatus = void 0;
const uuid_1 = require("uuid");
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "SCHEDULED";
    InterviewStatus["COMPLETED"] = "COMPLETED";
    InterviewStatus["CANCELLED"] = "CANCELLED";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
class Interview {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._applicationId = props.applicationId;
        this._scheduledAt = props.scheduledAt;
        this._durationMinutes = props.durationMinutes || 30;
        this._status = props.status || InterviewStatus.SCHEDULED;
        this._meetingLink = props.meetingLink || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this.validate();
    }
    validate() {
        if (!this._applicationId)
            throw new Error('Application ID is required');
        if (!this._scheduledAt)
            throw new Error('Scheduled date is required');
    }
    // Getters
    get id() { return this._id; }
    get applicationId() { return this._applicationId; }
    get scheduledAt() { return this._scheduledAt; }
    get durationMinutes() { return this._durationMinutes; }
    get status() { return this._status; }
    get meetingLink() { return this._meetingLink; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    setMeetingLink(link) {
        this._meetingLink = link;
        this._updatedAt = new Date();
    }
    cancel() {
        this._status = InterviewStatus.CANCELLED;
        this._updatedAt = new Date();
    }
    complete() {
        this._status = InterviewStatus.COMPLETED;
        this._updatedAt = new Date();
    }
    toJSON() {
        return {
            id: this.id,
            applicationId: this.applicationId,
            scheduledAt: this.scheduledAt,
            durationMinutes: this.durationMinutes,
            status: this.status,
            meetingLink: this.meetingLink,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
exports.Interview = Interview;
//# sourceMappingURL=Interview.js.map