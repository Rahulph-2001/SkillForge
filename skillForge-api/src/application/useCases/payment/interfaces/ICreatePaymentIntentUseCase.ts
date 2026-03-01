import { type CreatePaymentIntentDTO } from '../../../dto/payment/CreatePaymentIntentDTO';
import { type CreatePaymentIntentResponseDTO } from '../../../dto/payment/CreatePaymentIntentResponseDTO';

export interface ICreatePaymentIntentUseCase {
    execute(userId: string, dto: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponseDTO>;
}

