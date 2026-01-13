
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IPaymentGateway } from '../../../domain/services/IPaymentGateway';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { Payment } from '../../../domain/entities/Payment';
import { CreatePaymentIntentDTO } from '../../dto/payment/CreatePaymentIntentDTO';
import { CreatePaymentIntentResponseDTO } from '../../dto/payment/CreatePaymentIntentResponseDTO';
import { PaymentProvider, PaymentStatus } from '../../../domain/enums/PaymentEnums';
import { v4 as uuidv4 } from 'uuid';
import { ICreatePaymentIntentUseCase } from './interfaces/ICreatePaymentIntentUseCase';

@injectable()
export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
    constructor(
        @inject(TYPES.IPaymentGateway) private paymentGateway: IPaymentGateway,
        @inject(TYPES.IPaymentRepository) private paymentRepository: IPaymentRepository
    ) { }

    async execute(userId: string, dto: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponseDTO> {
        const payment = new Payment({
            id: uuidv4(),
            userId,
            provider: PaymentProvider.STRIPE,
            amount: dto.amount,
            currency: dto.currency,
            purpose: dto.purpose,
            status: PaymentStatus.PENDING,
            metadata: dto.metadata,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedPayment = await this.paymentRepository.create(payment);

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

        // CRITICAL FIX: Update the payment record with the Stripe payment intent ID
        // This is needed so ConfirmPaymentUseCase can find the payment later
        savedPayment.markAsSucceeded(paymentIntent.paymentIntentId);
        // Reset status back to PENDING since payment isn't actually succeeded yet
        const updatedPayment = await this.paymentRepository.update(savedPayment);

        // Manually set status back to PENDING after update (since markAsSucceeded sets it to SUCCEEDED)
        await this.paymentRepository.updateStatus(updatedPayment.id, PaymentStatus.PENDING);

        return {
            clientSecret: paymentIntent.clientSecret,
            paymentIntentId: paymentIntent.paymentIntentId,
            paymentId: savedPayment.id,
        };
    }
}