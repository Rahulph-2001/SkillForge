import { WalletTransaction } from '../../domain/entities/WalletTransaction';
import { WalletTransactionDTO } from '../dto/admin/GetWalletTransactionsDTO';

export class WalletTransactionMapper {
  static toDTO(
    transaction: WalletTransaction,
    userName?: string,
    userEmail?: string
  ): WalletTransactionDTO {
    const data = transaction.toJSON();

    return {
      id: data.id,
      transactionId: `wt-${data.id.substring(0, 8)}`,
      userId: data.metadata?.userId || data.adminId,
      userName: userName || 'System',
      userEmail: userEmail || 'system@skillforge.com',
      type: data.type,
      amount: data.amount,
      description: data.description || `${data.source} transaction`,
      date: data.createdAt,
      status: data.status,
      metadata: data.metadata,
    };
  }

  static toDTOList(
    transactions: WalletTransaction[],
    userMap: Map<string, { name: string; email: string }>
  ): WalletTransactionDTO[] {
    return transactions.map(transaction => {
      const data = transaction.toJSON();
      const userId = data.metadata?.userId;
      const user = userId ? userMap.get(userId) : undefined;

      return this.toDTO(transaction, user?.name, user?.email);
    });
  }
}
