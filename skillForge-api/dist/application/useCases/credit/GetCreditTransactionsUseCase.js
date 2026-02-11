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
exports.GetCreditTransactionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const GetCreditTransactionsDTO_1 = require("../../dto/credit/GetCreditTransactionsDTO");
let GetCreditTransactionsUseCase = class GetCreditTransactionsUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(request) {
        const validatedRequest = GetCreditTransactionsDTO_1.GetCreditTransactionsRequestSchema.parse(request);
        const result = await this.transactionRepository.findCreditTransactions(validatedRequest.userId, {
            type: validatedRequest.type,
            page: validatedRequest.page,
            limit: validatedRequest.limit,
        });
        const stats = await this.transactionRepository.getCreditStats(validatedRequest.userId);
        const transactionDTOs = result.transactions.map(t => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            credits: t.metadata?.credits,
            description: t.description ?? null,
            status: t.status,
            createdAt: t.createdAt.toISOString(),
            metadata: t.metadata ?? null,
        }));
        return {
            transactions: transactionDTOs,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
            stats,
        };
    }
};
exports.GetCreditTransactionsUseCase = GetCreditTransactionsUseCase;
exports.GetCreditTransactionsUseCase = GetCreditTransactionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __metadata("design:paramtypes", [Object])
], GetCreditTransactionsUseCase);
//# sourceMappingURL=GetCreditTransactionsUseCase.js.map