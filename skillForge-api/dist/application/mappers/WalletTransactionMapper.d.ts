import { WalletTransaction } from '../../domain/entities/WalletTransaction';
import { WalletTransactionDTO } from '../dto/admin/GetWalletTransactionsDTO';
export declare class WalletTransactionMapper {
    static toDTO(transaction: WalletTransaction, userName?: string, userEmail?: string): WalletTransactionDTO;
    static toDTOList(transactions: WalletTransaction[], userMap: Map<string, {
        name: string;
        email: string;
    }>): WalletTransactionDTO[];
}
//# sourceMappingURL=WalletTransactionMapper.d.ts.map