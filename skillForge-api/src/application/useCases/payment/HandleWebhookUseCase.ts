import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { WebhookEventDTO } from '../../dto/payment/WebhookEventDTO';
import { PaymentStatus, PaymentPurpose } from '../../../domain/enums/PaymentEnums';
import { IHandleWebhookUseCase } from './interfaces/IHandleWebhookUseCase';
import { IActivateSubscriptionUseCase } from '../subscription/interfaces/IActivateSubscriptionUseCase';
import { ICreditAdminWalletUseCase } from '../admin/interfaces/ICreditAdminWalletUseCase';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';
import { StripePaymentIntent, StripeCharge } from '../../types/stripe';
import { Payment } from '../../../domain/entities/Payment';

@injectable()
export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
        @inject(TYPES.IPaymentRepository) private paymentRepository: IPaymentRepository,
        @inject(TYPES.IActivateSubscriptionUseCase) private activateSubscriptionUseCase: IActivateSubscriptionUseCase,
        @inject(TYPES.ICreditAdminWalletUseCase) private creditAdminWalletUseCase: ICreditAdminWalletUseCase
    ) { }

    async execute(event: WebhookEventDTO): Promise<void> {
        const { type, data } = event;

        switch (type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(data.object as StripePaymentIntent);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(data.object as StripePaymentIntent);
                break;
            case 'charge.refunded':
                await this.handleRefund(data.object as StripeCharge);
                break;
            default:
                // Unhandled webhook event type - log for monitoring
                // TODO: Add proper logging service
        }
    }

    private async handlePaymentSuccess(paymentIntent: StripePaymentIntent): Promise<void> {
        try {
            const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
            if (!payment) {
                // Payment not found - may have been created outside this system
                // TODO: Add proper logging service for monitoring
                return;
            }

            // Update payment status
            payment.markAsSucceeded(paymentIntent.id);
            await this.paymentRepository.update(payment);

            // Handle subscription payment
            if (payment.purpose === PaymentPurpose.SUBSCRIPTION) {
                await this.handleSubscriptionPayment(payment);
            }

            // Handle credit purchase (if needed in future)
            // if (payment.purpose === PaymentPurpose.CREDIT_PURCHASE) {
            //     await this.handleCreditPurchase(payment);
            // }

        } catch (error) {
            console.error('Error handling payment success:', error);
            // Log error but don't throw - webhook should still return 200
        }
    }

    private async handleSubscriptionPayment(payment: Payment): Promise<void> {
        try {
            const metadata = payment.metadata || {};
            const { planId, planName } = metadata;

            if (!planId) {
                // Missing planId in payment metadata - cannot activate subscription
                // TODO: Add proper logging service for monitoring
                return;
            }

            // Activate subscription
            await this.activateSubscriptionUseCase.execute({
                userId: payment.userId,
                planId: planId,
                paymentId: payment.id,
                billingInterval: metadata.billingInterval || BillingInterval.MONTHLY // Read from metadata
            });

            // Credit admin wallet
            await this.creditAdminWalletUseCase.execute({
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

        } catch (error) {
            // Error handling subscription payment
            // TODO: Add proper logging service and retry mechanism
        }
    }

    private async handlePaymentFailure(paymentIntent: StripePaymentIntent): Promise<void> {
        const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
        if (payment) {
            const errorMessage = (paymentIntent as StripePaymentIntent & { last_payment_error?: { message?: string } }).last_payment_error?.message || 'Payment failed';
            payment.markAsFailed(errorMessage);
            await this.paymentRepository.update(payment);
        }
    }

    private async handleRefund(charge: StripeCharge): Promise<void> {
        const paymentIntentId = (charge as StripeCharge & { payment_intent?: string }).payment_intent;
        if (paymentIntentId) {
            const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntentId);
            if (payment) {
                const refundedAmount = (charge as StripeCharge & { amount_refunded?: number }).amount_refunded || 0;
                payment.markAsRefunded(refundedAmount / 100);
                await this.paymentRepository.update(payment);
            }
        }
    }
}
