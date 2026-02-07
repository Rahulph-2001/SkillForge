export declare enum ProjectStatus {
    OPEN = "Open",
    IN_PROGRESS = "In_Progress",
    PENDING_COMPLETION = "Pending_Completion",
    PAYMENT_PENDING = "Payment_Pending",
    REFUND_PENDING = "Refund_Pending",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}
export interface ProjectProps {
    id?: string;
    clientId: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    budget: number;
    duration: string;
    deadline?: string | null;
    status: ProjectStatus;
    paymentId?: string | null;
    applicationsCount?: number;
    createdAt: Date;
    updatedAt: Date;
    isSuspended?: boolean;
    suspendedAt?: Date | null;
    suspendedReason?: string | null;
    client?: {
        id: string;
        name: string;
        avatarUrl?: string | null;
    };
    acceptedContributor?: {
        id: string;
        name: string;
        avatarUrl?: string | null;
    };
}
export declare class Project {
    private readonly props;
    private constructor();
    static create(props: ProjectProps): Project;
    private validate;
    get id(): string | undefined;
    get clientId(): string;
    get title(): string;
    get description(): string;
    get category(): string;
    get tags(): string[];
    get budget(): number;
    get duration(): string;
    get deadline(): string | null | undefined;
    get status(): ProjectStatus;
    get paymentId(): string | null | undefined;
    get applicationsCount(): number;
    get createdAt(): Date;
    get updatedAt(): Date;
    get isSuspended(): boolean;
    get suspendedAt(): Date | null | undefined;
    get suspendReason(): string | null | undefined;
    canBeUpdated(): boolean;
    canBeCancelled(): boolean;
    canBeCompleted(): boolean;
    markAsInProgress(): void;
    markAsPendingCompletion(): void;
    requestModifications(): void;
    markAsCompleted(): void;
    markAsPaymentPending(): void;
    markAsRefundPending(): void;
    revertToPendingCompletion(): void;
    revertToInProgress(): void;
    markAsCancelled(): void;
    incrementApplicationsCount(): void;
    get acceptedContributor(): {
        id: string;
        name: string;
        avatarUrl?: string | null;
    } | undefined;
    suspend(reason: string): void;
    toJSON(): ProjectProps;
    get client(): {
        id: string;
        name: string;
        avatarUrl?: string | null;
    } | undefined;
    toObject(): ProjectProps;
}
//# sourceMappingURL=Project.d.ts.map