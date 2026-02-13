import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IGetAdminCreditStatsUseCase, AdminCreditStats } from './interfaces/IGetAdminCreditStatsUseCase';
export declare class GetAdminCreditStatsUseCase implements IGetAdminCreditStatsUseCase {
    private readonly transactionRepository;
    constructor(transactionRepository: IUserWalletTransactionRepository);
    execute(): Promise<AdminCreditStats>;
}
//# sourceMappingURL=GetAdminCreditStatsUseCase.d.ts.map