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
exports.PrismaSubscriptionPlanRepository = void 0;
const inversify_1 = require("inversify");
const Database_1 = require("../Database");
const SubscriptionPlan_1 = require("../../../domain/entities/SubscriptionPlan");
const AppError_1 = require("../../../domain/errors/AppError");
const types_1 = require("../../di/types");
let PrismaSubscriptionPlanRepository = class PrismaSubscriptionPlanRepository {
    constructor(db) {
        this.prisma = db.getClient();
    }
    async findAll() {
        const plans = await this.prisma.subscriptionPlanModel.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
        return plans.map((plan) => this.toDomain(plan));
    }
    async findById(id) {
        const plan = await this.prisma.subscriptionPlanModel.findUnique({
            where: { id },
        });
        if (!plan) {
            return null;
        }
        return this.toDomain(plan);
    }
    async findByName(name) {
        const plan = await this.prisma.subscriptionPlanModel.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });
        if (!plan) {
            return null;
        }
        return this.toDomain(plan);
    }
    async create(plan) {
        const planData = plan.toJSON();
        const createdPlan = await this.prisma.subscriptionPlanModel.create({
            data: {
                name: planData.name,
                price: planData.price,
                projectPosts: planData.projectPosts,
                communityPosts: planData.communityPosts,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                badge: planData.badge, // PlanBadge enum from Prisma
                color: planData.color,
                isActive: planData.isActive,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                features: planData.features, // JsonValue from Prisma
            },
        });
        return this.toDomain(createdPlan);
    }
    async update(plan) {
        const planData = plan.toJSON();
        try {
            const updatedPlan = await this.prisma.subscriptionPlanModel.update({
                where: { id: plan.id },
                data: {
                    name: planData.name,
                    price: planData.price,
                    projectPosts: planData.projectPosts,
                    communityPosts: planData.communityPosts,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    badge: planData.badge, // PlanBadge enum from Prisma
                    color: planData.color,
                    isActive: planData.isActive,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    features: planData.features, // JsonValue from Prisma
                    updatedAt: new Date(),
                },
            });
            return this.toDomain(updatedPlan);
        }
        catch (error) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
    }
    async delete(id) {
        // Soft delete by setting isActive to false
        try {
            await this.prisma.subscriptionPlanModel.update({
                where: { id },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            });
        }
        catch (error) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
    }
    async getStats() {
        // Get all active plans
        const plans = await this.prisma.subscriptionPlanModel.findMany({
            where: { isActive: true },
        });
        // For now, return mock statistics
        // In a real app, you would query actual user subscriptions
        const totalRevenue = plans.reduce((sum, plan) => sum + Number(plan.price), 0);
        const monthlyRecurring = totalRevenue;
        const activeSubscriptions = plans.length;
        const paidUsers = plans.filter((p) => Number(p.price) > 0).length;
        const freeUsers = plans.filter((p) => Number(p.price) === 0).length;
        return {
            totalRevenue,
            monthlyRecurring,
            activeSubscriptions,
            paidUsers,
            freeUsers,
        };
    }
    async nameExists(name, excludePlanId) {
        const plan = await this.prisma.subscriptionPlanModel.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                isActive: true,
                ...(excludePlanId && { id: { not: excludePlanId } }),
            },
        });
        return plan !== null;
    }
    /**
     * Convert Prisma model to Domain entity
     */
    toDomain(prismaModel) {
        return SubscriptionPlan_1.SubscriptionPlan.fromJSON({
            id: prismaModel.id,
            name: prismaModel.name,
            price: Number(prismaModel.price),
            projectPosts: prismaModel.projectPosts,
            communityPosts: prismaModel.communityPosts,
            features: prismaModel.features,
            badge: prismaModel.badge,
            color: prismaModel.color,
            isActive: prismaModel.isActive,
            createdAt: prismaModel.createdAt,
            updatedAt: prismaModel.updatedAt,
        });
    }
};
exports.PrismaSubscriptionPlanRepository = PrismaSubscriptionPlanRepository;
exports.PrismaSubscriptionPlanRepository = PrismaSubscriptionPlanRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], PrismaSubscriptionPlanRepository);
//# sourceMappingURL=PrismaSubscriptionPlanRepository.js.map