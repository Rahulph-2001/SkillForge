import { IPaymentGateway } from '../../../domain/services/IPaymentGateway';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { PaymentResponseDTO } from '../../dto/payment/PaymentResponseDTO';
import { ConfirmPaymentDTO } from '../../dto/payment/ConfirmPaymentDTO';
import { IConfirmPaymentUseCase } from './interfaces/IConfirmPaymentUseCase';
import { IAssignSubscriptionUseCase } from '../subscription/interfaces/IAssignSubscriptionUseCase';
import { ICreateProjectUseCase } from '../project/interfaces/ICreateProjectUseCase';
import { ICreditAdminWalletUseCase } from '../admin/interfaces/ICreditAdminWalletUseCase';
export declare class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
    private paymentGateway;
    private paymentRepository;
    private assignSubscriptionUseCase;
    private createProjectUseCase;
    private creditAdminWalletUseCase;
    constructor(paymentGateway: IPaymentGateway, paymentRepository: IPaymentRepository, assignSubscriptionUseCase: IAssignSubscriptionUseCase, createProjectUseCase: ICreateProjectUseCase, creditAdminWalletUseCase: ICreditAdminWalletUseCase);
    execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO>;
}
//# sourceMappingURL=ConfirmPaymentUseCase.d.ts.map