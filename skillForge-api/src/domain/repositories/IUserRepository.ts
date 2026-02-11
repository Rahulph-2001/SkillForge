import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>; // Added this method

  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findWithPagination(
    filters: { search?: string; role?: 'user' | 'admin'; isActive?: boolean },
    pagination: { skip: number; take: number }
  ): Promise<{ users: User[]; total: number }>;
  addPurchasedCredits(userId: string, credits: number): Promise<User>;
  delete(id: string): Promise<void>;
}