import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { WebhookEventDTO } from '../../dto/payment/WebhookEventDTO';
import { PaymentStatus, PaymentPurpose } from '../../../domain/enums/PaymentEnums';
import { IHandleWebhookUseCase } from './interfaces/IHandleWebhookUseCase';
import { IActivateSubscriptionUseCase } from '../subscription/interfaces/IActivateSubscriptionUseCase';
import { ICreditAdminWalletUseCase } from '../admin/interfaces/ICreditAdminWalletUseCase';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';

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

    private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
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

    private async handleSubscriptionPayment(payment: any): Promise<void> {
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
                billingInterval: metadata.billingInterval || BillingInterval.MONTHLY // Read from metadata
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

        } catch (error) {
            console.error('Error handling subscription payment:', error);
            // Log error but don't throw
        }
    }

    private async handlePaymentFailure(paymentIntent: any): Promise<void> {
        const payment = await this.paymentRepository.findByProviderPaymentId(paymentIntent.id);
        if (payment) {
            payment.markAsFailed(paymentIntent.last_payment_error?.message || 'Payment failed');
            await this.paymentRepository.update(payment);
        }
    }

    private async handleRefund(charge: any): Promise<void> {
        const payment = await this.paymentRepository.findByProviderPaymentId(charge.payment_intent);
        if (payment) {
            payment.markAsRefunded(charge.amount_refunded / 100);
            await this.paymentRepository.update(payment);
        }
    }
}
