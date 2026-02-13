import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserWalletTransactionRepository, UserWalletTransactionFilters } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserWalletTransactionType } from '../../../domain/entities/UserWalletTransaction';
import { IGetAdminCreditTransactionsUseCase } from './interfaces/IGetAdminCreditTransactionsUseCase';

@injectable()
export class GetAdminCreditTransactionsUseCase implements IGetAdminCreditTransactionsUseCase {
    constructor(
        @inject(TYPES.IUserWalletTransactionRepository) private readonly userWalletTransactionRepository: IUserWalletTransactionRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
    ) { }

    async execute(page: number, limit: number, search?: string): Promise<any> {
        // Fetch all CREDIT_PURCHASE transactions
        const result = await this.userWalletTransactionRepository.findAll({
            page,
            limit,
            type: UserWalletTransactionType.CREDIT_PURCHASE,
            search
        });

        // Fetch user details for these transactions
        // Optimization: Collect unique user IDs and fetch them in one go
        const userIds = [...new Set(result.transactions.map(t => t.userId))];
        const users = await Promise.all(userIds.map(id => this.userRepository.findById(id)));
        const userMap = new Map(users.filter(u => u !== null).map(u => [u!.id, u!]));

        // Map to DTO
        const transactionsWithUser = result.transactions.map(t => {
            const user = userMap.get(t.userId);
            return {
                id: t.id,
                amount: t.amount,
                currency: t.currency,
                type: t.type,
                status: t.status,
                referenceId: t.referenceId,
                metadata: t.metadata,
                createdAt: t.createdAt,
                user: user ? {
                    id: user.id,
                    name: user.name,
                    email: user.email.value,
                    avatar: user.avatarUrl
                } : null
            };
        });

        return {
            transactions: transactionsWithUser,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
}
