export declare enum ProjectPaymentRequestType {
    RELEASE = "RELEASE",
    REFUND = "REFUND"
}
export declare enum ProjectPaymentRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export interface ProjectPaymentRequestProps {
    id?: string;
    projectId: string;
    type: ProjectPaymentRequestType;
    amount: number;
    requestedBy: string;
    recipientId: string;
    status: ProjectPaymentRequestStatus;
    adminNotes?: string | null;
    processedAt?: Date | null;
    processedBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProjectPaymentRequest {
    private props;
    private constructor();
    static create(props: ProjectPaymentRequestProps): ProjectPaymentRequest;
    private validate;
    get id(): string | undefined;
    get projectId(): string;
    get type(): ProjectPaymentRequestType;
    get amount(): number;
    get requestedBy(): string;
    get recipientId(): string;
    get status(): ProjectPaymentRequestStatus;
    get adminNotes(): string | null | undefined;
    get processedAt(): Date | null | undefined;
    get processedBy(): string | null | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    isPending(): boolean;
    isApproved(): boolean;
    isRejected(): boolean;
    isReleaseRequest(): boolean;
    isRefundRequest(): boolean;
    approve(adminId: string, notes?: string): void;
    reject(adminId: string, notes?: string): void;
    toObject(): ProjectPaymentRequestProps;
    toJSON(): ProjectPaymentRequestProps;
    static fromDatabaseRow(data: any): ProjectPaymentRequest;
}
//# sourceMappingURL=ProjectPaymentRequest.d.ts.map