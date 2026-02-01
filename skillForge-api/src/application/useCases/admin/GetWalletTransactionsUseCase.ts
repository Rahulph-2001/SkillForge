import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { IGetWalletTransactionsUseCase } from './interfaces/IGetWalletTransactionsUseCase';
import { GetWalletTransactionsResponseDTO } from '../../dto/admin/GetWalletTransactionsDTO';
import { IWalletTransactionMapper } from '../../mappers/interfaces/IWalletTransactionMapper';
import { UserRole } from '../../../domain/enums/UserRole';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IWalletTransactionRepository) private readonly walletTransactionRepository: IWalletTransactionRepository,
        @inject(TYPES.IWalletTransactionMapper) private readonly walletTransactionMapper: IWalletTransactionMapper
    ) { }

    async execute(
        page: number,
        limit: number,
        search?: string,
        type?: 'CREDIT' | 'WITHDRAWAL',
        status?: 'COMPLETED' | 'PENDING' | 'FAILED'
    ): Promise<GetWalletTransactionsResponseDTO> {
        const users = await this.userRepository.findAll();
        const adminUser = users.find(user => user.role === UserRole.ADMIN);

        if (!adminUser) {
            throw new NotFoundError('No admin user found in the system');
        }

        const result = await this.walletTransactionRepository.findByAdminIdWithFilters(
            adminUser.id,
            page,
            limit,
            { type, status, search }
        );

        // Create user map for efficient lookup
        const userMap = new Map(
            users.map(u => [u.id, { name: u.name, email: u.email?.value || '' }])
        );

        // Use mapper to convert entities to DTOs
        const transactions = this.walletTransactionMapper.toDTOList(result.transactions, userMap);

        const totalPages = Math.ceil(result.total / limit);

        return {
            transactions,
            total: result.total,
            page,
            limit,
            totalPages,
        };
    }
}