import { Database } from '../Database';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { BaseRepository } from '../BaseRepository';
export declare class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(db: Database);
    findById(id: string): Promise<User | null>;
    findByIds(ids: string[]): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    private mapUserDataToPrisma;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=UserRepository.d.ts.map