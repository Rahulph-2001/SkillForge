import { CreatePaymentIntentDTO } from '../../../dto/payment/CreatePaymentIntentDTO';
import { CreatePaymentIntentResponseDTO } from '../../../dto/payment/CreatePaymentIntentResponseDTO';
export interface ICreatePaymentIntentUseCase {
    execute(userId: string, dto: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponseDTO>;
}
//# sourceMappingURL=ICreatePaymentIntentUseCase.d.ts.map