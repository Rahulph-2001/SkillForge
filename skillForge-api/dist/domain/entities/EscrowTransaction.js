"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowTransaction = exports.EscrowStatus = void 0;
var EscrowStatus;
(function (EscrowStatus) {
    EscrowStatus["HELD"] = "HELD";
    EscrowStatus["RELEASED"] = "RELEASED";
    EscrowStatus["REFUNDED"] = "REFUNDED";
})(EscrowStatus || (exports.EscrowStatus = EscrowStatus = {}));
class EscrowTransaction {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    static create(props) {
        return new EscrowTransaction(props);
    }
    static createNew(bookingId, learnerId, providerId, amount) {
        const now = new Date();
        return new EscrowTransaction({
            bookingId,
            learnerId,
            providerId,
            amount,
            status: EscrowStatus.HELD,
            heldAt: now,
            releasedAt: null,
            refundedAt: null,
            createdAt: now,
            updatedAt: now,
        });
    }
    validate() {
        if (!this.props.bookingId) {
            throw new Error('Booking ID is required');
        }
        if (!this.props.learnerId) {
            throw new Error('Learner ID is required');
        }
        if (!this.props.providerId) {
            throw new Error('Provider ID is required');
        }
        if (this.props.amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (!Object.values(EscrowStatus).includes(this.props.status)) {
            throw new Error('Invalid escrow status');
        }
    }
    get id() {
        return this.props.id;
    }
    get bookingId() {
        return this.props.bookingId;
    }
    get learnerId() {
        return this.props.learnerId;
    }
    get providerId() {
        return this.props.providerId;
    }
    get amount() {
        return this.props.amount;
    }
    get status() {
        return this.props.status;
    }
    get heldAt() {
        return this.props.heldAt;
    }
    get releasedAt() {
        return this.props.releasedAt;
    }
    get refundedAt() {
        return this.props.refundedAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    isHeld() {
        return this.props.status === EscrowStatus.HELD;
    }
    isReleased() {
        return this.props.status === EscrowStatus.RELEASED;
    }
    isRefunded() {
        return this.props.status === EscrowStatus.REFUNDED;
    }
    canBeReleased() {
        return this.props.status === EscrowStatus.HELD;
    }
    canBeRefunded() {
        return this.props.status === EscrowStatus.HELD;
    }
    toObject() {
        return { ...this.props };
    }
    static fromDatabaseRow(data) {
        return new EscrowTransaction({
            id: data.id,
            bookingId: data.bookingId || data.booking_id,
            learnerId: data.learnerId || data.learner_id,
            providerId: data.providerId || data.provider_id,
            amount: Number(data.amount),
            status: data.status,
            heldAt: new Date(data.heldAt || data.held_at),
            releasedAt: data.releasedAt || data.released_at ? new Date(data.releasedAt || data.released_at) : null,
            refundedAt: data.refundedAt || data.refunded_at ? new Date(data.refundedAt || data.refunded_at) : null,
            createdAt: new Date(data.createdAt || data.created_at),
            updatedAt: new Date(data.updatedAt || data.updated_at),
        });
    }
}
exports.EscrowTransaction = EscrowTransaction;
//# sourceMappingURL=EscrowTransaction.js.map