
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IPaymentGateway } from '../../../domain/services/IPaymentGateway';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { PaymentResponseDTO } from '../../dto/payment/PaymentResponseDTO';
import { ConfirmPaymentDTO } from '../../dto/payment/ConfirmPaymentDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

export interface IConfirmPaymentUseCase {
    execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO>;
}

import { IAssignSubscriptionUseCase } from '../../useCases/subscription/AssignSubscriptionUseCase';
import { PaymentPurpose } from '../../../domain/enums/PaymentEnums';
import { AssignSubscriptionDTO } from '../../dto/subscription/AssignSubscriptionDTO';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';

@injectable()
export class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
    constructor(
        @inject(TYPES.IPaymentGateway) private paymentGateway: IPaymentGateway,
        @inject(TYPES.IPaymentRepository) private paymentRepository: IPaymentRepository,
        @inject(TYPES.IAssignSubscriptionUseCase) private assignSubscriptionUseCase: IAssignSubscriptionUseCase
    ) { }

    async execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO> {
        // Retrieve intent from Stripe to get metadata
        const paymentIntent = await this.paymentGateway.retrievePaymentIntent(dto.paymentIntentId);

        const payment = await this.paymentRepository.findByProviderPaymentId(dto.paymentIntentId);
        if (!payment) {
            throw new NotFoundError('Payment not found');
        }

        const confirmed = await this.paymentGateway.confirmPayment(dto.paymentIntentId);

        if (confirmed) {
            payment.markAsSucceeded(dto.paymentIntentId);
            const updatedPayment = await this.paymentRepository.update(payment);

            // Check if this was for a subscription
            if (updatedPayment.purpose === PaymentPurpose.SUBSCRIPTION) {
                try {
                    // Extract metadata from payment intent (Stripe)
                    const metadata = paymentIntent.metadata || {};
                    const planId = metadata.planId;
                    const billingInterval = metadata.billingInterval as BillingInterval;

                    if (planId && billingInterval) {
                        const assignDto: AssignSubscriptionDTO = {
                            userId: updatedPayment.userId,
                            planId: planId,
                            billingInterval: billingInterval,
                            startTrial: false, // Explicitly set false as payment was made
                            stripeCustomerId: paymentIntent.customer as string
                        };

                        await this.assignSubscriptionUseCase.execute(assignDto);
                        console.log(`[ConfirmPaymentUseCase] Automatically assigned subscription for user ${updatedPayment.userId}`);
                    } else {
                        console.error('[ConfirmPaymentUseCase] Missing planId or billingInterval in payment metadata');
                    }
                } catch (error) {
                    console.error('[ConfirmPaymentUseCase] Failed to assign subscription after payment:', error);
                    // We don't throw here to avoid failing the payment confirmation response, 
                    // but in production we should alert or retry.
                }
            }

            return updatedPayment.toJSON() as PaymentResponseDTO;
        }

        throw new Error('Payment confirmation failed');
    }
}