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

export class Feature {
    private _id: string;
    private _planId?: string;
    private _name: string;
    private _description?: string;
    private _featureType: FeatureType;
    private _limitValue?: number;
    private _isEnabled: boolean;
    private _displayOrder: number;
    private _isHighlighted: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: FeatureProps) {
        this._id = props.id;
        this._planId = props.planId;
        this._name = props.name;
        this._description = props.description;
        this._featureType = props.featureType;
        this._limitValue = props.limitValue;
        this._isEnabled = props.isEnabled;
        this._displayOrder = props.displayOrder;
        this._isHighlighted = props.isHighlighted;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;

        this.validate();
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get planId(): string | undefined {
        return this._planId;
    }

    get name(): string {
        return this._name;
    }

    get description(): string | undefined {
        return this._description;
    }

    get featureType(): FeatureType {
        return this._featureType;
    }

    get limitValue(): number | undefined {
        return this._limitValue;
    }

    get isEnabled(): boolean {
        return this._isEnabled;
    }

    get displayOrder(): number {
        return this._displayOrder;
    }

    get isHighlighted(): boolean {
        return this._isHighlighted;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Validate feature business rules
     */
    private validate(): void {
        // Rule 1: Name cannot be empty
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Feature name cannot be empty');
        }

        // Rule 2: NUMERIC_LIMIT must have a limit value
        if (this._featureType === FeatureType.NUMERIC_LIMIT && this._limitValue === undefined) {
            throw new Error('NUMERIC_LIMIT feature must have a limit value');
        }

        // Rule 3: NUMERIC_LIMIT value must be positive
        if (this._featureType === FeatureType.NUMERIC_LIMIT && this._limitValue !== undefined && this._limitValue < 0) {
            throw new Error('Limit value must be positive');
        }

        // Rule 4: Display order must be non-negative
        if (this._displayOrder < 0) {
            throw new Error('Display order must be non-negative');
        }
    }

    /**
     * Update feature details
     */
    public updateDetails(
        name: string,
        description: string | undefined,
        limitValue: number | undefined,
        isEnabled: boolean,
        isHighlighted: boolean
    ): void {
        this._name = name;
        this._description = description;
        this._limitValue = limitValue;
        this._isEnabled = isEnabled;
        this._isHighlighted = isHighlighted;
        this._updatedAt = new Date();

        this.validate();
    }

    /**
     * Update display order
     */
    public updateDisplayOrder(order: number): void {
        if (order < 0) {
            throw new Error('Display order must be non-negative');
        }
        this._displayOrder = order;
        this._updatedAt = new Date();
    }

    /**
     * Enable feature
     */
    public enable(): void {
        this._isEnabled = true;
        this._updatedAt = new Date();
    }

    /**
     * Disable feature
     */
    public disable(): void {
        this._isEnabled = false;
        this._updatedAt = new Date();
    }

    /**
     * Highlight feature
     */
    public highlight(): void {
        this._isHighlighted = true;
        this._updatedAt = new Date();
    }

    /**
     * Remove highlight
     */
    public unhighlight(): void {
        this._isHighlighted = false;
        this._updatedAt = new Date();
    }

    /**
     * Check if feature has a limit
     */
    public hasLimit(): boolean {
        return this._featureType === FeatureType.NUMERIC_LIMIT && this._limitValue !== undefined;
    }

    /**
     * Get limit or throw error
     */
    public getLimit(): number {
        if (!this.hasLimit()) {
            throw new Error('Feature does not have a numeric limit');
        }
        return this._limitValue!;
    }

    /**
     * Convert to JSON for API responses
     */
    public toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            planId: this._planId,
            name: this._name,
            description: this._description,
            featureType: this._featureType,
            limitValue: this._limitValue,
            isEnabled: this._isEnabled,
            displayOrder: this._displayOrder,
            isHighlighted: this._isHighlighted,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    /**
     * Create from plain object (for repository)
     */
    public static fromJSON(data: any): Feature {
        return new Feature({
            id: data.id,
            planId: data.planId || data.plan_id,
            name: data.name,
            description: data.description,
            featureType: data.featureType || data.feature_type,
            limitValue: data.limitValue || data.limit_value,
            isEnabled: data.isEnabled !== undefined ? data.isEnabled : data.is_enabled !== undefined ? data.is_enabled : true,
            displayOrder: data.displayOrder || data.display_order || 0,
            isHighlighted: data.isHighlighted !== undefined ? data.isHighlighted : data.is_highlighted !== undefined ? data.is_highlighted : false,
            createdAt: data.createdAt ? new Date(data.createdAt) : data.created_at ? new Date(data.created_at) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : data.updated_at ? new Date(data.updated_at) : new Date(),
        });
    }
}
