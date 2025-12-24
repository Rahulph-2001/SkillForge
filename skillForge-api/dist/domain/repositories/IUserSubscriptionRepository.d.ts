import { UserSubscription } from '../entities/UserSubscription';
import { SubscriptionStatus } from '../enums/SubscriptionEnums';
export interface IUserSubscriptionRepository {
    /**
     * Create a new user subscription
     */
    create(subscription: UserSubscription): Promise<UserSubscription>;
    /**
     * Find subscription by ID
     */
    findById(id: string): Promise<UserSubscription | null>;
    /**
     * Find subscription by user ID
     */
    findByUserId(userId: string): Promise<UserSubscription | null>;
    /**
     * Find subscriptions by plan ID
     */
    findByPlanId(planId: string): Promise<UserSubscription[]>;
    /**
     * Find subscriptions by status
     */
    findByStatus(status: SubscriptionStatus): Promise<UserSubscription[]>;
    /**
     * Find expiring subscriptions (within days)
     */
    findExpiring(days: number): Promise<UserSubscription[]>;
    /**
     * Update subscription
     */
    update(subscription: UserSubscription): Promise<UserSubscription>;
    /**
     * Delete subscription
     */
    delete(id: string): Promise<void>;
    /**
     * Count active subscriptions for a plan
     */
    countActiveByPlanId(planId: string): Promise<number>;
    /**
     * Find subscriptions ending in period
     */
    findEndingInPeriod(startDate: Date, endDate: Date): Promise<UserSubscription[]>;
    /**
     * Find expired active subscriptions
     */
    findExpiredActiveSubscriptions(date: Date): Promise<UserSubscription[]>;
}
//# sourceMappingURL=IUserSubscriptionRepository.d.ts.map