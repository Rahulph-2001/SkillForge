import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../entities/UserWalletTransaction';
export interface UserWalletTransactionFilters {
    type?: UserWalletTransactionType;
    status?: UserWalletTransactionStatus;
    page?: number;
    limit?: number;
}
export interface PaginatedTransactions {
    transactions: UserWalletTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IUserWalletTransactionRepository {
    create(transaction: UserWalletTransaction): Promise<UserWalletTransaction>;
    findById(id: string): Promise<UserWalletTransaction | null>;
    findByUserId(userId: string, filters?: UserWalletTransactionFilters): Promise<PaginatedTransactions>;
    update(transaction: UserWalletTransaction): Promise<UserWalletTransaction>;
    findCreditTransactions(userId: string, filters: {
        type?: string;
        page: number;
        limit: number;
    }): Promise<{
        transactions: UserWalletTransaction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCreditStats(userId: string): Promise<{
        totalEarned: number;
        totalSpent: number;
        totalPurchased: number;
    }>;
}
//# sourceMappingURL=IUserWalletTransactionRepository.d.ts.map