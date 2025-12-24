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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserSubscriptionRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const UserSubscription_1 = require("../../../domain/entities/UserSubscription");
let PrismaUserSubscriptionRepository = class PrismaUserSubscriptionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(subscription) {
        const data = await this.prisma.userSubscription.create({
            data: {
                userId: subscription.userId,
                planId: subscription.planId,
                status: subscription.status,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAt: subscription.cancelAt,
                canceledAt: subscription.canceledAt,
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
            },
        });
        return UserSubscription_1.UserSubscription.fromJSON(data);
    }
    async findById(id) {
        const data = await this.prisma.userSubscription.findUnique({
            where: { id },
        });
        return data ? UserSubscription_1.UserSubscription.fromJSON(data) : null;
    }
    async findByUserId(userId) {
        const data = await this.prisma.userSubscription.findUnique({
            where: { userId },
        });
        return data ? UserSubscription_1.UserSubscription.fromJSON(data) : null;
    }
    async findByPlanId(planId) {
        const data = await this.prisma.userSubscription.findMany({
            where: { planId },
        });
        return data.map((item) => UserSubscription_1.UserSubscription.fromJSON(item));
    }
    async findByStatus(status) {
        const data = await this.prisma.userSubscription.findMany({
            where: { status: status },
        });
        return data.map((item) => UserSubscription_1.UserSubscription.fromJSON(item));
    }
    async findExpiring(days) {
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        const data = await this.prisma.userSubscription.findMany({
            where: {
                currentPeriodEnd: {
                    gte: now,
                    lte: expiryDate,
                },
                status: {
                    in: ['ACTIVE', 'TRIALING'],
                },
            },
        });
        return data.map((item) => UserSubscription_1.UserSubscription.fromJSON(item));
    }
    async update(subscription) {
        const data = await this.prisma.userSubscription.update({
            where: { id: subscription.id },
            data: {
                planId: subscription.planId,
                status: subscription.status,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                cancelAt: subscription.cancelAt,
                canceledAt: subscription.canceledAt,
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
                updatedAt: subscription.updatedAt,
            },
        });
        return UserSubscription_1.UserSubscription.fromJSON(data);
    }
    async delete(id) {
        await this.prisma.userSubscription.delete({
            where: { id },
        });
    }
    async countActiveByPlanId(planId) {
        return await this.prisma.userSubscription.count({
            where: {
                planId,
                status: {
                    in: ['ACTIVE', 'TRIALING'],
                },
            },
        });
    }
    async findEndingInPeriod(startDate, endDate) {
        const data = await this.prisma.userSubscription.findMany({
            where: {
                currentPeriodEnd: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        return data.map((item) => UserSubscription_1.UserSubscription.fromJSON(item));
    }
};
exports.PrismaUserSubscriptionRepository = PrismaUserSubscriptionRepository;
exports.PrismaUserSubscriptionRepository = PrismaUserSubscriptionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaUserSubscriptionRepository);
//# sourceMappingURL=PrismaUserSubscriptionRepository.js.map