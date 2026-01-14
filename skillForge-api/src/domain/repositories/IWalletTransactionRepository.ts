import { WalletTransaction } from '../entities/WalletTransaction';

export interface IWalletTransactionRepository {
  create(transaction: WalletTransaction): Promise<WalletTransaction>;
  findById(id: string): Promise<WalletTransaction | null>;
  findByAdminId(adminId: string, page: number, limit: number): Promise<{
    transactions: WalletTransaction[];
    total: number;
  }>;
  findByAdminIdWithFilters(
    adminId: string,
    page: number,
    limit: number,
    filters?: {
      type?: 'CREDIT' | 'WITHDRAWAL';
      source?: string;
      status?: 'COMPLETED' | 'PENDING' | 'FAILED';
      search?: string;
    }
  ): Promise<{
    transactions: WalletTransaction[];
    total: number;
  }>;
}