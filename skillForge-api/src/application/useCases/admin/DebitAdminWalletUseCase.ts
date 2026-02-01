import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { WalletTransaction } from '../../../domain/entities/WalletTransaction';
import { DebitAdminWalletRequestDTO } from '../../dto/admin/DebitAdminWalletDTO';
import { WalletDebitResponseDTO } from '../../dto/admin/WalletDebitResponseDTO';
import { NotFoundError, InternalServerError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class DebitAdminWalletUseCase implements IDebitAdminWalletUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(TYPES.IWalletTransactionRepository) private walletTransactionRepository: IWalletTransactionRepository
    ) { }

    async execute(dto: DebitAdminWalletRequestDTO): Promise<WalletDebitResponseDTO> {
        const adminUser = await this.findAdminUser();
        if (!adminUser) {
            throw new NotFoundError('No admin user found in the system');
        }

        const previousBalance = adminUser.toJSON().wallet_balance as number;

        try {
            adminUser.debitWallet(dto.amount);
        } catch (error: any) {
            throw new InternalServerError(`Insufficient funds in admin wallet: ${error.message}`);
        }

        await this.userRepository.update(adminUser);

        const newBalance = previousBalance - dto.amount;

        // Record transaction
        const transaction = WalletTransaction.create({
            id: uuidv4(),
            adminId: adminUser.id,
            type: 'DEBIT',
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

        console.log(`[DebitAdminWallet] Recorded transaction: ${dto.source} - -₹${dto.amount}`);

        return {
            adminId: adminUser.id,
            previousBalance,
            debitedAmount: dto.amount,
            newBalance,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            timestamp: new Date()
        };
    }

    private generateDescription(dto: DebitAdminWalletRequestDTO): string {
        if (dto.source === 'PROJECT_RELEASE') {
            const projectTitle = dto.metadata?.projectTitle || 'Project';
            return `Project payment release: ${projectTitle}`;
        } else if (dto.source === 'PROJECT_REFUND') {
            const projectTitle = dto.metadata?.projectTitle || 'Project';
            return `Project refund: ${projectTitle}`;
        }
        return `Wallet debit: ${dto.source}`;
    }

    private async findAdminUser() {
        const users = await this.userRepository.findAll();
        return users.find(user => user.role === UserRole.ADMIN) || null;
    }
}
