"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscription = void 0;
const SubscriptionEnums_1 = require("../enums/SubscriptionEnums");
class UserSubscription {
    constructor(props) {
        this._id = props.id;
        this._userId = props.userId;
        this._planId = props.planId;
        this._status = props.status;
        this._currentPeriodStart = props.currentPeriodStart;
        this._currentPeriodEnd = props.currentPeriodEnd;
        this._cancelAt = props.cancelAt;
        this._canceledAt = props.canceledAt;
        this._trialStart = props.trialStart;
        this._trialEnd = props.trialEnd;
        this._stripeSubscriptionId = props.stripeSubscriptionId;
        this._stripeCustomerId = props.stripeCustomerId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this.validate();
    }
    // Getters
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get planId() {
        return this._planId;
    }
    get status() {
        return this._status;
    }
    get currentPeriodStart() {
        return this._currentPeriodStart;
    }
    get currentPeriodEnd() {
        return this._currentPeriodEnd;
    }
    get cancelAt() {
        return this._cancelAt;
    }
    get canceledAt() {
        return this._canceledAt;
    }
    get trialStart() {
        return this._trialStart;
    }
    get trialEnd() {
        return this._trialEnd;
    }
    get stripeSubscriptionId() {
        return this._stripeSubscriptionId;
    }
    get stripeCustomerId() {
        return this._stripeCustomerId;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    /**
     * Validate subscription business rules
     */
    validate() {
        // Rule 1: Period end must be after period start
        if (this._currentPeriodEnd <= this._currentPeriodStart) {
            throw new Error('Current period end must be after current period start');
        }
        // Rule 2: Trial end must be after trial start if both exist
        if (this._trialStart && this._trialEnd && this._trialEnd <= this._trialStart) {
            throw new Error('Trial end must be after trial start');
        }
        // Rule 3: Canceled subscriptions must have canceledAt date
        if (this._status === SubscriptionEnums_1.SubscriptionStatus.CANCELED && !this._canceledAt) {
            throw new Error('Canceled subscriptions must have a canceledAt date');
        }
        // Rule 4: Trialing subscriptions must have trial dates
        if (this._status === SubscriptionEnums_1.SubscriptionStatus.TRIALING && (!this._trialStart || !this._trialEnd)) {
            throw new Error('Trialing subscriptions must have trial start and end dates');
        }
    }
    /**
     * Check if subscription is active
     */
    isActive() {
        return this._status === SubscriptionEnums_1.SubscriptionStatus.ACTIVE || this._status === SubscriptionEnums_1.SubscriptionStatus.TRIALING;
    }
    /**
     * Check if subscription is in trial period
     */
    isInTrial() {
        if (!this._trialStart || !this._trialEnd) {
            return false;
        }
        const now = new Date();
        return this._status === SubscriptionEnums_1.SubscriptionStatus.TRIALING && now >= this._trialStart && now <= this._trialEnd;
    }
    /**
     * Check if subscription has expired
     */
    hasExpired() {
        const now = new Date();
        return now > this._currentPeriodEnd;
    }
    /**
     * Check if subscription will be canceled at period end
     */
    willCancelAtPeriodEnd() {
        return this._cancelAt !== undefined && this._cancelAt <= this._currentPeriodEnd;
    }
    /**
     * Cancel subscription at period end
     */
    cancelAtPeriodEnd() {
        if (this._status === SubscriptionEnums_1.SubscriptionStatus.CANCELED) {
            throw new Error('Subscription is already canceled');
        }
        // USER REQUIREMENT: Set status to CANCELED immediately (not industry standard, but requested)
        this._status = SubscriptionEnums_1.SubscriptionStatus.CANCELED;
        this._cancelAt = this._currentPeriodEnd;
        this._canceledAt = new Date(); // CRITICAL FIX: Set canceledAt so UI knows it's scheduled for cancellation
        this._updatedAt = new Date();
    }
    /**
     * Cancel subscription immediately
     */
    cancelImmediately() {
        if (this._status === SubscriptionEnums_1.SubscriptionStatus.CANCELED) {
            throw new Error('Subscription is already canceled');
        }
        this._status = SubscriptionEnums_1.SubscriptionStatus.CANCELED;
        this._cancelAt = new Date(); // Set when it was canceled
        this._canceledAt = new Date();
        this._currentPeriodEnd = new Date(); // End period immediately
        this._updatedAt = new Date();
    }
    /**
     * Reactivate canceled subscription
     */
    reactivate() {
        if (this._status !== SubscriptionEnums_1.SubscriptionStatus.CANCELED) {
            throw new Error('Only canceled subscriptions can be reactivated');
        }
        this._status = SubscriptionEnums_1.SubscriptionStatus.ACTIVE;
        this._cancelAt = undefined;
        this._canceledAt = undefined;
        this._updatedAt = new Date();
    }
    /**
     * Renew subscription for next period
     */
    renew(billingInterval) {
        const periodStart = this._currentPeriodEnd;
        let periodEnd;
        switch (billingInterval) {
            case SubscriptionEnums_1.BillingInterval.MONTHLY:
                periodEnd = new Date(periodStart);
                periodEnd.setMonth(periodEnd.getMonth() + 1);
                break;
            case SubscriptionEnums_1.BillingInterval.QUARTERLY:
                periodEnd = new Date(periodStart);
                periodEnd.setMonth(periodEnd.getMonth() + 3);
                break;
            case SubscriptionEnums_1.BillingInterval.YEARLY:
                periodEnd = new Date(periodStart);
                periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                break;
            case SubscriptionEnums_1.BillingInterval.LIFETIME:
                periodEnd = new Date(periodStart);
                periodEnd.setFullYear(periodEnd.getFullYear() + 100); // Effectively lifetime
                break;
        }
        this._currentPeriodStart = periodStart;
        this._currentPeriodEnd = periodEnd;
        this._status = SubscriptionEnums_1.SubscriptionStatus.ACTIVE;
        this._updatedAt = new Date();
    }
    /**
     * Update plan (upgrade/downgrade)
     */
    updatePlan(newPlanId, periodStart, periodEnd) {
        this._planId = newPlanId;
        if (periodStart) {
            this._currentPeriodStart = periodStart;
        }
        if (periodEnd) {
            this._currentPeriodEnd = periodEnd;
        }
        this._status = SubscriptionEnums_1.SubscriptionStatus.ACTIVE;
        this._updatedAt = new Date();
    }
    /**
     * Mark as past due
     */
    markAsPastDue() {
        this._status = SubscriptionEnums_1.SubscriptionStatus.PAST_DUE;
        this._updatedAt = new Date();
    }
    /**
     * Mark as unpaid
     */
    markAsUnpaid() {
        this._status = SubscriptionEnums_1.SubscriptionStatus.UNPAID;
        this._updatedAt = new Date();
    }
    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            id: this._id,
            userId: this._userId,
            planId: this._planId,
            status: this._status,
            currentPeriodStart: this._currentPeriodStart,
            currentPeriodEnd: this._currentPeriodEnd,
            cancelAt: this._cancelAt,
            canceledAt: this._canceledAt,
            trialStart: this._trialStart,
            trialEnd: this._trialEnd,
            stripeSubscriptionId: this._stripeSubscriptionId,
            stripeCustomerId: this._stripeCustomerId,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
    /**
     * Create from plain object (for repository)
     */
    static fromJSON(data) {
        return new UserSubscription({
            id: data.id,
            userId: data.userId || data.user_id,
            planId: data.planId || data.plan_id,
            status: data.status,
            currentPeriodStart: data.currentPeriodStart ? new Date(data.currentPeriodStart) : new Date(data.current_period_start),
            currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : new Date(data.current_period_end),
            cancelAt: data.cancelAt ? new Date(data.cancelAt) : data.cancel_at ? new Date(data.cancel_at) : undefined,
            canceledAt: data.canceledAt ? new Date(data.canceledAt) : data.canceled_at ? new Date(data.canceled_at) : undefined,
            trialStart: data.trialStart ? new Date(data.trialStart) : data.trial_start ? new Date(data.trial_start) : undefined,
            trialEnd: data.trialEnd ? new Date(data.trialEnd) : data.trial_end ? new Date(data.trial_end) : undefined,
            stripeSubscriptionId: data.stripeSubscriptionId || data.stripe_subscription_id,
            stripeCustomerId: data.stripeCustomerId || data.stripe_customer_id,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(data.created_at),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.updated_at),
        });
    }
}
exports.UserSubscription = UserSubscription;
//# sourceMappingURL=UserSubscription.js.map