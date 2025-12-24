
import { PaymentProvider, PaymentStatus, PaymentPurpose, Currency } from '../enums/PaymentEnums';

export interface PaymentProps {
    id: string;
    userId: string;
    provider: PaymentProvider;
    providerPaymentId?: string;
    providerCustomerId?: string;
    amount: number;
    currency: Currency;
    purpose: PaymentPurpose;
    status: PaymentStatus;
    metadata?: Record<string, any>;
    failureReason?: string;
    refundedAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export class Payment {
    private _id: string;
    private _userId: string;
    private _provider: PaymentProvider;
    private _providerPaymentId?: string;
    private _providerCustomerId?: string;
    private _amount: number;
    private _currency: Currency;
    private _purpose: PaymentPurpose;
    private _status: PaymentStatus;
    private _metadata?: Record<string, any>;
    private _failureReason?: string;
    private _refundedAmount?: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: PaymentProps) {
        this._id = props.id;
        this._userId = props.userId;
        this._provider = props.provider;
        this._providerPaymentId = props.providerPaymentId;
        this._providerCustomerId = props.providerCustomerId;
        this._amount = props.amount;
        this._currency = props.currency;
        this._purpose = props.purpose;
        this._status = props.status;
        this._metadata = props.metadata;
        this._failureReason = props.failureReason;
        this._refundedAmount = props.refundedAmount;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;

        this.validate();
    }

    private validate(): void {
        if (this._amount <= 0) {
            throw new Error('Payment amount must be greater than 0');
        }

        if (this._refundedAmount !== undefined && this._refundedAmount > this._amount) {
            throw new Error('Refunded amount cannot exceed payment amount');
        }
    }

    get id(): string { return this._id; }
    get userId(): string { return this._userId; }
    get provider(): PaymentProvider { return this._provider; }
    get providerPaymentId(): string | undefined { return this._providerPaymentId; }
    get providerCustomerId(): string | undefined { return this._providerCustomerId; }
    get amount(): number { return this._amount; }
    get currency(): Currency { return this._currency; }
    get purpose(): PaymentPurpose { return this._purpose; }
    get status(): PaymentStatus { return this._status; }
    get metadata(): Record<string, any> | undefined { return this._metadata; }
    get failureReason(): string | undefined { return this._failureReason; }
    get refundedAmount(): number | undefined { return this._refundedAmount; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    public markAsSucceeded(providerPaymentId: string): void {
        this._status = PaymentStatus.SUCCEEDED;
        this._providerPaymentId = providerPaymentId;
        this._updatedAt = new Date();
    }

    public markAsFailed(reason: string): void {
        this._status = PaymentStatus.FAILED;
        this._failureReason = reason;
        this._updatedAt = new Date();
    }

    public markAsRefunded(amount: number): void {
        if (amount > this._amount) {
            throw new Error('Refund amount cannot exceed payment amount');
        }
        this._status = PaymentStatus.REFUNDED;
        this._refundedAmount = amount;
        this._updatedAt = new Date();
    }

    public toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            userId: this._userId,
            provider: this._provider,
            providerPaymentId: this._providerPaymentId,
            providerCustomerId: this._providerCustomerId,
            amount: this._amount,
            currency: this._currency,
            purpose: this._purpose,
            status: this._status,
            metadata: this._metadata,
            failureReason: this._failureReason,
            refundedAmount: this._refundedAmount,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    public static fromJSON(data: any): Payment {
        return new Payment({
            id: data.id,
            userId: data.userId || data.user_id,
            provider: data.provider,
            providerPaymentId: data.providerPaymentId || data.provider_payment_id,
            providerCustomerId: data.providerCustomerId || data.provider_customer_id,
            amount: data.amount,
            currency: data.currency,
            purpose: data.purpose,
            status: data.status,
            metadata: data.metadata,
            failureReason: data.failureReason || data.failure_reason,
            refundedAmount: data.refundedAmount || data.refunded_amount,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(data.created_at),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.updated_at),
        });
    }
}