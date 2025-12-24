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
exports.PrismaPaymentRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../di/types");
const Payment_1 = require("../../../domain/entities/Payment");
let PrismaPaymentRepository = class PrismaPaymentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(payment) {
        const data = await this.prisma.payment.create({
            data: {
                id: payment.id,
                user_id: payment.userId,
                provider: payment.provider,
                provider_payment_id: payment.providerPaymentId,
                provider_customer_id: payment.providerCustomerId,
                amount: payment.amount,
                currency: payment.currency,
                purpose: payment.purpose,
                status: payment.status,
                metadata: payment.metadata,
                failure_reason: payment.failureReason,
                refunded_amount: payment.refundedAmount,
                created_at: payment.createdAt,
                updated_at: payment.updatedAt,
            },
        });
        return Payment_1.Payment.fromJSON(data);
    }
    async findById(id) {
        const data = await this.prisma.payment.findUnique({ where: { id } });
        return data ? Payment_1.Payment.fromJSON(data) : null;
    }
    async findByProviderPaymentId(providerPaymentId) {
        const data = await this.prisma.payment.findFirst({
            where: { provider_payment_id: providerPaymentId },
        });
        return data ? Payment_1.Payment.fromJSON(data) : null;
    }
    async findByUserId(userId, page, limit) {
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where: { user_id: userId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.payment.count({ where: { user_id: userId } }),
        ]);
        return {
            payments: data.map(Payment_1.Payment.fromJSON),
            total,
        };
    }
    async findByUserIdAndPurpose(userId, purpose) {
        const data = await this.prisma.payment.findMany({
            where: { user_id: userId, purpose },
            orderBy: { created_at: 'desc' },
        });
        return data.map(Payment_1.Payment.fromJSON);
    }
    async update(payment) {
        const data = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: payment.status,
                provider_payment_id: payment.providerPaymentId,
                failure_reason: payment.failureReason,
                refunded_amount: payment.refundedAmount,
                updated_at: payment.updatedAt,
            },
        });
        return Payment_1.Payment.fromJSON(data);
    }
    async updateStatus(id, status) {
        await this.prisma.payment.update({
            where: { id },
            data: { status, updated_at: new Date() },
        });
    }
};
exports.PrismaPaymentRepository = PrismaPaymentRepository;
exports.PrismaPaymentRepository = PrismaPaymentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaPaymentRepository);
//# sourceMappingURL=PaymentRepository.js.map