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
export declare class Payment {
    private _id;
    private _userId;
    private _provider;
    private _providerPaymentId?;
    private _providerCustomerId?;
    private _amount;
    private _currency;
    private _purpose;
    private _status;
    private _metadata?;
    private _failureReason?;
    private _refundedAmount?;
    private _createdAt;
    private _updatedAt;
    constructor(props: PaymentProps);
    private validate;
    get id(): string;
    get userId(): string;
    get provider(): PaymentProvider;
    get providerPaymentId(): string | undefined;
    get providerCustomerId(): string | undefined;
    get amount(): number;
    get currency(): Currency;
    get purpose(): PaymentPurpose;
    get status(): PaymentStatus;
    get metadata(): Record<string, any> | undefined;
    get failureReason(): string | undefined;
    get refundedAmount(): number | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    markAsSucceeded(providerPaymentId: string): void;
    markAsFailed(reason: string): void;
    markAsRefunded(amount: number): void;
    markAsReleased(): void;
    toJSON(): Record<string, unknown>;
    static fromJSON(data: any): Payment;
}
//# sourceMappingURL=Payment.d.ts.map