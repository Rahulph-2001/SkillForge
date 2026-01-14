import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { WalletTransaction } from '../../../domain/entities/WalletTransaction';
import { CreditAdminWalletRequestDTO } from '../../dto/admin/CreditAdminWalletDTO';
import { WalletCreditResponseDTO } from '../../dto/admin/WalletCreditResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { ICreditAdminWalletUseCase } from './interfaces/ICreditAdminWalletUseCase';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreditAdminWalletUseCase implements ICreditAdminWalletUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(TYPES.IWalletTransactionRepository) private walletTransactionRepository: IWalletTransactionRepository
    ) { }

    async execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO> {
        const adminUser = await this.findAdminUser();
        if (!adminUser) {
            throw new NotFoundError('No admin user found in the system');
        }

        const previousBalance = adminUser.toJSON().wallet_balance as number;

        adminUser.creditWallet(dto.amount);

        await this.userRepository.update(adminUser);

        const newBalance = previousBalance + dto.amount;

        // Record transaction
        const transaction = WalletTransaction.create({
            id: uuidv4(),
            adminId: adminUser.id,
            type: 'CREDIT',
            amount: dto.amount,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            description: this.generateDescription(dto),
            metadata: dto.metadata,
            previousBalance,
            newBalance,
            status: 'COMPLETED',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.walletTransactionRepository.create(transaction);

        console.log(`[CreditAdminWallet] Recorded transaction: ${dto.source} - ₹${dto.amount}`);

        return {
            adminId: adminUser.id,
            previousBalance,
            creditedAmount: dto.amount,
            newBalance,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            timestamp: new Date()
        };
    }

    private generateDescription(dto: CreditAdminWalletRequestDTO): string {
        if (dto.source === 'SUBSCRIPTION_PAYMENT') {
            const planName = dto.metadata?.planName || 'Subscription Plan';
            return `Subscription payment: ${planName}`;
        } else if (dto.source === 'PROJECT_ESCROW') {
            const projectTitle = dto.metadata?.projectTitle || 'Project';
            return `Project escrow: ${projectTitle}`;
        }
        return `Wallet credit: ${dto.source}`;
    }

    private async findAdminUser() {
        const users = await this.userRepository.findAll();
        return users.find(user => user.role === UserRole.ADMIN) || null;
    }
}