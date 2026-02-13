export enum WithdrawalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
}

export interface CreateWithdrawalRequestProps {
    id?: string;
    userId: string;
    amount: number;
    currency?: string;
    status?: WithdrawalStatus;
    bankDetails: Record<string, any>;
    adminNote?: string | null;
    processedBy?: string | null;
    processedAt?: Date | null;
    transactionId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class WithdrawalRequest {
    private readonly _id: string;
    private readonly _userId: string;
    private readonly _amount: number;
    private readonly _currency: string;
    private _status: WithdrawalStatus;
    private readonly _bankDetails: Record<string, any>;
    private _adminNote: string | null;
    private _processedBy: string | null;
    private _processedAt: Date | null;
    private _transactionId: string | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: CreateWithdrawalRequestProps) {
        this._id = props.id || crypto.randomUUID();
        this._userId = props.userId;
        this._amount = props.amount;
        this._currency = props.currency || 'INR';
        this._status = props.status || WithdrawalStatus.PENDING;
        this._bankDetails = props.bankDetails;
        this._adminNote = props.adminNote || null;
        this._processedBy = props.processedBy || null;
        this._processedAt = props.processedAt || null;
        this._transactionId = props.transactionId || null;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();

        this.validate();
    }

    private validate(): void {
        if (!this._userId) {
            throw new Error('User ID is required');
        }
        if (this._amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        if (!this._bankDetails) {
            throw new Error('Bank details are required');
        }
    }

    get id(): string { return this._id; }
    get userId(): string { return this._userId; }
    get amount(): number { return this._amount; }
    get currency(): string { return this._currency; }
    get status(): WithdrawalStatus { return this._status; }
    get bankDetails(): Record<string, any> { return this._bankDetails; }
    get adminNote(): string | null { return this._adminNote; }
    get processedBy(): string | null { return this._processedBy; }
    get processedAt(): Date | null { return this._processedAt; }
    get transactionId(): string | null { return this._transactionId; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    approve(processorId: string, transactionId: string, note?: string): void {
        if (this._status !== WithdrawalStatus.PENDING) {
            throw new Error('Only pending requests can be approved');
        }
        this._status = WithdrawalStatus.PROCESSED;
        this._processedBy = processorId;
        this._processedAt = new Date();
        this._transactionId = transactionId;
        if (note) this._adminNote = note;
        this._updatedAt = new Date();
    }

    reject(processorId: string, note: string): void {
        if (this._status !== WithdrawalStatus.PENDING) {
            throw new Error('Only pending requests can be rejected');
        }
        this._status = WithdrawalStatus.REJECTED;
        this._processedBy = processorId;
        this._processedAt = new Date();
        this._adminNote = note;
        this._updatedAt = new Date();
    }
}
