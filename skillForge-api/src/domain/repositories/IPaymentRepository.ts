import { Payment } from '../entities/Payment';
import { PaymentStatus, PaymentPurpose } from '../enums/PaymentEnums';
import { IPaginationParams, IPaginationResult } from '../types/IPaginationParams';

export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;
    findByUserId(userId: string, page: number, limit: number): Promise<{ payments: Payment[]; total: number }>;
    findByUserIdAndPurpose(userId: string, purpose: PaymentPurpose): Promise<Payment[]>;
    update(payment: Payment): Promise<Payment>;
    updateStatus(id: string, status: PaymentStatus): Promise<void>;
    findWithPagination(
        paginationParams: IPaginationParams,
        filters?: {
            userId?: string;
            purpose?: PaymentPurpose;
            status?: PaymentStatus;
            search?: string;
        }
    ): Promise<IPaginationResult<Payment>>;
    // Add to existing interface
    getTotalRevenue(): Promise<number>;
    getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number>;
    getRevenueByPurpose(purpose: PaymentPurpose): Promise<number>;
}