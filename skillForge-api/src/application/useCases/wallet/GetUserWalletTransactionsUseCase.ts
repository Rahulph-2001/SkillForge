import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IGetUserWalletTransactionsUseCase } from './interfaces/IGetUserWalletTransactionsUseCase';
import { GetUserWalletTransactionsRequestDTO, GetUserWalletTransactionsResponseDTO, UserWalletTransactionDTO } from '../../dto/wallet/UserWalletTransactionDTO';

@injectable()
export class GetUserWalletTransactionsUseCase implements IGetUserWalletTransactionsUseCase {
    constructor(
        @inject(TYPES.IUserWalletTransactionRepository) private readonly transactionRepository: IUserWalletTransactionRepository
    ) { }

    async execute(userId: string, filters: GetUserWalletTransactionsRequestDTO): Promise<GetUserWalletTransactionsResponseDTO> {
        const result = await this.transactionRepository.findByUserId(userId, {
            type: filters.type,
            status: filters.status,
            page: filters.page,
            limit: filters.limit,
        });

        const transactions: UserWalletTransactionDTO[] = result.transactions.map(t => ({
            id: t.id,
            userId: t.userId,
            type: t.type,
            amount: t.amount,
            currency: t.currency,
            source: t.source,
            referenceId: t.referenceId,
            description: t.description,
            metadata: t.metadata,
            previousBalance: t.previousBalance,
            newBalance: t.newBalance,
            status: t.status,
            createdAt: t.createdAt.toISOString(),
        }));

        return {
            transactions,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        };
    }
}
