import { WalletTransaction } from '../../domain/entities/WalletTransaction';
import { WalletTransactionDTO } from '../dto/admin/GetWalletTransactionsDTO';
import { IWalletTransactionMapper } from './interfaces/IWalletTransactionMapper';
export declare class WalletTransactionMapper implements IWalletTransactionMapper {
    toDTO(transaction: WalletTransaction, userName?: string, userEmail?: string): WalletTransactionDTO;
    toDTOList(transactions: WalletTransaction[], userMap: Map<string, {
        name: string;
        email: string;
    }>): WalletTransactionDTO[];
}
//# sourceMappingURL=WalletTransactionMapper.d.ts.map