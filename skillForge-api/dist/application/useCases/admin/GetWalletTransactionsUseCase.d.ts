import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { IGetWalletTransactionsUseCase } from './interfaces/IGetWalletTransactionsUseCase';
import { GetWalletTransactionsResponseDTO } from '../../dto/admin/GetWalletTransactionsDTO';
import { IWalletTransactionMapper } from '../../mappers/interfaces/IWalletTransactionMapper';
export declare class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase {
    private readonly userRepository;
    private readonly walletTransactionRepository;
    private readonly walletTransactionMapper;
    constructor(userRepository: IUserRepository, walletTransactionRepository: IWalletTransactionRepository, walletTransactionMapper: IWalletTransactionMapper);
    execute(page: number, limit: number, search?: string, type?: 'CREDIT' | 'WITHDRAWAL', status?: 'COMPLETED' | 'PENDING' | 'FAILED'): Promise<GetWalletTransactionsResponseDTO>;
}
//# sourceMappingURL=GetWalletTransactionsUseCase.d.ts.map