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
exports.GetAdminCreditTransactionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
let GetAdminCreditTransactionsUseCase = class GetAdminCreditTransactionsUseCase {
    constructor(userWalletTransactionRepository, userRepository) {
        this.userWalletTransactionRepository = userWalletTransactionRepository;
        this.userRepository = userRepository;
    }
    async execute(page, limit, search) {
        // Fetch all CREDIT_PURCHASE transactions
        const result = await this.userWalletTransactionRepository.findAll({
            page,
            limit,
            type: UserWalletTransaction_1.UserWalletTransactionType.CREDIT_PURCHASE,
            search
        });
        // Fetch user details for these transactions
        // Optimization: Collect unique user IDs and fetch them in one go
        const userIds = [...new Set(result.transactions.map(t => t.userId))];
        const users = await Promise.all(userIds.map(id => this.userRepository.findById(id)));
        const userMap = new Map(users.filter(u => u !== null).map(u => [u.id, u]));
        // Map to DTO
        const transactionsWithUser = result.transactions.map(t => {
            const user = userMap.get(t.userId);
            return {
                id: t.id,
                amount: t.amount,
                currency: t.currency,
                type: t.type,
                status: t.status,
                referenceId: t.referenceId,
                metadata: t.metadata,
                createdAt: t.createdAt,
                user: user ? {
                    id: user.id,
                    name: user.name,
                    email: user.email.value,
                    avatar: user.avatarUrl
                } : null
            };
        });
        return {
            transactions: transactionsWithUser,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
};
exports.GetAdminCreditTransactionsUseCase = GetAdminCreditTransactionsUseCase;
exports.GetAdminCreditTransactionsUseCase = GetAdminCreditTransactionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetAdminCreditTransactionsUseCase);
//# sourceMappingURL=GetAdminCreditTransactionsUseCase.js.map