"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectApplication = exports.ProjectApplicationStatus = void 0;
const uuid_1 = require("uuid");
var ProjectApplicationStatus;
(function (ProjectApplicationStatus) {
    ProjectApplicationStatus["PENDING"] = "PENDING";
    ProjectApplicationStatus["REVIEWED"] = "REVIEWED";
    ProjectApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ProjectApplicationStatus["ACCEPTED"] = "ACCEPTED";
    ProjectApplicationStatus["REJECTED"] = "REJECTED";
    ProjectApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(ProjectApplicationStatus || (exports.ProjectApplicationStatus = ProjectApplicationStatus = {}));
class ProjectApplication {
    constructor(props) {
        this._id = props.id || (0, uuid_1.v4)();
        this._projectId = props.projectId;
        this._applicantId = props.applicantId;
        this._coverLetter = props.coverLetter;
        this._proposedBudget = props.proposedBudget ?? null;
        this._proposedDuration = props.proposedDuration ?? null;
        this._status = props.status || ProjectApplicationStatus.PENDING;
        this._matchScore = props.matchScore ?? null;
        this._matchAnalysis = props.matchAnalysis ?? null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this._reviewedAt = props.reviewedAt ?? null;
        this.project = props.project;
        this.applicant = props.applicant;
        this.interviews = props.interviews;
        this.validate();
    }
    validate() {
        if (!this._projectId) {
            throw new Error('Project ID is required');
        }
        if (!this._applicantId) {
            throw new Error('Applicant ID is required');
        }
        if (!this._coverLetter || this._coverLetter.trim().length < 50) {
            throw new Error('Cover letter must be at least 50 characters');
        }
        if (this._proposedBudget !== null && this._proposedBudget < 0) {
            throw new Error('Proposed budget cannot be negative');
        }
    }
    // Getters
    get id() { return this._id; }
    get projectId() { return this._projectId; }
    get applicantId() { return this._applicantId; }
    get coverLetter() { return this._coverLetter; }
    get proposedBudget() { return this._proposedBudget; }
    get proposedDuration() { return this._proposedDuration; }
    get status() { return this._status; }
    get matchScore() { return this._matchScore; }
    get matchAnalysis() { return this._matchAnalysis; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get reviewedAt() { return this._reviewedAt; }
    // Domain methods
    setMatchScore(score, analysis) {
        this._matchScore = score;
        this._matchAnalysis = analysis;
        this._status = ProjectApplicationStatus.REVIEWED;
        this._reviewedAt = new Date();
        this._updatedAt = new Date();
    }
    shortlist() {
        if (this._status !== ProjectApplicationStatus.REVIEWED && this._status !== ProjectApplicationStatus.PENDING) {
            throw new Error('Application must be pending or reviewed before shortlisting');
        }
        this._status = ProjectApplicationStatus.SHORTLISTED;
        this._updatedAt = new Date();
    }
    accept() {
        if (this._status !== ProjectApplicationStatus.SHORTLISTED &&
            this._status !== ProjectApplicationStatus.REVIEWED &&
            this._status !== ProjectApplicationStatus.PENDING) {
            throw new Error('Application must be pending, reviewed, or shortlisted before accepting');
        }
        this._status = ProjectApplicationStatus.ACCEPTED;
        this._updatedAt = new Date();
    }
    reject() {
        this._status = ProjectApplicationStatus.REJECTED;
        this._updatedAt = new Date();
    }
    withdraw() {
        if (this._status === ProjectApplicationStatus.ACCEPTED) {
            throw new Error('Cannot withdraw accepted application');
        }
        this._status = ProjectApplicationStatus.WITHDRAWN;
        this._updatedAt = new Date();
    }
    canBeModified() {
        return this._status === ProjectApplicationStatus.PENDING;
    }
    toJSON() {
        return {
            id: this.id,
            projectId: this.projectId,
            applicantId: this.applicantId,
            coverLetter: this.coverLetter,
            proposedBudget: this.proposedBudget,
            proposedDuration: this.proposedDuration,
            status: this.status,
            matchScore: this.matchScore,
            matchAnalysis: this.matchAnalysis,
            appliedAt: this.createdAt, // Frontend expects appliedAt
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            reviewedAt: this.reviewedAt,
            project: this.project,
            applicant: this.applicant,
            interviews: this.interviews,
        };
    }
}
exports.ProjectApplication = ProjectApplication;
//# sourceMappingURL=ProjectApplication.js.map