export interface UsageRecordProps {
    id: string;
    subscriptionId: string;
    featureKey: string;
    usageCount: number;
    limitValue?: number;
    periodStart: Date;
    periodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class UsageRecord {
    private _id: string;
    private _subscriptionId: string;
    private _featureKey: string;
    private _usageCount: number;
    private _limitValue?: number;
    private _periodStart: Date;
    private _periodEnd: Date;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: UsageRecordProps) {
        this._id = props.id;
        this._subscriptionId = props.subscriptionId;
        this._featureKey = props.featureKey;
        this._usageCount = props.usageCount;
        this._limitValue = props.limitValue;
        this._periodStart = props.periodStart;
        this._periodEnd = props.periodEnd;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;

        this.validate();
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get subscriptionId(): string {
        return this._subscriptionId;
    }

    get featureKey(): string {
        return this._featureKey;
    }

    get usageCount(): number {
        return this._usageCount;
    }

    get limitValue(): number | undefined {
        return this._limitValue;
    }

    get periodStart(): Date {
        return this._periodStart;
    }

    get periodEnd(): Date {
        return this._periodEnd;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Validate usage record business rules
     */
    private validate(): void {
        // Rule 1: Feature key cannot be empty
        if (!this._featureKey || this._featureKey.trim().length === 0) {
            throw new Error('Feature key cannot be empty');
        }

        // Rule 2: Usage count must be non-negative
        if (this._usageCount < 0) {
            throw new Error('Usage count must be non-negative');
        }

        // Rule 3: Period end must be after period start
        if (this._periodEnd <= this._periodStart) {
            throw new Error('Period end must be after period start');
        }

        // Rule 4: Limit value must be positive if set
        if (this._limitValue !== undefined && this._limitValue < 0) {
            throw new Error('Limit value must be positive');
        }
    }

    /**
     * Check if usage has reached limit
     */
    public hasReachedLimit(): boolean {
        if (this._limitValue === undefined) {
            return false; // No limit means unlimited
        }
        return this._usageCount >= this._limitValue;
    }


    /**
     * Check if usage is within limit
     */
    public isWithinLimit(): boolean {
        if (this._limitValue === undefined) {
            return true; // No limit means always within limit
        }
        return this._usageCount < this._limitValue;
    }

    /**
     * Get remaining usage
     */
    public getRemainingUsage(): number | null {
        if (this._limitValue === undefined) {
            return null; // Unlimited
        }
        return Math.max(0, this._limitValue - this._usageCount);
    }

    /**
     * Get usage percentage
     */
    public getUsagePercentage(): number | null {
        if (this._limitValue === undefined || this._limitValue === 0) {
            return null; // Unlimited or invalid limit
        }
        return Math.min(100, (this._usageCount / this._limitValue) * 100);
    }

    /**
     * Increment usage count
     */
    public incrementUsage(amount: number = 1): void {
        if (amount < 0) {
            throw new Error('Increment amount must be positive');
        }

        if (this._limitValue !== undefined && this._usageCount + amount > this._limitValue) {
            throw new Error(`Usage limit exceeded. Current: ${this._usageCount}, Limit: ${this._limitValue}, Attempting to add: ${amount}`);
        }

        this._usageCount += amount;
        this._updatedAt = new Date();
    }

    /**
     * Decrement usage count (for refunds/corrections)
     */
    public decrementUsage(amount: number = 1): void {
        if (amount < 0) {
            throw new Error('Decrement amount must be positive');
        }

        const newCount = this._usageCount - amount;
        if (newCount < 0) {
            throw new Error('Usage count cannot be negative');
        }

        this._usageCount = newCount;
        this._updatedAt = new Date();
    }

    /**
     * Reset usage count
     */
    public resetUsage(): void {
        this._usageCount = 0;
        this._updatedAt = new Date();
    }

    /**
     * Check if period is active
     */
    public isPeriodActive(): boolean {
        const now = new Date();
        return now >= this._periodStart && now <= this._periodEnd;
    }

    /**
     * Check if period has expired
     */
    public hasPeriodExpired(): boolean {
        const now = new Date();
        return now > this._periodEnd;
    }

    /**
     * Convert to JSON for API responses
     */
    public toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            subscriptionId: this._subscriptionId,
            featureKey: this._featureKey,
            usageCount: this._usageCount,
            limitValue: this._limitValue,
            remainingUsage: this.getRemainingUsage(),
            usagePercentage: this.getUsagePercentage(),
            periodStart: this._periodStart,
            periodEnd: this._periodEnd,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    /**
     * Create from plain object (for repository)
     */
    public static fromJSON(data: any): UsageRecord {
        return new UsageRecord({
            id: data.id,
            subscriptionId: data.subscriptionId || data.subscription_id,
            featureKey: data.featureKey || data.feature_key,
            usageCount: data.usageCount !== undefined ? data.usageCount : data.usage_count !== undefined ? data.usage_count : 0,
            limitValue: data.limitValue || data.limit_value,
            periodStart: data.periodStart ? new Date(data.periodStart) : new Date(data.period_start),
            periodEnd: data.periodEnd ? new Date(data.periodEnd) : new Date(data.period_end),
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(data.created_at),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.updated_at),
        });
    }
}
