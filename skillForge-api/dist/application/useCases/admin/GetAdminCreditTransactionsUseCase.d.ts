import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetAdminCreditTransactionsUseCase } from './interfaces/IGetAdminCreditTransactionsUseCase';
export declare class GetAdminCreditTransactionsUseCase implements IGetAdminCreditTransactionsUseCase {
    private readonly userWalletTransactionRepository;
    private readonly userRepository;
    constructor(userWalletTransactionRepository: IUserWalletTransactionRepository, userRepository: IUserRepository);
    execute(page: number, limit: number, search?: string): Promise<any>;
}
//# sourceMappingURL=GetAdminCreditTransactionsUseCase.d.ts.map