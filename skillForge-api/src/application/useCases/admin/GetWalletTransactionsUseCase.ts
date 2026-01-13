import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { PaymentPurpose, PaymentStatus } from '../../../domain/enums/PaymentEnums';
import { IGetWalletTransactionsUseCase } from './interfaces/IGetWalletTransactionsUseCase';
import { GetWalletTransactionsResponseDTO, WalletTransactionDTO } from '../../dto/admin/GetWalletTransactionsDTO';
import { UserRole } from '../../../domain/enums/UserRole';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
    constructor(
        @inject(TYPES.IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IPaginationService) private readonly paginationService: IPaginationService
    ) { }

    async execute(
        page: number,
        limit: number,
        search?: string,
        type?: 'CREDIT' | 'WITHDRAWAL',
        status?: 'COMPLETED' | 'PENDING' | 'FAILED'
    ): Promise<GetWalletTransactionsResponseDTO> {
        // Get all users for mapping payment userIds to user names
        const users = await this.userRepository.findAll();
        
        const paginationParams = this.paginationService.createParams(page, limit);

        // For admin wallet transactions, we need ALL subscription payments (not just admin user's payments)
        // These are payments made by regular users that credit the admin wallet
        // Default to SUCCEEDED status since only successful payments credit the wallet
        const paymentStatus = status ? this.mapStatusToPaymentStatus(status) : PaymentStatus.SUCCEEDED;

        // Build filter object - only include status if it's provided or defaulting to SUCCEEDED
        const filters: {
            purpose: PaymentPurpose;
            status?: PaymentStatus;
            search?: string;
        } = {
            purpose: PaymentPurpose.SUBSCRIPTION,
            status: paymentStatus,
        };
        
        if (search) {
            filters.search = search;
        }
        
        const result = await this.paymentRepository.findWithPagination(
            paginationParams,
            filters
        );

        
        let payments = result.data;
        if (type === 'WITHDRAWAL') {
            payments = []; 
        }

        
        const transactions: WalletTransactionDTO[] = await Promise.all(
            payments.map(async (payment) => {
                const paymentUser = users.find(u => u.id === payment.userId);
                const metadata = payment.metadata || {};
                const planName = metadata.planName || 'Subscription Plan';

                return {
                    id: payment.id,
                    transactionId: `wt-${payment.id.substring(0, 8)}`,
                    userId: payment.userId,
                    userName: paymentUser?.name || 'Unknown User',
                    userEmail: paymentUser?.email?.value || 'unknown@example.com',
                    type: 'CREDIT' as const,
                    amount: payment.amount,
                    description: `Subscription payment: ${planName}`,
                    date: payment.createdAt,
                    status: this.mapPaymentStatusToStatus(payment.status),
                    metadata: payment.metadata,
                };
            })
        );

        return {
            transactions,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }

    private mapStatusToPaymentStatus(status: 'COMPLETED' | 'PENDING' | 'FAILED'): PaymentStatus {
        const statusMap: Record<string, PaymentStatus> = {
            'COMPLETED': PaymentStatus.SUCCEEDED,
            'PENDING': PaymentStatus.PENDING,
            'FAILED': PaymentStatus.FAILED,
        };
        return statusMap[status];
    }

    private mapPaymentStatusToStatus(paymentStatus: PaymentStatus): 'COMPLETED' | 'PENDING' | 'FAILED' {
        const statusMap: Partial<Record<PaymentStatus, 'COMPLETED' | 'PENDING' | 'FAILED'>> = {
            [PaymentStatus.SUCCEEDED]: 'COMPLETED',
            [PaymentStatus.PENDING]: 'PENDING',
            [PaymentStatus.FAILED]: 'FAILED',
            [PaymentStatus.PROCESSING]: 'PENDING',
            [PaymentStatus.CANCELED]: 'FAILED',
            [PaymentStatus.REFUNDED]: 'COMPLETED',
        };
        return statusMap[paymentStatus] || 'PENDING';
    }
}