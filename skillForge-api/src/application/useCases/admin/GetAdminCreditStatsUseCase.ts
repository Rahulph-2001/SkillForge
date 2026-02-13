import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';

import { IGetAdminCreditStatsUseCase, AdminCreditStats } from './interfaces/IGetAdminCreditStatsUseCase';

@injectable()
export class GetAdminCreditStatsUseCase implements IGetAdminCreditStatsUseCase {
    constructor(
        @inject(TYPES.IUserWalletTransactionRepository) private readonly transactionRepository: IUserWalletTransactionRepository
    ) { }

    async execute(): Promise<AdminCreditStats> {
        const [totalRevenue, totalTransactions, creditsSold] = await Promise.all([
            this.transactionRepository.getTotalByTypeAndStatus(
                UserWalletTransactionType.CREDIT_PURCHASE,
                UserWalletTransactionStatus.COMPLETED
            ),
            this.transactionRepository.countByTypeAndStatus(
                UserWalletTransactionType.CREDIT_PURCHASE,
                UserWalletTransactionStatus.COMPLETED
            ),
            this.transactionRepository.getTotalCreditsPurchased()
        ]);

        const absRevenue = Math.abs(totalRevenue);
        const avgOrderValue = totalTransactions > 0 ? absRevenue / totalTransactions : 0;

        return {
            totalRevenue: absRevenue,
            creditsSold,
            avgOrderValue,
            totalTransactions
        };
    }
}
