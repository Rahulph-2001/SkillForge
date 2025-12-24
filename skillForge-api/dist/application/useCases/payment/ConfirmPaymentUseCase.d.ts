import { IPaymentGateway } from '../../../domain/services/IPaymentGateway';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { PaymentResponseDTO } from '../../dto/payment/PaymentResponseDTO';
import { ConfirmPaymentDTO } from '../../dto/payment/ConfirmPaymentDTO';
export interface IConfirmPaymentUseCase {
    execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO>;
}
import { IAssignSubscriptionUseCase } from '../../useCases/subscription/AssignSubscriptionUseCase';
export declare class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
    private paymentGateway;
    private paymentRepository;
    private assignSubscriptionUseCase;
    constructor(paymentGateway: IPaymentGateway, paymentRepository: IPaymentRepository, assignSubscriptionUseCase: IAssignSubscriptionUseCase);
    execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO>;
}
//# sourceMappingURL=ConfirmPaymentUseCase.d.ts.map