export enum ProjectPaymentRequestType {
    RELEASE = 'RELEASE',
    REFUND = 'REFUND',
}

export enum ProjectPaymentRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface ProjectPaymentRequestProps {
    id?: string;
    projectId: string;
    type: ProjectPaymentRequestType;
    amount: number;
    requestedBy: string;
    recipientId: string;
    status: ProjectPaymentRequestStatus;
    requesterNotes?: string | null;
    adminNotes?: string | null;
    processedAt?: Date | null;
    processedBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class ProjectPaymentRequest {
    private constructor(private props: ProjectPaymentRequestProps) {
        this.validate();
    }

    static create(props: ProjectPaymentRequestProps): ProjectPaymentRequest {
        return new ProjectPaymentRequest(props);
    }

    private validate(): void {
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
    get id(): string | undefined {
        return this.props.id;
    }

    get projectId(): string {
        return this.props.projectId;
    }

    get type(): ProjectPaymentRequestType {
        return this.props.type;
    }

    get amount(): number {
        return this.props.amount;
    }

    get requestedBy(): string {
        return this.props.requestedBy;
    }

    get recipientId(): string {
        return this.props.recipientId;
    }

    get status(): ProjectPaymentRequestStatus {
        return this.props.status;
    }

    get requesterNotes(): string | null | undefined {
        return this.props.requesterNotes;
    }

    get adminNotes(): string | null | undefined {
        return this.props.adminNotes;
    }

    get processedAt(): Date | null | undefined {
        return this.props.processedAt;
    }

    get processedBy(): string | null | undefined {
        return this.props.processedBy;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // Business Logic Methods
    isPending(): boolean {
        return this.props.status === ProjectPaymentRequestStatus.PENDING;
    }

    isApproved(): boolean {
        return this.props.status === ProjectPaymentRequestStatus.APPROVED;
    }

    isRejected(): boolean {
        return this.props.status === ProjectPaymentRequestStatus.REJECTED;
    }

    isReleaseRequest(): boolean {
        return this.props.type === ProjectPaymentRequestType.RELEASE;
    }

    isRefundRequest(): boolean {
        return this.props.type === ProjectPaymentRequestType.REFUND;
    }

    approve(adminId: string, notes?: string): void {
        if (!this.isPending()) {
            throw new Error('Only pending requests can be approved');
        }
        this.props.status = ProjectPaymentRequestStatus.APPROVED;
        this.props.processedBy = adminId;
        this.props.processedAt = new Date();
        this.props.adminNotes = notes || null;
        this.props.updatedAt = new Date();
    }

    reject(adminId: string, notes?: string): void {
        if (!this.isPending()) {
            throw new Error('Only pending requests can be rejected');
        }
        this.props.status = ProjectPaymentRequestStatus.REJECTED;
        this.props.processedBy = adminId;
        this.props.processedAt = new Date();
        this.props.adminNotes = notes || null;
        this.props.updatedAt = new Date();
    }

    toObject(): ProjectPaymentRequestProps {
        return { ...this.props };
    }

    toJSON(): ProjectPaymentRequestProps {
        return this.toObject();
    }

    static fromDatabaseRow(data: any): ProjectPaymentRequest {
        return new ProjectPaymentRequest({
            id: data.id,
            projectId: data.projectId || data.project_id,
            type: data.type as ProjectPaymentRequestType,
            amount: Number(data.amount),
            requestedBy: data.requestedBy || data.requested_by,
            recipientId: data.recipientId || data.recipient_id,
            status: data.status as ProjectPaymentRequestStatus,
            requesterNotes: data.requesterNotes || data.requester_notes || null,
            adminNotes: data.adminNotes || data.admin_notes || null,
            processedAt: data.processedAt || data.processed_at ? new Date(data.processedAt || data.processed_at) : null,
            processedBy: data.processedBy || data.processed_by || null,
            createdAt: new Date(data.createdAt || data.created_at),
            updatedAt: new Date(data.updatedAt || data.updated_at),
        });
    }
}
