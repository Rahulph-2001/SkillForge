import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IGetUserWalletTransactionsUseCase } from './interfaces/IGetUserWalletTransactionsUseCase';
import { GetUserWalletTransactionsRequestDTO, GetUserWalletTransactionsResponseDTO } from '../../dto/wallet/UserWalletTransactionDTO';
export declare class GetUserWalletTransactionsUseCase implements IGetUserWalletTransactionsUseCase {
    private readonly transactionRepository;
    constructor(transactionRepository: IUserWalletTransactionRepository);
    execute(userId: string, filters: GetUserWalletTransactionsRequestDTO): Promise<GetUserWalletTransactionsResponseDTO>;
}
//# sourceMappingURL=GetUserWalletTransactionsUseCase.d.ts.map