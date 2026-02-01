"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionMapper = void 0;
const inversify_1 = require("inversify");
let UserSubscriptionMapper = class UserSubscriptionMapper {
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    toDTO(subscription, planName, usageRecords = [], planLimits = {}) {
        const now = new Date();
        const daysUntilRenewal = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        // Map usage
        const usageStats = Object.keys(planLimits).map(featureKey => {
            const record = usageRecords.find(r => r.featureKey === featureKey);
            return {
                feature: featureKey,
                used: record ? record.usageCount : 0,
                limit: planLimits[featureKey]
            };
        });
        // Also add records that might not be in plan limits (custom features)
        usageRecords.forEach(record => {
            if (!usageStats.find(s => s.feature === record.featureKey)) {
                usageStats.push({
                    feature: record.featureKey,
                    used: record.usageCount,
                    limit: record.limitValue
                });
            }
        });
        return {
            id: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            planName,
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
            daysUntilRenewal: daysUntilRenewal > 0 ? daysUntilRenewal : undefined,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripeCustomerId: subscription.stripeCustomerId,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            usage: usageStats
        };
    }
    /**
     * Map array of UserSubscription entities to DTOs
     */
    toDTOArray(subscriptions) {
        return subscriptions.map((subscription) => this.toDTO(subscription));
    }
};
exports.UserSubscriptionMapper = UserSubscriptionMapper;
exports.UserSubscriptionMapper = UserSubscriptionMapper = __decorate([
    (0, inversify_1.injectable)()
], UserSubscriptionMapper);
//# sourceMappingURL=UserSubscriptionMapper.js.map