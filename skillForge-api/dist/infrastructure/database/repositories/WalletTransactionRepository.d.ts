import { Database } from '../Database';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { WalletTransaction } from '../../../domain/entities/WalletTransaction';
export declare class WalletTransactionRepository implements IWalletTransactionRepository {
    private readonly db;
    constructor(db: Database);
    create(transaction: WalletTransaction): Promise<WalletTransaction>;
    findById(id: string): Promise<WalletTransaction | null>;
    findByAdminId(adminId: string, page: number, limit: number): Promise<{
        transactions: WalletTransaction[];
        total: number;
    }>;
    findByAdminIdWithFilters(adminId: string, page: number, limit: number, filters?: {
        type?: 'CREDIT' | 'WITHDRAWAL';
        source?: string;
        status?: 'COMPLETED' | 'PENDING' | 'FAILED';
        search?: string;
    }): Promise<{
        transactions: WalletTransaction[];
        total: number;
    }>;
}
//# sourceMappingURL=WalletTransactionRepository.d.ts.map