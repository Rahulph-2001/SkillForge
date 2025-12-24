import { FeatureType } from '../enums/SubscriptionEnums';
export interface FeatureProps {
    id: string;
    planId?: string;
    name: string;
    description?: string;
    featureType: FeatureType;
    limitValue?: number;
    isEnabled: boolean;
    displayOrder: number;
    isHighlighted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Feature {
    private _id;
    private _planId?;
    private _name;
    private _description?;
    private _featureType;
    private _limitValue?;
    private _isEnabled;
    private _displayOrder;
    private _isHighlighted;
    private _createdAt;
    private _updatedAt;
    constructor(props: FeatureProps);
    get id(): string;
    get planId(): string | undefined;
    get name(): string;
    get description(): string | undefined;
    get featureType(): FeatureType;
    get limitValue(): number | undefined;
    get isEnabled(): boolean;
    get displayOrder(): number;
    get isHighlighted(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    /**
     * Validate feature business rules
     */
    private validate;
    /**
     * Update feature details
     */
    updateDetails(name: string, description: string | undefined, limitValue: number | undefined, isEnabled: boolean, isHighlighted: boolean): void;
    /**
     * Update display order
     */
    updateDisplayOrder(order: number): void;
    /**
     * Enable feature
     */
    enable(): void;
    /**
     * Disable feature
     */
    disable(): void;
    /**
     * Highlight feature
     */
    highlight(): void;
    /**
     * Remove highlight
     */
    unhighlight(): void;
    /**
     * Check if feature has a limit
     */
    hasLimit(): boolean;
    /**
     * Get limit or throw error
     */
    getLimit(): number;
    /**
     * Convert to JSON for API responses
     */
    toJSON(): Record<string, unknown>;
    /**
     * Create from plain object (for repository)
     */
    static fromJSON(data: any): Feature;
}
//# sourceMappingURL=Feature.d.ts.map