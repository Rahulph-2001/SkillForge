"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletTransactionRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
let UserWalletTransactionRepository = class UserWalletTransactionRepository {
    constructor(db) {
        this.prisma = db.getClient();
    }
    async create(transaction) {
        const data = transaction.toJSON();
        const created = await this.prisma.userWalletTransaction.create({
            data: {
                id: data.id,
                userId: data.userId,
                type: data.type,
                amount: data.amount,
                currency: data.currency,
                source: data.source,
                referenceId: data.referenceId,
                description: data.description,
                metadata: data.metadata,
                previousBalance: data.previousBalance,
                newBalance: data.newBalance,
                status: data.status,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
        return UserWalletTransaction_1.UserWalletTransaction.fromDatabaseRow(created);
    }
    async findById(id) {
        const found = await this.prisma.userWalletTransaction.findUnique({
            where: { id },
        });
        if (!found)
            return null;
        return UserWalletTransaction_1.UserWalletTransaction.fromDatabaseRow(found);
    }
    async findByUserId(userId, filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { userId };
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
            transactions: transactions.map(t => UserWalletTransaction_1.UserWalletTransaction.fromDatabaseRow(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async update(transaction) {
        const data = transaction.toJSON();
        const updated = await this.prisma.userWalletTransaction.update({
            where: { id: data.id },
            data: {
                status: data.status,
                updatedAt: new Date(),
            },
        });
        return UserWalletTransaction_1.UserWalletTransaction.fromDatabaseRow(updated);
    }
    async findCreditTransactions(userId, filters) {
        const skip = (filters.page - 1) * filters.limit;
        const where = {
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
            transactions: transactions.map(t => UserWalletTransaction_1.UserWalletTransaction.fromDatabaseRow(t)),
            total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(total / filters.limit),
        };
    }
    async getCreditStats(userId) {
        const [earned, spent, purchased] = await Promise.all([
            this.prisma.userWalletTransaction.aggregate({
                where: {
                    userId,
                    type: { in: ['SESSION_EARNING', 'PROJECT_EARNING'] },
                    status: 'COMPLETED',
                },
                _sum: { amount: true },
            }),
            this.prisma.userWalletTransaction.aggregate({
                where: {
                    userId,
                    type: 'SESSION_PAYMENT',
                    status: 'COMPLETED',
                },
                _sum: { amount: true },
            }),
            this.prisma.userWalletTransaction.aggregate({
                where: {
                    userId,
                    type: 'CREDIT_PURCHASE',
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
    async getTotalByType(type) {
        const result = await this.prisma.userWalletTransaction.aggregate({
            where: { type: type },
            _sum: { amount: true }
        });
        return Number(result._sum.amount ?? 0) || 0;
    }
    async countByType(type) {
        return await this.prisma.userWalletTransaction.count({
            where: { type: type }
        });
    }
    async getTotalByTypeAndDateRange(type, startDate, endDate) {
        const result = await this.prisma.userWalletTransaction.aggregate({
            where: {
                type: type,
                createdAt: { gte: startDate, lte: endDate }
            },
            _sum: { amount: true }
        });
        return Number(result._sum.amount ?? 0) || 0;
    }
    async countByTypeAndDateRange(type, startDate, endDate) {
        return await this.prisma.userWalletTransaction.count({
            where: {
                type: type,
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }
    async getTotalByTypeAndStatus(type, status) {
        const result = await this.prisma.userWalletTransaction.aggregate({
            where: {
                type: type,
                status: status
            },
            _sum: { amount: true }
        });
        return Number(result._sum.amount ?? 0) || 0;
    }
    async countByTypeAndStatus(type, status) {
        return await this.prisma.userWalletTransaction.count({
            where: {
                type: type,
                status: status
            }
        });
    }
    async getTotalCreditsPurchased() {
        const transactions = await this.prisma.userWalletTransaction.findMany({
            where: {
                type: UserWalletTransaction_1.UserWalletTransactionType.CREDIT_PURCHASE,
                status: UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED
            },
            select: {
                metadata: true
            }
        });
        return transactions.reduce((acc, t) => {
            const credits = t.metadata?.creditsAdded;
            return acc + (Number(credits) || 0);
        }, 0);
    }
    async findAll(filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.status) {
            where.status = filters.status;
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
            if (filters?.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters?.endDate)
                where.createdAt.lte = filters.endDate;
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
                const transaction = UserWalletTransaction_1.UserWalletTransaction.fromDatabaseRow(t);
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
};
exports.UserWalletTransactionRepository = UserWalletTransactionRepository;
exports.UserWalletTransactionRepository = UserWalletTransactionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], UserWalletTransactionRepository);
//# sourceMappingURL=UserWalletTransactionRepository.js.map