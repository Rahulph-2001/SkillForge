import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { CreditAdminWalletRequestDTO } from '../../dto/admin/CreditAdminWalletDTO';
import { WalletCreditResponseDTO } from '../../dto/admin/WalletCreditResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { UserRole } from '../../../domain/enums/UserRole';

export interface ICreditAdminWalletUseCase {
    execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO>;
}

@injectable()
export class CreditAdminWalletUseCase implements ICreditAdminWalletUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) { }

    async execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO> {
        // Find the first admin user
        // Note: In a production system, you might have a dedicated admin ID or wallet service
        const adminUser = await this.findAdminUser();
        if (!adminUser) {
            throw new NotFoundError('No admin user found in the system');
        }

        // Get current balance before crediting
        const previousBalance = adminUser.toJSON().wallet_balance as number;

        // Credit the admin wallet
        adminUser.creditWallet(dto.amount);

        // Save updated admin
        await this.userRepository.update(adminUser);

        // Return response
        return {
            adminId: adminUser.id,
            previousBalance,
            creditedAmount: dto.amount,
            newBalance: previousBalance + dto.amount,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            timestamp: new Date()
        };
    }

    /**
     * Find the first admin user in the system
     * TODO: In future, implement a dedicated admin wallet system
     */
    private async findAdminUser() {
        // This is a simple implementation
        // In production, you might want to have a dedicated admin wallet or use a specific admin ID
        const users = await this.userRepository.findAll();
        return users.find(user => user.role === UserRole.ADMIN) || null;
    }
}
