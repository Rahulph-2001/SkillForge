import { PrismaClient } from '@prisma/client';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { Payment } from '../../../domain/entities/Payment';
import { PaymentStatus, PaymentPurpose } from '../../../domain/enums/PaymentEnums';
export declare class PrismaPaymentRepository implements IPaymentRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;
    findByUserId(userId: string, page: number, limit: number): Promise<{
        payments: Payment[];
        total: number;
    }>;
    findByUserIdAndPurpose(userId: string, purpose: PaymentPurpose): Promise<Payment[]>;
    update(payment: Payment): Promise<Payment>;
    updateStatus(id: string, status: PaymentStatus): Promise<void>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map