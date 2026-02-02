import { GetUserWalletTransactionsRequestDTO, GetUserWalletTransactionsResponseDTO } from '../../../dto/wallet/UserWalletTransactionDTO';

export interface IGetUserWalletTransactionsUseCase {
    execute(userId: string, filters: GetUserWalletTransactionsRequestDTO): Promise<GetUserWalletTransactionsResponseDTO>;
}
