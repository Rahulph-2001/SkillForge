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
const BaseRepository_1 = require("../BaseRepository");
let PrismaSubscriptionPlanRepository = class PrismaSubscriptionPlanRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'subscriptionPlanModel');
    }
    async findAll() {
        const plans = await this.prisma.subscriptionPlanModel.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
            include: {
                features: true
            }
        });
        return plans.map((plan) => this.toDomain(plan));
    }
    async findById(id) {
        const plan = await this.prisma.subscriptionPlanModel.findUnique({
            where: { id },
            include: {
                features: true
            }
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
                currency: planData.currency || 'INR',
                billingInterval: planData.billingInterval || 'MONTHLY',
                trialDays: planData.trialDays || 0,
                projectPosts: planData.projectPosts,
                createCommunity: planData.createCommunity,
                badge: planData.badge,
                color: planData.color,
                isPopular: planData.isPopular || false,
                displayOrder: planData.displayOrder || 0,
                isActive: planData.isActive,
                isPublic: planData.isPublic !== undefined ? planData.isPublic : true,
            },
            include: {
                features: true
            }
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
                    currency: planData.currency,
                    billingInterval: planData.billingInterval,
                    trialDays: planData.trialDays,
                    projectPosts: planData.projectPosts,
                    createCommunity: planData.createCommunity,
                    badge: planData.badge,
                    color: planData.color,
                    isPopular: planData.isPopular,
                    displayOrder: planData.displayOrder,
                    isActive: planData.isActive,
                    isPublic: planData.isPublic,
                    updatedAt: new Date(),
                },
                include: {
                    features: true
                }
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
        const plans = await this.prisma.subscriptionPlanModel.findMany({
            where: { isActive: true },
        });
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
    toDomain(prismaModel) {
        return SubscriptionPlan_1.SubscriptionPlan.fromJSON({
            id: prismaModel.id,
            name: prismaModel.name,
            price: Number(prismaModel.price),
            projectPosts: prismaModel.projectPosts,
            createCommunity: prismaModel.createCommunity,
            features: prismaModel.features ? prismaModel.features.map((f) => ({
                id: f.id,
                name: f.name,
                description: f.description,
                featureType: f.featureType,
                limitValue: f.limitValue,
                isEnabled: f.isEnabled,
                displayOrder: f.displayOrder,
                isHighlighted: f.isHighlighted
            })) : [],
            badge: prismaModel.badge,
            color: prismaModel.color,
            isActive: prismaModel.isActive,
            createdAt: prismaModel.createdAt,
            updatedAt: prismaModel.updatedAt,
            trialDays: prismaModel.trialDays || 0,
        });
    }
};
exports.PrismaSubscriptionPlanRepository = PrismaSubscriptionPlanRepository;
exports.PrismaSubscriptionPlanRepository = PrismaSubscriptionPlanRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], PrismaSubscriptionPlanRepository);
//# sourceMappingURL=SubscriptionPlanRepository.js.map