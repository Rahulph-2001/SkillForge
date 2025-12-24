"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlan = void 0;
class SubscriptionPlan {
    constructor(id, name, price, projectPosts, createCommunity, features, badge, color, isActive = true, createdAt, updatedAt, trialDays = 0) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._projectPosts = projectPosts;
        this._createCommunity = createCommunity;
        this._features = features;
        this._badge = badge;
        this._color = color;
        this._isActive = isActive;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
        this._trialDays = trialDays;
        this.validate();
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get price() {
        return this._price;
    }
    get projectPosts() {
        return this._projectPosts;
    }
    get createCommunity() {
        return this._createCommunity;
    }
    get features() {
        return [...this._features];
    }
    get badge() {
        return this._badge;
    }
    get color() {
        return this._color;
    }
    get isActive() {
        return this._isActive;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get trialDays() {
        return this._trialDays;
    }
    /**
     * Validate subscription plan business rules
     */
    validate() {
        // Rule 1: Name must not be empty
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Plan name cannot be empty');
        }
        // Rule 2: Price must be non-negative
        if (this._price < 0) {
            throw new Error('Plan price cannot be negative');
        }
        // Rule 3: Free plan must have price = 0
        if (this._badge === 'Free' && this._price !== 0) {
            throw new Error('Free plan must have price of 0');
        }
        // Rule 4: Paid plans must have price > 0
        if (this._badge !== 'Free' && this._price === 0) {
            throw new Error('Paid plans must have a price greater than 0');
        }
        // Rule 5: Project/Community posts validation
        if (this._projectPosts !== null && this._projectPosts < -1) {
            throw new Error('Project posts must be null (unlimited), -1 (unlimited), or >= 0');
        }
        if (this._createCommunity !== null && this._createCommunity < -1) {
            throw new Error('Community posts must be null (unlimited), -1 (unlimited), or >= 0');
        }
        // Rule 6: Features must not have empty names
        this._features.forEach((feature, index) => {
            if (!feature.name || feature.name.trim().length === 0) {
                throw new Error(`Feature at index ${index} has an empty name`);
            }
        });
    }
    /**
     * Update plan details
     */
    updateDetails(name, price, projectPosts, createCommunity, badge, color) {
        this._name = name;
        this._price = price;
        this._projectPosts = projectPosts;
        this._createCommunity = createCommunity;
        this._badge = badge;
        this._color = color;
        this._updatedAt = new Date();
        this.validate();
    }
    /**
     * Add a new feature to the plan
     */
    addFeature(feature) {
        if (!feature.name || feature.name.trim().length === 0) {
            throw new Error('Feature name cannot be empty');
        }
        // Check for duplicate feature names
        const exists = this._features.some(f => f.name.toLowerCase() === feature.name.toLowerCase());
        if (exists) {
            throw new Error('Feature with this name already exists');
        }
        this._features.push(feature);
        this._updatedAt = new Date();
    }
    /**
     * Remove a feature from the plan
     */
    removeFeature(featureId) {
        const initialLength = this._features.length;
        this._features = this._features.filter(f => f.id !== featureId);
        if (this._features.length === initialLength) {
            throw new Error('Feature not found');
        }
        this._updatedAt = new Date();
    }
    /**
     * Update a feature
     */
    updateFeature(featureId, updates) {
        const feature = this._features.find(f => f.id === featureId);
        if (!feature) {
            throw new Error('Feature not found');
        }
        if (updates.name !== undefined) {
            if (!updates.name || updates.name.trim().length === 0) {
                throw new Error('Feature name cannot be empty');
            }
            feature.name = updates.name.trim();
        }
        // Update other properties if provided
        if (updates.description !== undefined)
            feature.description = updates.description;
        if (updates.featureType !== undefined)
            feature.featureType = updates.featureType;
        if (updates.limitValue !== undefined)
            feature.limitValue = updates.limitValue;
        if (updates.isEnabled !== undefined)
            feature.isEnabled = updates.isEnabled;
        if (updates.displayOrder !== undefined)
            feature.displayOrder = updates.displayOrder;
        if (updates.isHighlighted !== undefined)
            feature.isHighlighted = updates.isHighlighted;
        this._updatedAt = new Date();
    }
    /**
     * Set all features at once (useful for updates)
     */
    setFeatures(features) {
        this._features = features;
        this._updatedAt = new Date();
        this.validate();
    }
    /**
     * Activate the plan
     */
    activate() {
        if (this._isActive) {
            throw new Error('Plan is already active');
        }
        this._isActive = true;
        this._updatedAt = new Date();
    }
    /**
     * Deactivate the plan
     */
    deactivate() {
        if (!this._isActive) {
            throw new Error('Plan is already inactive');
        }
        this._isActive = false;
        this._updatedAt = new Date();
    }
    /**
     * Check if plan allows unlimited project posts
     */
    hasUnlimitedProjectPosts() {
        return this._projectPosts === null || this._projectPosts === -1;
    }
    /**
     * Check if plan allows unlimited community posts
     */
    hasUnlimitedCommunityPosts() {
        return this._createCommunity === null || this._createCommunity === -1;
    }
    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            price: this._price,
            projectPosts: this._projectPosts,
            createCommunity: this._createCommunity,
            features: this._features,
            badge: this._badge,
            color: this._color,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
    /**
     * Create from plain object (for repository)
     */
    static fromJSON(data) {
        return new SubscriptionPlan(data.id || data._id?.toString(), data.name, data.price, data.projectPosts ?? data.project_posts, data.createCommunity ?? data.create_community, data.features || [], data.badge, data.color, data.isActive ?? data.is_active ?? true, data.createdAt ? new Date(data.createdAt) : new Date(data.created_at), data.updatedAt ? new Date(data.updatedAt) : new Date(data.updated_at), data.trialDays ?? data.trial_days ?? 0);
    }
}
exports.SubscriptionPlan = SubscriptionPlan;
//# sourceMappingURL=SubscriptionPlan.js.map