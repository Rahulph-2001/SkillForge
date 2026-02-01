"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransaction = void 0;
class WalletTransaction {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    static create(props) {
        return new WalletTransaction(props);
    }
    validate() {
        if (!this.props.adminId) {
            throw new Error('Admin ID is required');
        }
        if (this.props.amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (!['CREDIT', 'WITHDRAWAL'].includes(this.props.type)) {
            throw new Error('Invalid transaction type');
        }
    }
    get id() {
        return this.props.id;
    }
    get adminId() {
        return this.props.adminId;
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
        return new WalletTransaction({
            id: data.id,
            adminId: data.adminId || data.admin_id,
            type: data.type,
            amount: Number(data.amount),
            currency: data.currency,
            source: data.source,
            referenceId: data.referenceId || data.reference_id,
            description: data.description,
            metadata: data.metadata,
            previousBalance: Number(data.previousBalance || data.previous_balance),
            newBalance: Number(data.newBalance || data.new_balance),
            status: data.status,
            createdAt: new Date(data.createdAt || data.created_at),
            updatedAt: new Date(data.updatedAt || data.updated_at),
        });
    }
}
exports.WalletTransaction = WalletTransaction;
//# sourceMappingURL=WalletTransaction.js.map