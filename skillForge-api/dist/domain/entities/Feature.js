"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const SubscriptionEnums_1 = require("../enums/SubscriptionEnums");
class Feature {
    constructor(props) {
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
    get id() {
        return this._id;
    }
    get planId() {
        return this._planId;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get featureType() {
        return this._featureType;
    }
    get limitValue() {
        return this._limitValue;
    }
    get isEnabled() {
        return this._isEnabled;
    }
    get displayOrder() {
        return this._displayOrder;
    }
    get isHighlighted() {
        return this._isHighlighted;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    /**
     * Validate feature business rules
     */
    validate() {
        // Rule 1: Name cannot be empty
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Feature name cannot be empty');
        }
        // Rule 2: NUMERIC_LIMIT must have a limit value
        if (this._featureType === SubscriptionEnums_1.FeatureType.NUMERIC_LIMIT && this._limitValue === undefined) {
            throw new Error('NUMERIC_LIMIT feature must have a limit value');
        }
        // Rule 3: NUMERIC_LIMIT value must be positive
        if (this._featureType === SubscriptionEnums_1.FeatureType.NUMERIC_LIMIT && this._limitValue !== undefined && this._limitValue < 0) {
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
    updateDetails(name, description, limitValue, isEnabled, isHighlighted) {
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
    updateDisplayOrder(order) {
        if (order < 0) {
            throw new Error('Display order must be non-negative');
        }
        this._displayOrder = order;
        this._updatedAt = new Date();
    }
    /**
     * Enable feature
     */
    enable() {
        this._isEnabled = true;
        this._updatedAt = new Date();
    }
    /**
     * Disable feature
     */
    disable() {
        this._isEnabled = false;
        this._updatedAt = new Date();
    }
    /**
     * Highlight feature
     */
    highlight() {
        this._isHighlighted = true;
        this._updatedAt = new Date();
    }
    /**
     * Remove highlight
     */
    unhighlight() {
        this._isHighlighted = false;
        this._updatedAt = new Date();
    }
    /**
     * Check if feature has a limit
     */
    hasLimit() {
        return this._featureType === SubscriptionEnums_1.FeatureType.NUMERIC_LIMIT && this._limitValue !== undefined;
    }
    /**
     * Get limit or throw error
     */
    getLimit() {
        if (!this.hasLimit()) {
            throw new Error('Feature does not have a numeric limit');
        }
        return this._limitValue;
    }
    /**
     * Convert to JSON for API responses
     */
    toJSON() {
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
    static fromJSON(data) {
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
exports.Feature = Feature;
//# sourceMappingURL=Feature.js.map