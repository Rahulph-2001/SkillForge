export declare enum UserWalletTransactionType {
    PROJECT_EARNING = "PROJECT_EARNING",
    SESSION_EARNING = "SESSION_EARNING",
    SESSION_PAYMENT = "SESSION_PAYMENT",
    CREDIT_REDEMPTION = "CREDIT_REDEMPTION",
    WITHDRAWAL = "WITHDRAWAL",
    REFUND = "REFUND",
    CREDIT_PURCHASE = "CREDIT_PURCHASE"
}
export declare enum UserWalletTransactionStatus {
    COMPLETED = "COMPLETED",
    PENDING = "PENDING",
    FAILED = "FAILED"
}
export interface UserWalletTransactionProps {
    id: string;
    userId: string;
    type: UserWalletTransactionType;
    amount: number;
    currency: string;
    source: string;
    referenceId?: string | null;
    description?: string | null;
    metadata?: Record<string, any> | null;
    previousBalance: number;
    newBalance: number;
    status: UserWalletTransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserWalletTransaction {
    private readonly props;
    private constructor();
    static create(props: UserWalletTransactionProps): UserWalletTransaction;
    private validate;
    get id(): string;
    get userId(): string;
    get type(): UserWalletTransactionType;
    get amount(): number;
    get currency(): string;
    get source(): string;
    get referenceId(): string | null | undefined;
    get description(): string | null | undefined;
    get metadata(): Record<string, any> | null | undefined;
    get previousBalance(): number;
    get newBalance(): number;
    get status(): UserWalletTransactionStatus;
    get createdAt(): Date;
    get updatedAt(): Date;
    toJSON(): UserWalletTransactionProps;
    static fromDatabaseRow(data: any): UserWalletTransaction;
}
//# sourceMappingURL=UserWalletTransaction.d.ts.map