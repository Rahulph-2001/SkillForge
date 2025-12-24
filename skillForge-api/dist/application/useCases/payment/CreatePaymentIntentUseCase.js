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
exports.CreatePaymentIntentUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Payment_1 = require("../../../domain/entities/Payment");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
const uuid_1 = require("uuid");
let CreatePaymentIntentUseCase = class CreatePaymentIntentUseCase {
    constructor(paymentGateway, paymentRepository) {
        this.paymentGateway = paymentGateway;
        this.paymentRepository = paymentRepository;
    }
    async execute(userId, dto) {
        const payment = new Payment_1.Payment({
            id: (0, uuid_1.v4)(),
            userId,
            provider: PaymentEnums_1.PaymentProvider.STRIPE,
            amount: dto.amount,
            currency: dto.currency,
            purpose: dto.purpose,
            status: PaymentEnums_1.PaymentStatus.PENDING,
            metadata: dto.metadata,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedPayment = await this.paymentRepository.create(payment);
        console.log('[CreatePaymentIntentUseCase] Creating payment intent for user:', userId, 'with metadata:', dto.metadata);
        const paymentIntent = await this.paymentGateway.createPaymentIntent({
            amount: dto.amount,
            currency: dto.currency,
            userId,
            purpose: dto.purpose,
            metadata: {
                ...dto.metadata,
                paymentId: savedPayment.id,
            },
        });
        console.log('[CreatePaymentIntentUseCase] Payment intent created:', paymentIntent.paymentIntentId);
        // CRITICAL FIX: Update the payment record with the Stripe payment intent ID
        // This is needed so ConfirmPaymentUseCase can find the payment later
        savedPayment.markAsSucceeded(paymentIntent.paymentIntentId);
        // Reset status back to PENDING since payment isn't actually succeeded yet
        const updatedPayment = await this.paymentRepository.update(savedPayment);
        // Manually set status back to PENDING after update (since markAsSucceeded sets it to SUCCEEDED)
        await this.paymentRepository.updateStatus(updatedPayment.id, PaymentEnums_1.PaymentStatus.PENDING);
        return {
            clientSecret: paymentIntent.clientSecret,
            paymentIntentId: paymentIntent.paymentIntentId,
            paymentId: savedPayment.id,
        };
    }
};
exports.CreatePaymentIntentUseCase = CreatePaymentIntentUseCase;
exports.CreatePaymentIntentUseCase = CreatePaymentIntentUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IPaymentGateway)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CreatePaymentIntentUseCase);
//# sourceMappingURL=CreatePaymentIntentUseCase.js.map