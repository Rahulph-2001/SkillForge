import { IPaymentGateway } from '../../../domain/services/IPaymentGateway';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { CreatePaymentIntentDTO } from '../../dto/payment/CreatePaymentIntentDTO';
import { CreatePaymentIntentResponseDTO } from '../../dto/payment/CreatePaymentIntentResponseDTO';
export interface ICreatePaymentIntentUseCase {
    execute(userId: string, dto: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponseDTO>;
}
export declare class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
    private paymentGateway;
    private paymentRepository;
    constructor(paymentGateway: IPaymentGateway, paymentRepository: IPaymentRepository);
    execute(userId: string, dto: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponseDTO>;
}
//# sourceMappingURL=CreatePaymentIntentUseCase.d.ts.map