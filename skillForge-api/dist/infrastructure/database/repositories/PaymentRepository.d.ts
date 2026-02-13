import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { Payment } from '../../../domain/entities/Payment';
import { PaymentStatus, PaymentPurpose } from '../../../domain/enums/PaymentEnums';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IPaginationParams, IPaginationResult } from '../../../domain/types/IPaginationParams';
export declare class PrismaPaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
    constructor(db: Database);
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
    findWithPagination(paginationParams: IPaginationParams, filters?: {
        userId?: string;
        purpose?: PaymentPurpose;
        status?: PaymentStatus;
        search?: string;
    }): Promise<IPaginationResult<Payment>>;
    getTotalRevenue(): Promise<number>;
    getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number>;
    getRevenueByPurpose(purpose: PaymentPurpose): Promise<number>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map