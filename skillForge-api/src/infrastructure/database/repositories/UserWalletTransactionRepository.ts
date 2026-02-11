import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { IUserWalletTransactionRepository, UserWalletTransactionFilters, PaginatedTransactions } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransaction } from '../../../domain/entities/UserWalletTransaction';

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
}
