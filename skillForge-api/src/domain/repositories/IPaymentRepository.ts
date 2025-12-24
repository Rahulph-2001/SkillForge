import { Payment } from '../entities/Payment';
import { PaymentStatus, PaymentPurpose } from '../enums/PaymentEnums';

export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;
    findByUserId(userId: string, page: number, limit: number): Promise<{ payments: Payment[]; total: number }>;
    findByUserIdAndPurpose(userId: string, purpose: PaymentPurpose): Promise<Payment[]>;
    update(payment: Payment): Promise<Payment>;
    updateStatus(id: string, status: PaymentStatus): Promise<void>;
}