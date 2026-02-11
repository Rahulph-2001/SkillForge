import { injectable, inject } from 'inversify';
import { Database } from '../Database';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { TYPES } from '../../di/types';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'user');
  }

  async findById(id: string): Promise<User | null> {
    const user = await super.findById(id);
    return user ? User.fromDatabaseRow(user as unknown as Record<string, unknown>) : null;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: ids }
      }
    });
    return users.map((u: any) => User.fromDatabaseRow(u as unknown as Record<string, unknown>));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.getOne({
      where: {
        email: email.toLowerCase(),
        isDeleted: false
      }
    } as any);
    if (!user) {
      return null;
    }
    return User.fromDatabaseRow(user as unknown as Record<string, unknown>);
  }

  private mapUserDataToPrisma(user: User): Record<string, unknown> {
    const userData = user.toJSON();
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password_hash || userData.passwordHash, // Prisma uses camelCase
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      role: userData.role,
      credits: userData.credits,
      earnedCredits: userData.earned_credits,
      bonusCredits: userData.bonus_credits,
      purchasedCredits: userData.purchased_credits,
      walletBalance: userData.wallet_balance,
      skillsOffered: userData.skills_offered,
      skillsLearning: userData.skills_learning,
      rating: userData.rating,
      reviewCount: userData.review_count,
      totalSessionsCompleted: userData.total_sessions_completed,
      memberSince: userData.member_since,
      verification: userData.verification,
      antiFraud: userData.anti_fraud,
      adminPermissions: userData.admin_permissions,
      settings: userData.settings,
      subscriptionPlan: userData.subscription_plan,
      subscriptionValidUntil: userData.subscription_valid_until,
      subscriptionAutoRenew: userData.subscription_auto_renew,
      subscriptionStartedAt: userData.subscription_started_at,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
      lastLogin: userData.last_login,
      lastActive: userData.last_active,
      isActive: userData.is_active,
      isDeleted: userData.is_deleted
    };
  }

  async save(user: User): Promise<User> {
    const data = this.mapUserDataToPrisma(user);
    const savedUser = await this.create(data as any);
    return User.fromDatabaseRow(savedUser as unknown as Record<string, unknown>);
  }

  async update(user: User): Promise<User> {
    const data = this.mapUserDataToPrisma(user);
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) => key !== 'id' && key !== 'created_at')
    );
    // Directly use Prisma client to avoid signature conflict with base class
    const modelClient = (this.prisma as any)[this.model];
    const updatedUser = await modelClient.update({
      where: { id: user.id },
      data: updateData
    });
    return User.fromDatabaseRow(updatedUser as unknown as Record<string, unknown>);
  }

 async findWithPagination(
  filters: { search?: string; role?: 'user' | 'admin'; isActive?: boolean },
  pagination: { skip: number; take: number }
): Promise<{ users: User[]; total: number }> {
  const where: any = { isDeleted: false };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  if (filters.role) {
    where.role = filters.role;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.user.count({ where }),
  ]);

  return {
    users: users.map((u: any) => User.fromDatabaseRow(u as unknown as Record<string, unknown>)),
    total,
  };
}

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }
}