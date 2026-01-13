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
exports.ActivateSubscriptionUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserSubscription_1 = require("../../../domain/entities/UserSubscription");
const uuid_1 = require("uuid");
const AppError_1 = require("../../../domain/errors/AppError");
const SubscriptionEnums_1 = require("../../../domain/enums/SubscriptionEnums");
let ActivateSubscriptionUseCase = class ActivateSubscriptionUseCase {
    constructor(userRepository, subscriptionRepository, planRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
    }
    async execute(dto) {
        // 1. Fetch user
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        // 2. Fetch subscription plan
        const plan = await this.planRepository.findById(dto.planId);
        if (!plan) {
            throw new AppError_1.NotFoundError('Subscription plan not found');
        }
        // 3. Check for existing subscription
        const existingSubscription = await this.subscriptionRepository.findByUserId(dto.userId);
        // 4. Calculate new period dates
        const now = new Date();
        let periodStart = now;
        let periodEnd = new Date(now);
        // 5. Determine start/end dates based on existing subscription status
        if (existingSubscription && existingSubscription.isActive()) {
            if (existingSubscription.planId === dto.planId) {
                // CASE: RE-SUBSCRIBE / EXTEND (Same Plan) -> Industrial Standard: Extend from current end date
                periodStart = existingSubscription.currentPeriodStart; // Keep original start
                // If already expired (but marked active?), use now. But isActive() checks expiry usually. 
                // Let's ensure we extend from currentPeriodEnd if it's in the future, else from now.
                const currentEnd = existingSubscription.currentPeriodEnd > now ? existingSubscription.currentPeriodEnd : now;
                periodEnd = new Date(currentEnd);
            }
            else {
                // CASE: UPGRADE / DOWNGRADE -> Industrial Standard: Immediate switch
                // Period starts now.
                // NOTE: In a real Stripe integration, we'd handle proration here. 
                // For now, we just reset the cycle.
            }
        }
        // Calculate end date based on billing interval
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
        // 6. Persist Subscription
        let subscription;
        if (existingSubscription) {
            // Update existing
            existingSubscription.updatePlan(dto.planId, periodStart, periodEnd);
            // Ensure canceledAt is cleared if it was set (reactivation)
            if (existingSubscription.canceledAt) {
                existingSubscription.reactivate();
            }
            subscription = await this.subscriptionRepository.update(existingSubscription);
        }
        else {
            // Create new
            subscription = new UserSubscription_1.UserSubscription({
                id: (0, uuid_1.v4)(),
                userId: dto.userId,
                planId: dto.planId,
                status: SubscriptionEnums_1.SubscriptionStatus.ACTIVE,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                createdAt: now,
                updatedAt: now,
            });
            subscription = await this.subscriptionRepository.create(subscription);
        }
        // 7. Update User Entity (Legacy/Sync)
        const planType = this.mapBadgeToSubscriptionPlan(plan.badge);
        user.activateSubscription(planType, periodEnd, periodStart, true); // Auto-renew ON
        await this.userRepository.update(user);
        return {
            subscriptionId: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            planName: plan.name,
            planBadge: plan.badge,
            status: subscription.status,
            validUntil: subscription.currentPeriodEnd,
            startedAt: subscription.currentPeriodStart,
        };
    }
    mapBadgeToSubscriptionPlan(badge) {
        const lowerBadge = badge.toLowerCase();
        if (lowerBadge === 'free')
            return 'free';
        if (lowerBadge === 'starter')
            return 'starter';
        if (lowerBadge === 'professional')
            return 'professional';
        if (lowerBadge === 'enterprise')
            return 'enterprise';
        return 'free';
    }
};
exports.ActivateSubscriptionUseCase = ActivateSubscriptionUseCase;
exports.ActivateSubscriptionUseCase = ActivateSubscriptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserSubscriptionRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ActivateSubscriptionUseCase);
//# sourceMappingURL=ActivateSubscriptionUseCase.js.map