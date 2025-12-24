import { FeatureType } from '../enums/SubscriptionEnums';
export interface SubscriptionFeature {
    id: string;
    name: string;
    description?: string;
    featureType: FeatureType;
    limitValue?: number;
    isEnabled: boolean;
    displayOrder: number;
    isHighlighted: boolean;
}
export type PlanBadge = 'Free' | 'Starter' | 'Professional' | 'Enterprise';
export declare class SubscriptionPlan {
    private _id;
    private _name;
    private _price;
    private _projectPosts;
    private _createCommunity;
    private _features;
    private _badge;
    private _color;
    private _isActive;
    private _createdAt;
    private _updatedAt;
    private _trialDays;
    constructor(id: string, name: string, price: number, projectPosts: number | null, createCommunity: number | null, features: SubscriptionFeature[], badge: PlanBadge, color: string, isActive?: boolean, createdAt?: Date, updatedAt?: Date, trialDays?: number);
    get id(): string;
    get name(): string;
    get price(): number;
    get projectPosts(): number | null;
    get createCommunity(): number | null;
    get features(): SubscriptionFeature[];
    get badge(): PlanBadge;
    get color(): string;
    get isActive(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    get trialDays(): number;
    /**
     * Validate subscription plan business rules
     */
    private validate;
    /**
     * Update plan details
     */
    updateDetails(name: string, price: number, projectPosts: number | null, createCommunity: number | null, badge: PlanBadge, color: string): void;
    /**
     * Add a new feature to the plan
     */
    addFeature(feature: SubscriptionFeature): void;
    /**
     * Remove a feature from the plan
     */
    removeFeature(featureId: string): void;
    /**
     * Update a feature
     */
    updateFeature(featureId: string, updates: Partial<SubscriptionFeature>): void;
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