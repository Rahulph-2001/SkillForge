import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { IUserWalletTransactionRepository, UserWalletTransactionFilters, PaginatedTransactions } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';

@injectable()
export class UserWalletTransactionRepository implements IUserWalletTransactionRepository {
    private readonly prisma: PrismaClient;

    constructor(
        @inject(TYPES.Database) db: Database
    ) {
        this.prisma = db.getClient();
    }

    async create(transaction: UserWalletTransaction): Promise<UserWalletTransaction> {
        const data = transaction.toJSON();

        const created = await this.prisma.userWalletTransaction.create({
            data: {
                id: data.id,
                userId: data.userId,
                type: data.type as any,
                amount: data.amount,
                currency: data.currency,
                source: data.source,
                referenceId: data.referenceId,
                description: data.description,
                metadata: data.metadata as any,
                previousBalance: data.previousBalance,
                newBalance: data.newBalance,
                status: data.status as any,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });

        return UserWalletTransaction.fromDatabaseRow(created);
    }

    async findById(id: string): Promise<UserWalletTransaction | null> {
        const found = await this.prisma.userWalletTransaction.findUnique({
            where: { id },
        });

        if (!found) return null;
        return UserWalletTransaction.fromDatabaseRow(found);
    }

    async findByUserId(userId: string, filters?: UserWalletTransactionFilters): Promise<PaginatedTransactions> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = { userId };

        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.status) {
            where.status = filters.status;
        }

        const [transactions, total] = await Promise.all([
            this.prisma.userWalletTransaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.userWalletTransaction.count({ where }),
        ]);

        return {
            transactions: transactions.map(t => UserWalletTransaction.fromDatabaseRow(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(transaction: UserWalletTransaction): Promise<UserWalletTransaction> {
        const data = transaction.toJSON();

        const updated = await this.prisma.userWalletTransaction.update({
            where: { id: data.id },
            data: {
                status: data.status as any,
                updatedAt: new Date(),
            },
        });

        return UserWalletTransaction.fromDatabaseRow(updated);
    }

    async findCreditTransactions(userId: string, filters: {
        type?: string;
        page: number;
        limit: number;
    }): Promise<{
        transactions: UserWalletTransaction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const skip = (filters.page - 1) * filters.limit;
        const where: any = {
            userId,
            type: {
                in: filters.type
                    ? [filters.type]
                    : ['CREDIT_PURCHASE', 'SESSION_PAYMENT', 'SESSION_EARNING', 'PROJECT_EARNING']
            }
        };

        const [transactions, total] = await Promise.all([
            this.prisma.userWalletTransaction.findMany({
                where,
                skip,
                take: filters.limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.userWalletTransaction.count({ where }),
        ]);

        return {
            transactions: transactions.map(t => UserWalletTransaction.fromDatabaseRow(t)),
            total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(total / filters.limit),
        };
    }

    async getCreditStats(userId: string): Promise<{
        totalEarned: number;
        totalSpent: number;
        totalPurchased: number;
    }> {
        const [earned, spent, purchased] = await Promise.all([
            this.prisma.userWalletTransaction.aggregate({
                where: {
                    userId,
                    type: { in: ['SESSION_EARNING', 'PROJECT_EARNING'] as any },
                    status: 'COMPLETED',
                },
                _sum: { amount: true },
            }),
            this.prisma.userWalletTransaction.aggregate({
                where: {
                    userId,
                    type: 'SESSION_PAYMENT' as any,
                    status: 'COMPLETED',
                },
                _sum: { amount: true },
            }),
            this.prisma.userWalletTransaction.aggregate({
                where: {
                    userId,
                    type: 'CREDIT_PURCHASE' as any,
                    status: 'COMPLETED',
                },
                _sum: { amount: true },
            }),
        ]);

        return {
            totalEarned: Number(earned._sum?.amount || 0),
            totalSpent: Number(spent._sum?.amount || 0),
            totalPurchased: Number(purchased._sum?.amount || 0),
        };
    }

    async getTotalByType(type: UserWalletTransactionType): Promise<number> {
        const result = await this.prisma.userWalletTransaction.aggregate({
            where: { type: type as any },
            _sum: { amount: true }
        });

        return Number(result._sum.amount ?? 0) || 0;
    }

    async countByType(type: UserWalletTransactionType): Promise<number> {
        return await this.prisma.userWalletTransaction.count({
            where: { type: type as any }
        });
    }

    async getTotalByTypeAndDateRange(
        type: UserWalletTransactionType,
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        const result = await this.prisma.userWalletTransaction.aggregate({
            where: {
                type: type as any,
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { amount: true }
        });

        return Number(result._sum.amount ?? 0) || 0;
    }

    async countByTypeAndDateRange(
        type: UserWalletTransactionType,
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        return await this.prisma.userWalletTransaction.count({
            where: {
                type: type as any,
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }

    async getTotalByTypeAndStatus(
        type: UserWalletTransactionType,
        status: UserWalletTransactionStatus
    ): Promise<number> {
        const result = await this.prisma.userWalletTransaction.aggregate({
            where: {
                type: type as any,
                status: status as any
            },
            _sum: { amount: true }
        });

        return Number(result._sum.amount ?? 0) || 0;
    }

    async countByTypeAndStatus(
        type: UserWalletTransactionType,
        status: UserWalletTransactionStatus
    ): Promise<number> {
        return await this.prisma.userWalletTransaction.count({
            where: {
                type: type as any,
                status: status as any
            }
        });
    }

    async getTotalCreditsPurchased(): Promise<number> {
        const transactions = await this.prisma.userWalletTransaction.findMany({
            where: {
                type: UserWalletTransactionType.CREDIT_PURCHASE as any,
                status: UserWalletTransactionStatus.COMPLETED as any
            },
            select: {
                metadata: true
            }
        });

        return transactions.reduce((acc, t) => {
            const credits = (t.metadata as any)?.creditsAdded;
            return acc + (Number(credits) || 0);
        }, 0);
    }

    async findAll(filters?: {
        page?: number;
        limit?: number;
        type?: UserWalletTransactionType;
        status?: UserWalletTransactionStatus;
        search?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<PaginatedTransactions> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.type) {
            where.type = filters.type as any;
        }

        if (filters?.status) {
            where.status = filters.status as any;
        }

        if (filters?.search) {
            where.OR = [
                { description: { contains: filters.search, mode: 'insensitive' } },
                { referenceId: { contains: filters.search, mode: 'insensitive' } },
                { source: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters?.startDate) where.createdAt.gte = filters.startDate;
            if (filters?.endDate) where.createdAt.lte = filters.endDate;
        }

        const [transactions, total] = await Promise.all([
            this.prisma.userWalletTransaction.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.userWalletTransaction.count({ where }),
        ]);

        return {
            transactions: transactions.map(t => {
                const transaction = UserWalletTransaction.fromDatabaseRow(t);
                // Attach user info if needed, though fromDatabaseRow might not support it directly without modification
                // If UserWalletTransaction entity doesn't have user details, we might need a localized DTO or extended entity.
                // For now, let's assume we return the entity and maybe map it efficiently in the use case.
                // Actually, the Prisma include fetches user. I should probably enrich the returned entity or return a DTO from repo?
                // Domain repositories usually return Domain Entities.
                // Let's attach user to metadata or extended property if possible?
                // Or just rely on the fact that we might need to fetch users separately if strictly following DDD, 
                // but "include" is more efficient.
                // Let's cheat slightly and shove it in metadata or return as is?
                // The `fromDatabaseRow` likely ignores extra fields.
                // Let's create a new DTO or interface for this return type if needed, but for now `PaginatedTransactions` expects `UserWalletTransaction[]`.
                // I will modify `PaginatedTransactions` or `UserWalletTransaction` to include optional user details?
                // Or I can fetch users in the Use Case. That's safer for strict DDD.
                // BUT, searching by user name won't work if I don't join.
                // The search above searches description/refId.
                // I'll stick to returning `UserWalletTransaction` and let the Use Case fetch user details if needed (or I can return the raw prisma result if I change the return type).
                // Let's keep it simple: Return Entities. Use Case loads Users.
                return transaction;
            }),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
