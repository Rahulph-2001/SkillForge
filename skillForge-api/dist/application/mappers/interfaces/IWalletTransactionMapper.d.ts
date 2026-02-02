import { WalletTransaction } from '../../../domain/entities/WalletTransaction';
import { WalletTransactionDTO } from '../../dto/admin/GetWalletTransactionsDTO';
export interface IWalletTransactionMapper {
    toDTO(transaction: WalletTransaction, userName?: string, userEmail?: string): WalletTransactionDTO;
    toDTOList(transactions: WalletTransaction[], userMap: Map<string, {
        name: string;
        email: string;
    }>): WalletTransactionDTO[];
}
//# sourceMappingURL=IWalletTransactionMapper.d.ts.map