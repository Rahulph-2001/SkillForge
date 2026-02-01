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
exports.WalletTransactionRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const WalletTransaction_1 = require("../../../domain/entities/WalletTransaction");
let WalletTransactionRepository = class WalletTransactionRepository {
    constructor(db) {
        this.db = db;
    }
    async create(transaction) {
        const data = transaction.toJSON();
        const created = await this.db.getClient().walletTransaction.create({
            data: {
                id: data.id,
                adminId: data.adminId,
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
            },
        });
        return WalletTransaction_1.WalletTransaction.fromDatabaseRow(created);
    }
    async findById(id) {
        const transaction = await this.db.getClient().walletTransaction.findUnique({
            where: { id },
        });
        return transaction ? WalletTransaction_1.WalletTransaction.fromDatabaseRow(transaction) : null;
    }
    async findByAdminId(adminId, page, limit) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.db.getClient().walletTransaction.findMany({
                where: { adminId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.db.getClient().walletTransaction.count({
                where: { adminId },
            }),
        ]);
        return {
            transactions: transactions.map(t => WalletTransaction_1.WalletTransaction.fromDatabaseRow(t)),
            total,
        };
    }
    async findByAdminIdWithFilters(adminId, page, limit, filters) {
        const skip = (page - 1) * limit;
        const where = { adminId };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.source) {
            where.source = filters.source;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.search) {
            where.OR = [
                { description: { contains: filters.search, mode: 'insensitive' } },
                { source: { contains: filters.search, mode: 'insensitive' } },
                { referenceId: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const [transactions, total] = await Promise.all([
            this.db.getClient().walletTransaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.db.getClient().walletTransaction.count({ where }),
        ]);
        return {
            transactions: transactions.map(t => WalletTransaction_1.WalletTransaction.fromDatabaseRow(t)),
            total,
        };
    }
};
exports.WalletTransactionRepository = WalletTransactionRepository;
exports.WalletTransactionRepository = WalletTransactionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], WalletTransactionRepository);
//# sourceMappingURL=WalletTransactionRepository.js.map