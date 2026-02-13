import { Database } from '../Database';
import { IUserWalletTransactionRepository, UserWalletTransactionFilters, PaginatedTransactions } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
export declare class UserWalletTransactionRepository implements IUserWalletTransactionRepository {
    private readonly prisma;
    constructor(db: Database);
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
    getTotalByType(type: UserWalletTransactionType): Promise<number>;
    countByType(type: UserWalletTransactionType): Promise<number>;
    getTotalByTypeAndDateRange(type: UserWalletTransactionType, startDate: Date, endDate: Date): Promise<number>;
    countByTypeAndDateRange(type: UserWalletTransactionType, startDate: Date, endDate: Date): Promise<number>;
    getTotalByTypeAndStatus(type: UserWalletTransactionType, status: UserWalletTransactionStatus): Promise<number>;
    countByTypeAndStatus(type: UserWalletTransactionType, status: UserWalletTransactionStatus): Promise<number>;
    getTotalCreditsPurchased(): Promise<number>;
    findAll(filters?: {
        page?: number;
        limit?: number;
        type?: UserWalletTransactionType;
        status?: UserWalletTransactionStatus;
        search?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<PaginatedTransactions>;
}
//# sourceMappingURL=UserWalletTransactionRepository.d.ts.map