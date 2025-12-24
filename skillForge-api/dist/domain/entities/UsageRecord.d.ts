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
export declare class UsageRecord {
    private _id;
    private _subscriptionId;
    private _featureKey;
    private _usageCount;
    private _limitValue?;
    private _periodStart;
    private _periodEnd;
    private _createdAt;
    private _updatedAt;
    constructor(props: UsageRecordProps);
    get id(): string;
    get subscriptionId(): string;
    get featureKey(): string;
    get usageCount(): number;
    get limitValue(): number | undefined;
    get periodStart(): Date;
    get periodEnd(): Date;
    get createdAt(): Date;
    get updatedAt(): Date;
    /**
     * Validate usage record business rules
     */
    private validate;
    /**
     * Check if usage has reached limit
     */
    hasReachedLimit(): boolean;
    /**
     * Check if usage is within limit
     */
    isWithinLimit(): boolean;
    /**
     * Get remaining usage
     */
    getRemainingUsage(): number | null;
    /**
     * Get usage percentage
     */
    getUsagePercentage(): number | null;
    /**
     * Increment usage count
     */
    incrementUsage(amount?: number): void;
    /**
     * Decrement usage count (for refunds/corrections)
     */
    decrementUsage(amount?: number): void;
    /**
     * Reset usage count
     */
    resetUsage(): void;
    /**
     * Check if period is active
     */
    isPeriodActive(): boolean;
    /**
     * Check if period has expired
     */
    hasPeriodExpired(): boolean;
    /**
     * Convert to JSON for API responses
     */
    toJSON(): Record<string, unknown>;
    /**
     * Create from plain object (for repository)
     */
    static fromJSON(data: any): UsageRecord;
}
//# sourceMappingURL=UsageRecord.d.ts.map