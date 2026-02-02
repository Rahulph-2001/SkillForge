import { GetUserWalletTransactionsRequestDTO, GetUserWalletTransactionsResponseDTO } from '../../../dto/wallet/UserWalletTransactionDTO';
export interface IGetUserWalletTransactionsUseCase {
    execute(userId: string, filters: GetUserWalletTransactionsRequestDTO): Promise<GetUserWalletTransactionsResponseDTO>;
}
//# sourceMappingURL=IGetUserWalletTransactionsUseCase.d.ts.map