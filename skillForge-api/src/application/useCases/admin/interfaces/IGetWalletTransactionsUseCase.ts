import { GetWalletTransactionsResponseDTO } from "../../../dto/admin/GetWalletTransactionsDTO";

export interface IGetWalletTransactionsUseCase {
    execute(
        page: number,
        limit: number,
        search?: string,
        type?: 'CREDIT' | 'WITHDRAWAL',
        status?: 'COMPLETED' | 'PENDING' | 'FAILED'
    ): Promise<GetWalletTransactionsResponseDTO>
}