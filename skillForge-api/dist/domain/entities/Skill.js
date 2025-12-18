"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const uuid_1 = require("uuid");
class Skill {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._providerId = props.providerId;
        this._title = props.title;
        this._description = props.description;
        this._category = props.category;
        this._level = props.level;
        this._durationHours = props.durationHours;
        this._creditsPerHour = props.creditsPerHour;
        this._tags = props.tags;
        this._imageUrl = props.imageUrl || null;
        this._templateId = props.templateId || null;
        this._status = props.status || 'pending';
        this._verificationStatus = props.verificationStatus || 'not_started';
        this._mcqScore = props.mcqScore || null;
        this._mcqTotalQuestions = props.mcqTotalQuestions || 7;
        this._mcqPassingScore = props.mcqPassingScore || 70;
        this._totalSessions = props.totalSessions || 0;
        this._rating = props.rating || 0;
        this._isBlocked = props.isBlocked || false;
        this._blockedReason = props.blockedReason || null;
        this._blockedAt = props.blockedAt || null;
        this._isAdminBlocked = props.isAdminBlocked || false;
        this._verifiedAt = props.verifiedAt || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this.validate();
    }
    validate() {
        if (!this._title || this._title.trim().length === 0) {
            throw new Error('Title is required');
        }
        if (!this._providerId) {
            throw new Error('Provider ID is required');
        }
        if (this._creditsPerHour < 0) {
            throw new Error('Credits cannot be negative');
        }
    }
    // Getters
    get id() { return this._id; }
    get providerId() { return this._providerId; }
    get title() { return this._title; }
    get description() { return this._description; }
    get category() { return this._category; }
    get level() { return this._level; }
    get durationHours() { return this._durationHours; }
    get creditsPerHour() { return this._creditsPerHour; }
    get tags() { return this._tags; }
    get imageUrl() { return this._imageUrl; }
    get templateId() { return this._templateId; }
    get status() { return this._status; }
    get verificationStatus() { return this._verificationStatus; }
    get mcqScore() { return this._mcqScore; }
    get mcqTotalQuestions() { return this._mcqTotalQuestions; }
    get mcqPassingScore() { return this._mcqPassingScore; }
    get totalSessions() { return this._totalSessions; }
    get rating() { return this._rating; }
    get isBlocked() { return this._isBlocked; }
    get blockedReason() { return this._blockedReason; }
    get blockedAt() { return this._blockedAt; }
    get isAdminBlocked() { return this._isAdminBlocked; }
    get verifiedAt() { return this._verifiedAt; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    toJSON() {
        return {
            id: this._id,
            providerId: this._providerId,
            title: this._title,
            description: this._description,
            category: this._category,
            level: this._level,
            durationHours: this._durationHours,
            creditsPerHour: this._creditsPerHour,
            tags: this._tags,
            imageUrl: this._imageUrl,
            templateId: this._templateId,
            status: this._status,
            verificationStatus: this._verificationStatus,
            mcqScore: this._mcqScore,
            mcqTotalQuestions: this._mcqTotalQuestions,
            mcqPassingScore: this._mcqPassingScore,
            verifiedAt: this._verifiedAt,
            totalSessions: this._totalSessions,
            rating: this._rating,
            isBlocked: this._isBlocked,
            blockedReason: this._blockedReason,
            blockedAt: this._blockedAt,
            isAdminBlocked: this._isAdminBlocked,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    }
    passMCQ(score) {
        this._verificationStatus = 'passed';
        this._mcqScore = score;
        this._status = 'in-review';
        this._verifiedAt = new Date();
        this._updatedAt = new Date();
    }
}
exports.Skill = Skill;
//# sourceMappingURL=Skill.js.map