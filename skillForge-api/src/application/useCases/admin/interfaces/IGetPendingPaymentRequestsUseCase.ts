import { PendingPaymentRequestDTO } from '../../../dto/admin/PendingPaymentRequestDTO';

export interface IGetPendingPaymentRequestsUseCase {
    execute(): Promise<PendingPaymentRequestDTO[]>;
}
