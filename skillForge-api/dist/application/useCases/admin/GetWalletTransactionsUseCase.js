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
exports.GetWalletTransactionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
let GetWalletTransactionsUseCase = class GetWalletTransactionsUseCase {
    constructor(paymentRepository, userRepository, paginationService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.paginationService = paginationService;
    }
    async execute(page, limit, search, type, status) {
        // Get all users for mapping payment userIds to user names
        const users = await this.userRepository.findAll();
        const paginationParams = this.paginationService.createParams(page, limit);
        // For admin wallet transactions, we need ALL subscription payments (not just admin user's payments)
        // These are payments made by regular users that credit the admin wallet
        // Default to SUCCEEDED status since only successful payments credit the wallet
        const paymentStatus = status ? this.mapStatusToPaymentStatus(status) : PaymentEnums_1.PaymentStatus.SUCCEEDED;
        // Build filter object - only include status if it's provided or defaulting to SUCCEEDED
        const filters = {
            purpose: PaymentEnums_1.PaymentPurpose.SUBSCRIPTION,
            status: paymentStatus,
        };
        if (search) {
            filters.search = search;
        }
        const result = await this.paymentRepository.findWithPagination(paginationParams, filters);
        let payments = result.data;
        if (type === 'WITHDRAWAL') {
            payments = [];
        }
        const transactions = await Promise.all(payments.map(async (payment) => {
            const paymentUser = users.find(u => u.id === payment.userId);
            const metadata = payment.metadata || {};
            const planName = metadata.planName || 'Subscription Plan';
            return {
                id: payment.id,
                transactionId: `wt-${payment.id.substring(0, 8)}`,
                userId: payment.userId,
                userName: paymentUser?.name || 'Unknown User',
                userEmail: paymentUser?.email?.value || 'unknown@example.com',
                type: 'CREDIT',
                amount: payment.amount,
                description: `Subscription payment: ${planName}`,
                date: payment.createdAt,
                status: this.mapPaymentStatusToStatus(payment.status),
                metadata: payment.metadata,
            };
        }));
        return {
            transactions,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
    mapStatusToPaymentStatus(status) {
        const statusMap = {
            'COMPLETED': PaymentEnums_1.PaymentStatus.SUCCEEDED,
            'PENDING': PaymentEnums_1.PaymentStatus.PENDING,
            'FAILED': PaymentEnums_1.PaymentStatus.FAILED,
        };
        return statusMap[status];
    }
    mapPaymentStatusToStatus(paymentStatus) {
        const statusMap = {
            [PaymentEnums_1.PaymentStatus.SUCCEEDED]: 'COMPLETED',
            [PaymentEnums_1.PaymentStatus.PENDING]: 'PENDING',
            [PaymentEnums_1.PaymentStatus.FAILED]: 'FAILED',
            [PaymentEnums_1.PaymentStatus.PROCESSING]: 'PENDING',
            [PaymentEnums_1.PaymentStatus.CANCELED]: 'FAILED',
            [PaymentEnums_1.PaymentStatus.REFUNDED]: 'COMPLETED',
        };
        return statusMap[paymentStatus] || 'PENDING';
    }
};
exports.GetWalletTransactionsUseCase = GetWalletTransactionsUseCase;
exports.GetWalletTransactionsUseCase = GetWalletTransactionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetWalletTransactionsUseCase);
//# sourceMappingURL=GetWalletTransactionsUseCase.js.map