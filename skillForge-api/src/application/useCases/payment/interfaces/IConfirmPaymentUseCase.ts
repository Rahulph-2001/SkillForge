import { type ConfirmPaymentDTO } from '../../../dto/payment/ConfirmPaymentDTO';
import { type PaymentResponseDTO } from '../../../dto/payment/PaymentResponseDTO';

export interface IConfirmPaymentUseCase {
    execute(dto: ConfirmPaymentDTO): Promise<PaymentResponseDTO>;
}

