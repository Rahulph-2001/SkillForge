"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.ProjectStatus = void 0;
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["OPEN"] = "Open";
    ProjectStatus["IN_PROGRESS"] = "In_Progress";
    ProjectStatus["COMPLETED"] = "Completed";
    ProjectStatus["CANCELLED"] = "Cancelled";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
class Project {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    static create(props) {
        return new Project(props);
    }
    validate() {
        if (!this.props.clientId) {
            throw new Error('Client ID is required');
        }
        if (!this.props.title || this.props.title.trim().length === 0) {
            throw new Error('Project title is required');
        }
        if (!this.props.description || this.props.description.trim().length === 0) {
            throw new Error('Project description is required');
        }
        if (!this.props.category) {
            throw new Error('Project category is required');
        }
        if (this.props.budget < 0) {
            throw new Error('Budget cannot be negative');
        }
        if (!this.props.duration) {
            throw new Error('Project duration is required');
        }
    }
    // Getters
    get id() {
        return this.props.id;
    }
    get clientId() {
        return this.props.clientId;
    }
    get title() {
        return this.props.title;
    }
    get description() {
        return this.props.description;
    }
    get category() {
        return this.props.category;
    }
    get tags() {
        return this.props.tags;
    }
    get budget() {
        return this.props.budget;
    }
    get duration() {
        return this.props.duration;
    }
    get deadline() {
        return this.props.deadline;
    }
    get status() {
        return this.props.status;
    }
    get paymentId() {
        return this.props.paymentId;
    }
    get applicationsCount() {
        return this.props.applicationsCount || 0;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    // Business logic methods
    canBeUpdated() {
        return this.props.status === ProjectStatus.OPEN || this.props.status === ProjectStatus.IN_PROGRESS;
    }
    canBeCancelled() {
        return this.props.status === ProjectStatus.OPEN || this.props.status === ProjectStatus.IN_PROGRESS;
    }
    canBeCompleted() {
        return this.props.status === ProjectStatus.IN_PROGRESS;
    }
    markAsInProgress() {
        if (this.props.status !== ProjectStatus.OPEN) {
            throw new Error('Only open projects can be marked as in progress');
        }
        this.props.status = ProjectStatus.IN_PROGRESS;
        this.props.updatedAt = new Date();
    }
    markAsCompleted() {
        if (!this.canBeCompleted()) {
            throw new Error('Project must be in progress to be marked as completed');
        }
        this.props.status = ProjectStatus.COMPLETED;
        this.props.updatedAt = new Date();
    }
    markAsCancelled() {
        if (!this.canBeCancelled()) {
            throw new Error('Project cannot be cancelled in its current state');
        }
        this.props.status = ProjectStatus.CANCELLED;
        this.props.updatedAt = new Date();
    }
    incrementApplicationsCount() {
        this.props.applicationsCount = (this.props.applicationsCount || 0) + 1;
        this.props.updatedAt = new Date();
    }
    toJSON() {
        return {
            id: this.props.id,
            clientId: this.props.clientId,
            title: this.props.title,
            description: this.props.description,
            category: this.props.category,
            tags: this.props.tags,
            budget: this.props.budget,
            duration: this.props.duration,
            deadline: this.props.deadline,
            status: this.props.status,
            paymentId: this.props.paymentId,
            applicationsCount: this.props.applicationsCount || 0,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
    toObject() {
        return this.toJSON();
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map