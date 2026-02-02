"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletTransaction = exports.UserWalletTransactionStatus = exports.UserWalletTransactionType = void 0;
var UserWalletTransactionType;
(function (UserWalletTransactionType) {
    UserWalletTransactionType["PROJECT_EARNING"] = "PROJECT_EARNING";
    UserWalletTransactionType["CREDIT_REDEMPTION"] = "CREDIT_REDEMPTION";
    UserWalletTransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    UserWalletTransactionType["REFUND"] = "REFUND";
})(UserWalletTransactionType || (exports.UserWalletTransactionType = UserWalletTransactionType = {}));
var UserWalletTransactionStatus;
(function (UserWalletTransactionStatus) {
    UserWalletTransactionStatus["COMPLETED"] = "COMPLETED";
    UserWalletTransactionStatus["PENDING"] = "PENDING";
    UserWalletTransactionStatus["FAILED"] = "FAILED";
})(UserWalletTransactionStatus || (exports.UserWalletTransactionStatus = UserWalletTransactionStatus = {}));
class UserWalletTransaction {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    static create(props) {
        return new UserWalletTransaction(props);
    }
    validate() {
        if (!this.props.userId) {
            throw new Error('User ID is required');
        }
        if (this.props.amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (!Object.values(UserWalletTransactionType).includes(this.props.type)) {
            throw new Error('Invalid transaction type');
        }
        if (!Object.values(UserWalletTransactionStatus).includes(this.props.status)) {
            throw new Error('Invalid transaction status');
        }
    }
    get id() {
        return this.props.id;
    }
    get userId() {
        return this.props.userId;
    }
    get type() {
        return this.props.type;
    }
    get amount() {
        return this.props.amount;
    }
    get currency() {
        return this.props.currency;
    }
    get source() {
        return this.props.source;
    }
    get referenceId() {
        return this.props.referenceId;
    }
    get description() {
        return this.props.description;
    }
    get metadata() {
        return this.props.metadata;
    }
    get previousBalance() {
        return this.props.previousBalance;
    }
    get newBalance() {
        return this.props.newBalance;
    }
    get status() {
        return this.props.status;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    toJSON() {
        return { ...this.props };
    }
    static fromDatabaseRow(data) {
        return new UserWalletTransaction({
            id: data.id,
            userId: data.userId || data.user_id,
            type: data.type,
            amount: Number(data.amount),
            currency: data.currency,
            source: data.source,
            referenceId: data.referenceId || data.reference_id || null,
            description: data.description || null,
            metadata: data.metadata || null,
            previousBalance: Number(data.previousBalance || data.previous_balance),
            newBalance: Number(data.newBalance || data.new_balance),
            status: data.status,
            createdAt: new Date(data.createdAt || data.created_at),
            updatedAt: new Date(data.updatedAt || data.updated_at),
        });
    }
}
exports.UserWalletTransaction = UserWalletTransaction;
//# sourceMappingURL=UserWalletTransaction.js.map