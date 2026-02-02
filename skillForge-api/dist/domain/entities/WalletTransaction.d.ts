export interface WalletTransactionProps {
    id: string;
    adminId: string;
    type: 'CREDIT' | 'WITHDRAWAL' | 'DEBIT';
    amount: number;
    currency: string;
    source: string;
    referenceId?: string;
    description?: string;
    metadata?: Record<string, any>;
    previousBalance: number;
    newBalance: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class WalletTransaction {
    private readonly props;
    private constructor();
    static create(props: WalletTransactionProps): WalletTransaction;
    private validate;
    get id(): string;
    get adminId(): string;
    get type(): 'CREDIT' | 'WITHDRAWAL' | 'DEBIT';
    get amount(): number;
    get currency(): string;
    get source(): string;
    get referenceId(): string | undefined;
    get description(): string | undefined;
    get metadata(): Record<string, any> | undefined;
    get previousBalance(): number;
    get newBalance(): number;
    get status(): 'COMPLETED' | 'PENDING' | 'FAILED';
    get createdAt(): Date;
    get updatedAt(): Date;
    toJSON(): WalletTransactionProps;
    static fromDatabaseRow(data: any): WalletTransaction;
}
//# sourceMappingURL=WalletTransaction.d.ts.map