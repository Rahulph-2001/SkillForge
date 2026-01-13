import { ConfirmPaymentDTO } from '../../../dto/payment/ConfirmPaymentDTO';
import { PaymentResponseDTO } from '../../../dto/payment/PaymentResponseDTO';
export interface IConfirmPaymentUseCase {
    execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO>;
}
//# sourceMappingURL=IConfirmPaymentUseCase.d.ts.map