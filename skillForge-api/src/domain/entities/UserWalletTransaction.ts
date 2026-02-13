export enum UserWalletTransactionType {
    PROJECT_EARNING = 'PROJECT_EARNING',
    SESSION_EARNING = 'SESSION_EARNING',
    SESSION_PAYMENT = 'SESSION_PAYMENT',
    CREDIT_REDEMPTION = 'CREDIT_REDEMPTION',
    WITHDRAWAL = 'WITHDRAWAL',
    REFUND = 'REFUND',
    CREDIT_PURCHASE = 'CREDIT_PURCHASE',
    COMMUNITY_JOIN = 'COMMUNITY_JOIN',
    COMMUNITY_EARNING = 'COMMUNITY_EARNING',
    PROJECT_PAYMENT = 'PROJECT_PAYMENT',
    WITHDRAWAL_REQUEST = 'WITHDRAWAL_REQUEST',
    WITHDRAWAL_PROCESSED = 'WITHDRAWAL_PROCESSED',
    WITHDRAWAL_REJECTED = 'WITHDRAWAL_REJECTED',
    CREDIT_REDEMPTION_SUCCESS = 'CREDIT_REDEMPTION_SUCCESS',
}

export enum UserWalletTransactionStatus {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
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

export class UserWalletTransaction {
    private constructor(private readonly props: UserWalletTransactionProps) {
        this.validate();
    }

    static create(props: UserWalletTransactionProps): UserWalletTransaction {
        return new UserWalletTransaction(props);
    }

    private validate(): void {
        if (!this.props.userId) {
            throw new Error('User ID is required');
        }
        // Amount can be positive (earnings/purchases) or negative (spending/locking)
        // No validation needed for amount sign
        if (!Object.values(UserWalletTransactionType).includes(this.props.type)) {
            throw new Error('Invalid transaction type');
        }
        if (!Object.values(UserWalletTransactionStatus).includes(this.props.status)) {
            throw new Error('Invalid transaction status');
        }
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get type(): UserWalletTransactionType {
        return this.props.type;
    }

    get amount(): number {
        return this.props.amount;
    }

    get currency(): string {
        return this.props.currency;
    }

    get source(): string {
        return this.props.source;
    }

    get referenceId(): string | null | undefined {
        return this.props.referenceId;
    }

    get description(): string | null | undefined {
        return this.props.description;
    }

    get metadata(): Record<string, any> | null | undefined {
        return this.props.metadata;
    }

    get previousBalance(): number {
        return this.props.previousBalance;
    }

    get newBalance(): number {
        return this.props.newBalance;
    }

    get status(): UserWalletTransactionStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    toJSON(): UserWalletTransactionProps {
        return { ...this.props };
    }

    static fromDatabaseRow(data: any): UserWalletTransaction {
        return new UserWalletTransaction({
            id: data.id,
            userId: data.userId || data.user_id,
            type: data.type as UserWalletTransactionType,
            amount: Number(data.amount),
            currency: data.currency,
            source: data.source,
            referenceId: data.referenceId || data.reference_id || null,
            description: data.description || null,
            metadata: data.metadata || null,
            previousBalance: Number(data.previousBalance || data.previous_balance),
            newBalance: Number(data.newBalance || data.new_balance),
            status: data.status as UserWalletTransactionStatus,
            createdAt: new Date(data.createdAt || data.created_at),
            updatedAt: new Date(data.updatedAt || data.updated_at),
        });
    }
}
