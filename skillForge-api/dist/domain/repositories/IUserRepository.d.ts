import { User } from '../entities/User';
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByIds(ids: string[]): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=IUserRepository.d.ts.map