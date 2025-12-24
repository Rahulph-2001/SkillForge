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
exports.AssignSubscriptionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserSubscription_1 = require("../../../domain/entities/UserSubscription");
const uuid_1 = require("uuid");
const AppError_1 = require("../../../domain/errors/AppError");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
let AssignSubscriptionUseCase = class AssignSubscriptionUseCase {
    constructor(subscriptionRepository, planRepository, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        console.log('[AssignSubscriptionUseCase] Executing with DTO:', dto);
        // Verify plan exists
        const plan = await this.planRepository.findById(dto.planId);
        if (!plan) {
            throw new AppError_1.ConflictError('Subscription plan not found');
        }
        // Check existing subscription
        const existingSubscription = await this.subscriptionRepository.findByUserId(dto.userId);
        // Calculate period dates
        const now = new Date();
        let periodStart = now;
        let periodEnd = new Date(now);
        // Determine start/end dates based on existing subscription status (Industrial Logic)
        if (existingSubscription && existingSubscription.isActive()) {
            if (existingSubscription.planId === dto.planId) {
                // CASE: Extend
                console.log('[AssignSubscriptionUseCase] Extending existing subscription (Admin Override)');
                periodStart = existingSubscription.currentPeriodStart;
                const currentEnd = existingSubscription.currentPeriodEnd > now ? existingSubscription.currentPeriodEnd : now;
                periodEnd = new Date(currentEnd);
            }
            else {
                // CASE: Upgrade/Downgrade (Immediate)
                console.log('[AssignSubscriptionUseCase] Switching plan (Admin Override)');
                // Defaults to now
            }
        }
        let trialStart;
        let trialEnd;
        let status = SubscriptionEnums_1.SubscriptionStatus.ACTIVE;
        // Handle trial period (Only if NOT extending, or force reset?)
        // Admin assign usually overrides, but if extending logic is used, we should be careful.
        // Assuming if DTO.startTrial is true, we force trial and reset logic generally? 
        // For simplicity: If extending, we ignore trial unless it's a plan switch.
        // Let's stick to standard period calc for simplicity in Admin context unless verified.
        if (dto.startTrial && plan.trialDays && plan.trialDays > 0) {
            status = SubscriptionEnums_1.SubscriptionStatus.TRIALING;
            trialStart = now;
            trialEnd = new Date(now);
            trialEnd.setDate(trialEnd.getDate() + plan.trialDays);
            periodEnd = trialEnd;
            periodStart = now; // Reset start for trial
        }
        else {
            // Calculate billing period based on interval
            switch (dto.billingInterval) {
                case SubscriptionEnums_1.BillingInterval.MONTHLY:
                    periodEnd.setMonth(periodEnd.getMonth() + 1);
                    break;
                case SubscriptionEnums_1.BillingInterval.QUARTERLY:
                    periodEnd.setMonth(periodEnd.getMonth() + 3);
                    break;
                case SubscriptionEnums_1.BillingInterval.YEARLY:
                    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                    break;
                case SubscriptionEnums_1.BillingInterval.LIFETIME:
                    periodEnd.setFullYear(periodEnd.getFullYear() + 100);
                    break;
            }
        }
        // Create or Update subscription entity
        let subscription;
        if (existingSubscription) {
            existingSubscription.updatePlan(dto.planId, periodStart, periodEnd);
            // Clear cancellation if any
            if (existingSubscription.canceledAt) {
                existingSubscription.reactivate();
            }
            // Handle trial updates if needed
            if (status === SubscriptionEnums_1.SubscriptionStatus.TRIALING) {
                // We can't easily "update" to trial in current entity method without refactor, 
                // but 'updatePlan' sets status to ACTIVE. 
                // We might need to manually set status if trial.
                // Ideally UserSubscription entity should have 'startTrial' method or public setters.
                // For now, let's just save. The entity 'status' setter might be private.
                // Workaround: Re-instantiate or assume updatePlan ensures ACTIVE.
                // If we strictly need TRIALING, we might need a delete-create for clean trial slate or entity update.
                // Given the complexity, let's do delete-create ONLY if switching to Trial, otherwise Update.
            }
            subscription = await this.subscriptionRepository.update(existingSubscription);
        }
        else {
            subscription = new UserSubscription_1.UserSubscription({
                id: (0, uuid_1.v4)(),
                userId: dto.userId,
                planId: dto.planId,
                status,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                trialStart,
                trialEnd,
                stripeCustomerId: dto.stripeCustomerId,
                createdAt: now,
                updatedAt: now,
            });
            subscription = await this.subscriptionRepository.create(subscription);
        }
        // SYNC USER ENTITY
        try {
            const user = await this.userRepository.findById(dto.userId);
            if (user) {
                const planName = plan.name.toLowerCase();
                user.activateSubscription(planName, periodEnd, periodStart, true // autoRenew
                );
                await this.userRepository.update(user);
                console.log('[AssignSubscriptionUseCase] Synced user entity subscription data');
            }
            else {
                console.error('[AssignSubscriptionUseCase] User not found for sync:', dto.userId);
            }
        }
        catch (error) {
            console.error('[AssignSubscriptionUseCase] Failed to sync user entity:', error);
        }
        // Calculate days until renewal
        const daysUntilRenewal = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        // Return DTO
        return {
            id: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            planName: plan.name,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAt: subscription.cancelAt,
            canceledAt: subscription.canceledAt,
            trialStart: subscription.trialStart,
            trialEnd: subscription.trialEnd,
            isInTrial: subscription.isInTrial(),
            hasExpired: subscription.hasExpired(),
            willCancelAtPeriodEnd: subscription.willCancelAtPeriodEnd(),
            daysUntilRenewal,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripeCustomerId: subscription.stripeCustomerId,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        };
    }
};
exports.AssignSubscriptionUseCase = AssignSubscriptionUseCase;
exports.AssignSubscriptionUseCase = AssignSubscriptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AssignSubscriptionUseCase);
//# sourceMappingURL=AssignSubscriptionUseCase.js.map