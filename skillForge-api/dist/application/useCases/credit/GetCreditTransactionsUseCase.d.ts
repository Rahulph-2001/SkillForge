import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IGetCreditTransactionsUseCase } from './interfaaces/IGetCreditTransactionsUseCase';
import { GetCreditTransactionsRequestDTO, GetCreditTransactionsResponseDTO } from '../../dto/credit/GetCreditTransactionsDTO';
export declare class GetCreditTransactionsUseCase implements IGetCreditTransactionsUseCase {
    private readonly transactionRepository;
    constructor(transactionRepository: IUserWalletTransactionRepository);
    execute(request: GetCreditTransactionsRequestDTO): Promise<GetCreditTransactionsResponseDTO>;
}
//# sourceMappingURL=GetCreditTransactionsUseCase.d.ts.map