"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionMapper = void 0;
class UserSubscriptionMapper {
    /**
     * Map UserSubscription entity to UserSubscriptionResponseDTO with computed fields
     */
    static toDTO(subscription, planName) {
        const now = new Date();
        const daysUntilRenewal = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
        };
    }
    /**
     * Map array of UserSubscription entities to DTOs
     */
    static toDTOArray(subscriptions) {
        return subscriptions.map((subscription) => this.toDTO(subscription));
    }
}
exports.UserSubscriptionMapper = UserSubscriptionMapper;
//# sourceMappingURL=UserSubscriptionMapper.js.map