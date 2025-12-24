import { SubscriptionStatus, BillingInterval } from '../enums/SubscriptionEnums';
export interface UserSubscriptionProps {
    id: string;
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAt?: Date;
    canceledAt?: Date;
    trialStart?: Date;
    trialEnd?: Date;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserSubscription {
    private _id;
    private _userId;
    private _planId;
    private _status;
    private _currentPeriodStart;
    private _currentPeriodEnd;
    private _cancelAt?;
    private _canceledAt?;
    private _trialStart?;
    private _trialEnd?;
    private _stripeSubscriptionId?;
    private _stripeCustomerId?;
    private _createdAt;
    private _updatedAt;
    constructor(props: UserSubscriptionProps);
    get id(): string;
    get userId(): string;
    get planId(): string;
    get status(): SubscriptionStatus;
    get currentPeriodStart(): Date;
    get currentPeriodEnd(): Date;
    get cancelAt(): Date | undefined;
    get canceledAt(): Date | undefined;
    get trialStart(): Date | undefined;
    get trialEnd(): Date | undefined;
    get stripeSubscriptionId(): string | undefined;
    get stripeCustomerId(): string | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    /**
     * Validate subscription business rules
     */
    private validate;
    /**
     * Check if subscription is active
     */
    isActive(): boolean;
    /**
     * Check if subscription is in trial period
     */
    isInTrial(): boolean;
    /**
     * Check if subscription has expired
     */
    hasExpired(): boolean;
    /**
     * Check if subscription will be canceled at period end
     */
    willCancelAtPeriodEnd(): boolean;
    /**
     * Cancel subscription at period end
     */
    cancelAtPeriodEnd(): void;
    /**
     * Cancel subscription immediately
     */
    cancelImmediately(): void;
    /**
     * Reactivate canceled subscription
     */
    reactivate(): void;
    /**
     * Renew subscription for next period
     */
    renew(billingInterval: BillingInterval): void;
    /**
     * Update plan (upgrade/downgrade)
     */
    updatePlan(newPlanId: string, periodStart?: Date, periodEnd?: Date): void;
    /**
     * Mark as past due
     */
    markAsPastDue(): void;
    /**
     * Mark as unpaid
     */
    markAsUnpaid(): void;
    /**
     * Convert to JSON for API responses
     */
    toJSON(): Record<string, unknown>;
    /**
     * Create from plain object (for repository)
     */
    static fromJSON(data: any): UserSubscription;
}
//# sourceMappingURL=UserSubscription.d.ts.map