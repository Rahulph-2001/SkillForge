"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const PaymentEnums_1 = require("../enums/PaymentEnums");
class Payment {
    constructor(props) {
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
    validate() {
        if (this._amount <= 0) {
            throw new Error('Payment amount must be greater than 0');
        }
        if (this._refundedAmount !== undefined && this._refundedAmount > this._amount) {
            throw new Error('Refunded amount cannot exceed payment amount');
        }
    }
    get id() { return this._id; }
    get userId() { return this._userId; }
    get provider() { return this._provider; }
    get providerPaymentId() { return this._providerPaymentId; }
    get providerCustomerId() { return this._providerCustomerId; }
    get amount() { return this._amount; }
    get currency() { return this._currency; }
    get purpose() { return this._purpose; }
    get status() { return this._status; }
    get metadata() { return this._metadata; }
    get failureReason() { return this._failureReason; }
    get refundedAmount() { return this._refundedAmount; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    markAsSucceeded(providerPaymentId) {
        this._status = PaymentEnums_1.PaymentStatus.SUCCEEDED;
        this._providerPaymentId = providerPaymentId;
        this._updatedAt = new Date();
    }
    markAsFailed(reason) {
        this._status = PaymentEnums_1.PaymentStatus.FAILED;
        this._failureReason = reason;
        this._updatedAt = new Date();
    }
    markAsRefunded(amount) {
        if (amount > this._amount) {
            throw new Error('Refund amount cannot exceed payment amount');
        }
        this._status = PaymentEnums_1.PaymentStatus.REFUNDED;
        this._refundedAmount = amount;
        this._updatedAt = new Date();
    }
    toJSON() {
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
    static fromJSON(data) {
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
exports.Payment = Payment;
//# sourceMappingURL=Payment.js.map