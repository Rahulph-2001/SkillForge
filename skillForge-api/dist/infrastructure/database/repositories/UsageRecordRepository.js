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
exports.UsageRecordRepository = void 0;
const inversify_1 = require("inversify");
const Database_1 = require("../Database");
const UsageRecord_1 = require("../../../domain/entities/UsageRecord");
const uuid_1 = require("uuid");
const types_1 = require("../../di/types");
const BaseRepository_1 = require("../BaseRepository");
let UsageRecordRepository = class UsageRecordRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'usageRecord');
    }
    async create(usageRecord) {
        const data = await this.prisma.usageRecord.create({
            data: {
                subscriptionId: usageRecord.subscriptionId,
                featureKey: usageRecord.featureKey,
                usageCount: usageRecord.usageCount,
                limitValue: usageRecord.limitValue,
                periodStart: usageRecord.periodStart,
                periodEnd: usageRecord.periodEnd,
            },
        });
        return UsageRecord_1.UsageRecord.fromJSON(data);
    }
    async findById(id) {
        const data = await this.prisma.usageRecord.findUnique({
            where: { id },
        });
        return data ? UsageRecord_1.UsageRecord.fromJSON(data) : null;
    }
    async findBySubscriptionAndFeature(subscriptionId, featureKey, periodStart, periodEnd) {
        const data = await this.prisma.usageRecord.findFirst({
            where: {
                subscriptionId,
                featureKey,
                periodStart: {
                    lte: periodStart,
                },
                periodEnd: {
                    gte: periodEnd,
                },
            },
        });
        return data ? UsageRecord_1.UsageRecord.fromJSON(data) : null;
    }
    async findBySubscriptionId(subscriptionId) {
        const data = await this.prisma.usageRecord.findMany({
            where: { subscriptionId },
            orderBy: { createdAt: 'desc' },
        });
        return data.map((item) => UsageRecord_1.UsageRecord.fromJSON(item));
    }
    async findCurrentPeriodBySubscriptionId(subscriptionId) {
        const now = new Date();
        const data = await this.prisma.usageRecord.findMany({
            where: {
                subscriptionId,
                periodStart: { lte: now },
                periodEnd: { gte: now },
            },
        });
        return data.map((item) => UsageRecord_1.UsageRecord.fromJSON(item));
    }
    async update(usageRecord) {
        const data = await this.prisma.usageRecord.update({
            where: { id: usageRecord.id },
            data: {
                usageCount: usageRecord.usageCount,
                limitValue: usageRecord.limitValue,
                updatedAt: usageRecord.updatedAt,
            },
        });
        return UsageRecord_1.UsageRecord.fromJSON(data);
    }
    async delete(id) {
        await this.prisma.usageRecord.delete({
            where: { id },
        });
    }
    async resetUsageForSubscription(subscriptionId, newPeriodStart, newPeriodEnd) {
        // Get all current usage records
        const currentRecords = await this.findCurrentPeriodBySubscriptionId(subscriptionId);
        // Create new records for the new period with reset counts
        const newRecords = currentRecords.map((record) => ({
            subscriptionId,
            featureKey: record.featureKey,
            usageCount: 0,
            limitValue: record.limitValue,
            periodStart: newPeriodStart,
            periodEnd: newPeriodEnd,
        }));
        // Create all new records in a transaction
        await this.prisma.$transaction(newRecords.map((record) => this.prisma.usageRecord.create({
            data: record,
        })));
    }
    async getOrCreate(subscriptionId, featureKey, limitValue, periodStart, periodEnd) {
        // Try to find existing record
        const existing = await this.findBySubscriptionAndFeature(subscriptionId, featureKey, periodStart, periodEnd);
        if (existing) {
            return existing;
        }
        // Create new record
        const newRecord = new UsageRecord_1.UsageRecord({
            id: (0, uuid_1.v4)(),
            subscriptionId,
            featureKey,
            usageCount: 0,
            limitValue,
            periodStart,
            periodEnd,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return await this.create(newRecord);
    }
    async upsert(record) {
        const data = record.toJSON();
        const upserted = await this.prisma.usageRecord.upsert({
            where: {
                subscriptionId_featureKey_periodStart: {
                    subscriptionId: data.subscriptionId,
                    featureKey: data.featureKey,
                    periodStart: data.periodStart,
                },
            },
            create: {
                id: data.id,
                subscriptionId: data.subscriptionId,
                featureKey: data.featureKey,
                usageCount: data.usageCount,
                limitValue: data.limitValue,
                periodStart: data.periodStart,
                periodEnd: data.periodEnd,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
            update: {
                usageCount: data.usageCount,
                limitValue: data.limitValue,
                updatedAt: new Date(),
            },
        });
        return UsageRecord_1.UsageRecord.fromJSON(upserted);
    }
};
exports.UsageRecordRepository = UsageRecordRepository;
exports.UsageRecordRepository = UsageRecordRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], UsageRecordRepository);
//# sourceMappingURL=UsageRecordRepository.js.map