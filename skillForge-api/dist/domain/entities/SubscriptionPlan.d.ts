export interface SubscriptionFeature {
    id: string;
    name: string;
}
export type PlanBadge = 'Free' | 'Starter' | 'Professional' | 'Enterprise';
export declare class SubscriptionPlan {
    private _id;
    private _name;
    private _price;
    private _projectPosts;
    private _communityPosts;
    private _features;
    private _badge;
    private _color;
    private _isActive;
    private _createdAt;
    private _updatedAt;
    constructor(id: string, name: string, price: number, projectPosts: number | null, communityPosts: number | null, features: SubscriptionFeature[], badge: PlanBadge, color: string, isActive?: boolean, createdAt?: Date, updatedAt?: Date);
    get id(): string;
    get name(): string;
    get price(): number;
    get projectPosts(): number | null;
    get communityPosts(): number | null;
    get features(): SubscriptionFeature[];
    get badge(): PlanBadge;
    get color(): string;
    get isActive(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    /**
     * Validate subscription plan business rules
     */
    private validate;
    /**
     * Update plan details
     */
    updateDetails(name: string, price: number, projectPosts: number | null, communityPosts: number | null, badge: PlanBadge, color: string): void;
    /**
     * Add a new feature to the plan
     */
    addFeature(id: string, name: string): void;
    /**
     * Remove a feature from the plan
     */
    removeFeature(featureId: string): void;
    /**
     * Update a feature
     */
    updateFeature(featureId: string, newName: string): void;
    /**
     * Set all features at once (useful for updates)
     */
    setFeatures(features: SubscriptionFeature[]): void;
    /**
     * Activate the plan
     */
    activate(): void;
    /**
     * Deactivate the plan
     */
    deactivate(): void;
    /**
     * Check if plan allows unlimited project posts
     */
    hasUnlimitedProjectPosts(): boolean;
    /**
     * Check if plan allows unlimited community posts
     */
    hasUnlimitedCommunityPosts(): boolean;
    /**
     * Convert to JSON for API responses
     */
    toJSON(): Record<string, unknown>;
    /**
     * Create from plain object (for repository)
     */
    static fromJSON(data: any): SubscriptionPlan;
}
//# sourceMappingURL=SubscriptionPlan.d.ts.map