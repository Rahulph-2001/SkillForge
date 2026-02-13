import { Database } from '../Database';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { BaseRepository } from '../BaseRepository';
export declare class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(db: Database);
    findById(id: string): Promise<User | null>;
    findByIds(ids: string[]): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findAllAdmins(): Promise<User[]>;
    private mapUserDataToPrisma;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    findWithPagination(filters: {
        search?: string;
        role?: 'user' | 'admin';
        isActive?: boolean;
    }, pagination: {
        skip: number;
        take: number;
    }): Promise<{
        users: User[];
        total: number;
    }>;
    delete(id: string): Promise<void>;
    addPurchasedCredits(userId: string, credits: number): Promise<User>;
    countTotal(): Promise<number>;
    countActive(): Promise<number>;
    countByDateRange(startDate: Date, endDate: Date): Promise<number>;
    findRecent(limit: number): Promise<User[]>;
    getTotalWalletBalance(): Promise<number>;
    countUsersWithBalance(): Promise<number>;
}
//# sourceMappingURL=UserRepository.d.ts.map