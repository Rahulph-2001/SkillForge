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
};
exports.UserWalletTransactionRepository = UserWalletTransactionRepository;
exports.UserWalletTransactionRepository = UserWalletTransactionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], UserWalletTransactionRepository);
//# sourceMappingURL=UserWalletTransactionRepository.js.map