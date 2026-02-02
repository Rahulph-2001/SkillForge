import { Database } from '../Database';
import { IUserWalletTransactionRepository, UserWalletTransactionFilters, PaginatedTransactions } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransaction } from '../../../domain/entities/UserWalletTransaction';
export declare class UserWalletTransactionRepository implements IUserWalletTransactionRepository {
    private readonly prisma;
    constructor(db: Database);
    create(transaction: UserWalletTransaction): Promise<UserWalletTransaction>;
    findById(id: string): Promise<UserWalletTransaction | null>;
    findByUserId(userId: string, filters?: UserWalletTransactionFilters): Promise<PaginatedTransactions>;
    update(transaction: UserWalletTransaction): Promise<UserWalletTransaction>;
}
//# sourceMappingURL=UserWalletTransactionRepository.d.ts.map