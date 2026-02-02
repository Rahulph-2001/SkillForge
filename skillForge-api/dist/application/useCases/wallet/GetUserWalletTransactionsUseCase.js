"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserWalletTransactionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let GetUserWalletTransactionsUseCase = class GetUserWalletTransactionsUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(userId, filters) {
        const result = await this.transactionRepository.findByUserId(userId, {
            type: filters.type,
            status: filters.status,
            page: filters.page,
            limit: filters.limit,
        });
        const transactions = result.transactions.map(t => ({
            id: t.id,
            userId: t.userId,
            type: t.type,
            amount: t.amount,
            currency: t.currency,
            source: t.source,
            referenceId: t.referenceId,
            description: t.description,
            metadata: t.metadata,
            previousBalance: t.previousBalance,
            newBalance: t.newBalance,
            status: t.status,
            createdAt: t.createdAt.toISOString(),
        }));
        return {
            transactions,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        };
    }
};
exports.GetUserWalletTransactionsUseCase = GetUserWalletTransactionsUseCase;
exports.GetUserWalletTransactionsUseCase = GetUserWalletTransactionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __metadata("design:paramtypes", [Object])
], GetUserWalletTransactionsUseCase);
//# sourceMappingURL=GetUserWalletTransactionsUseCase.js.map