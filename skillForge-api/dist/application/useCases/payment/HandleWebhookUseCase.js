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
exports.HandleWebhookUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const PaymentEnums_1 = require("../../../domain/enums/PaymentEnums");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
let HandleWebhookUseCase = class HandleWebhookUseCase {
    constructor(paymentRepository, activateSubscriptionUseCase, creditAdminWalletUseCase) {
        this.paymentRepository = paymentRepository;
        this.activateSubscriptionUseCase = activateSubscriptionUseCase;
        this.creditAdminWalletUseCase = creditAdminWalletUseCase;
    }
    async execute(event) {
        const { type, data } = event;
        switch (type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(data.object);
                break;
            case 'charge.refunded':
                await this.handleRefund(data.object);
                break;
            default:
                console.log(`Unhandled webhook event type: ${type}`);
        }
    }
    async handlePaymentSuccess(paymentIntent) {
        try {
            const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
            if (!payment) {
                console.error(`Payment not found for provider payment ID: ${paymentIntent.id}`);
                return;
            }
            // Update payment status
            payment.markAsSucceeded(paymentIntent.id);
            await this.paymentRepository.update(payment);
            // Handle subscription payment
            if (payment.purpose === PaymentEnums_1.PaymentPurpose.SUBSCRIPTION) {
                await this.handleSubscriptionPayment(payment);
            }
            // Handle credit purchase (if needed in future)
            // if (payment.purpose === PaymentPurpose.CREDIT_PURCHASE) {
            //     await this.handleCreditPurchase(payment);
            // }
        }
        catch (error) {
            console.error('Error handling payment success:', error);
            // Log error but don't throw - webhook should still return 200
        }
    }
    async handleSubscriptionPayment(payment) {
        try {
            const metadata = payment.metadata || {};
            const { planId, planName } = metadata;
            if (!planId) {
                console.error('No planId in payment metadata for subscription payment');
                return;
            }
            // Activate subscription
            const activationResult = await this.activateSubscriptionUseCase.execute({
                userId: payment.userId,
                planId: planId,
                paymentId: payment.id,
                billingInterval: metadata.billingInterval || SubscriptionEnums_1.BillingInterval.MONTHLY // Read from metadata
            });
            console.log(`Subscription activated for user ${payment.userId}:`, activationResult);
            // Credit admin wallet
            const walletResult = await this.creditAdminWalletUseCase.execute({
                amount: payment.amount,
                currency: payment.currency,
                source: 'SUBSCRIPTION_PAYMENT',
                referenceId: payment.id,
                metadata: {
                    planId,
                    planName,
                    userId: payment.userId
                }
            });
            console.log(`Admin wallet credited:`, walletResult);
        }
        catch (error) {
            console.error('Error handling subscription payment:', error);
            // Log error but don't throw
        }
    }
    async handlePaymentFailure(paymentIntent) {
        const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
        if (payment) {
            payment.markAsFailed(paymentIntent.last_payment_error?.message || 'Payment failed');
            await this.paymentRepository.update(payment);
        }
    }
    async handleRefund(charge) {
        const payment = await this.paymentRepository.findByProviderPaymentId(charge.payment_intent);
        if (payment) {
            payment.markAsRefunded(charge.amount_refunded / 100);
            await this.paymentRepository.update(payment);
        }
    }
};
exports.HandleWebhookUseCase = HandleWebhookUseCase;
exports.HandleWebhookUseCase = HandleWebhookUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IPaymentRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IActivateSubscriptionUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ICreditAdminWalletUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], HandleWebhookUseCase);
//# sourceMappingURL=HandleWebhookUseCase.js.map