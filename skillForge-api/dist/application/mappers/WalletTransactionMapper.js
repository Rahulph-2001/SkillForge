"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionMapper = void 0;
const inversify_1 = require("inversify");
let WalletTransactionMapper = class WalletTransactionMapper {
    toDTO(transaction, userName, userEmail) {
        const data = transaction.toJSON();
        return {
            id: data.id,
            transactionId: `wt-${data.id.substring(0, 8)}`,
            userId: data.metadata?.userId || data.adminId,
            userName: userName || 'System',
            userEmail: userEmail || 'system@skillforge.com',
            type: data.type,
            amount: data.amount,
            description: data.description || `${data.source} transaction`,
            date: data.createdAt,
            status: data.status,
            metadata: data.metadata,
        };
    }
    toDTOList(transactions, userMap) {
        return transactions.map(transaction => {
            const data = transaction.toJSON();
            const userId = data.metadata?.userId;
            const user = userId ? userMap.get(userId) : undefined;
            return this.toDTO(transaction, user?.name, user?.email);
        });
    }
};
exports.WalletTransactionMapper = WalletTransactionMapper;
exports.WalletTransactionMapper = WalletTransactionMapper = __decorate([
    (0, inversify_1.injectable)()
], WalletTransactionMapper);
//# sourceMappingURL=WalletTransactionMapper.js.map