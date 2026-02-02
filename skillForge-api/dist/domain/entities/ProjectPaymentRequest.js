"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPaymentRequest = exports.ProjectPaymentRequestStatus = exports.ProjectPaymentRequestType = void 0;
var ProjectPaymentRequestType;
(function (ProjectPaymentRequestType) {
    ProjectPaymentRequestType["RELEASE"] = "RELEASE";
    ProjectPaymentRequestType["REFUND"] = "REFUND";
})(ProjectPaymentRequestType || (exports.ProjectPaymentRequestType = ProjectPaymentRequestType = {}));
var ProjectPaymentRequestStatus;
(function (ProjectPaymentRequestStatus) {
    ProjectPaymentRequestStatus["PENDING"] = "PENDING";
    ProjectPaymentRequestStatus["APPROVED"] = "APPROVED";
    ProjectPaymentRequestStatus["REJECTED"] = "REJECTED";
})(ProjectPaymentRequestStatus || (exports.ProjectPaymentRequestStatus = ProjectPaymentRequestStatus = {}));
class ProjectPaymentRequest {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    static create(props) {
        return new ProjectPaymentRequest(props);
    }
    validate() {
        if (!this.props.projectId) {
            throw new Error('Project ID is required');
        }
        if (!this.props.requestedBy) {
            throw new Error('Requester ID is required');
        }
        if (!this.props.recipientId) {
            throw new Error('Recipient ID is required');
        }
        if (this.props.amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (!Object.values(ProjectPaymentRequestType).includes(this.props.type)) {
            throw new Error('Invalid payment request type');
        }
        if (!Object.values(ProjectPaymentRequestStatus).includes(this.props.status)) {
            throw new Error('Invalid payment request status');
        }
    }
    // Getters
    get id() {
        return this.props.id;
    }
    get projectId() {
        return this.props.projectId;
    }
    get type() {
        return this.props.type;
    }
    get amount() {
        return this.props.amount;
    }
    get requestedBy() {
        return this.props.requestedBy;
    }
    get recipientId() {
        return this.props.recipientId;
    }
    get status() {
        return this.props.status;
    }
    get adminNotes() {
        return this.props.adminNotes;
    }
    get processedAt() {
        return this.props.processedAt;
    }
    get processedBy() {
        return this.props.processedBy;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    // Business Logic Methods
    isPending() {
        return this.props.status === ProjectPaymentRequestStatus.PENDING;
    }
    isApproved() {
        return this.props.status === ProjectPaymentRequestStatus.APPROVED;
    }
    isRejected() {
        return this.props.status === ProjectPaymentRequestStatus.REJECTED;
    }
    isReleaseRequest() {
        return this.props.type === ProjectPaymentRequestType.RELEASE;
    }
    isRefundRequest() {
        return this.props.type === ProjectPaymentRequestType.REFUND;
    }
    approve(adminId, notes) {
        if (!this.isPending()) {
            throw new Error('Only pending requests can be approved');
        }
        this.props.status = ProjectPaymentRequestStatus.APPROVED;
        this.props.processedBy = adminId;
        this.props.processedAt = new Date();
        this.props.adminNotes = notes || null;
        this.props.updatedAt = new Date();
    }
    reject(adminId, notes) {
        if (!this.isPending()) {
            throw new Error('Only pending requests can be rejected');
        }
        this.props.status = ProjectPaymentRequestStatus.REJECTED;
        this.props.processedBy = adminId;
        this.props.processedAt = new Date();
        this.props.adminNotes = notes || null;
        this.props.updatedAt = new Date();
    }
    toObject() {
        return { ...this.props };
    }
    toJSON() {
        return this.toObject();
    }
    static fromDatabaseRow(data) {
        return new ProjectPaymentRequest({
            id: data.id,
            projectId: data.projectId || data.project_id,
            type: data.type,
            amount: Number(data.amount),
            requestedBy: data.requestedBy || data.requested_by,
            recipientId: data.recipientId || data.recipient_id,
            status: data.status,
            adminNotes: data.adminNotes || data.admin_notes || null,
            processedAt: data.processedAt || data.processed_at ? new Date(data.processedAt || data.processed_at) : null,
            processedBy: data.processedBy || data.processed_by || null,
            createdAt: new Date(data.createdAt || data.created_at),
            updatedAt: new Date(data.updatedAt || data.updated_at),
        });
    }
}
exports.ProjectPaymentRequest = ProjectPaymentRequest;
//# sourceMappingURL=ProjectPaymentRequest.js.map