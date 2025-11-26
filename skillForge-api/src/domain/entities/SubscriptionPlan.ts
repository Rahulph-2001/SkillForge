

export interface SubscriptionFeature {
  id: string;
  name: string;
}

export type PlanBadge = 'Free' | 'Starter' | 'Professional' | 'Enterprise';

export class SubscriptionPlan {
  private _id: string;
  private _name: string;
  private _price: number;
  private _projectPosts: number | null; 
  private _communityPosts: number | null; 
  private _features: SubscriptionFeature[];
  private _badge: PlanBadge;
  private _color: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    price: number,
    projectPosts: number | null,
    communityPosts: number | null,
    features: SubscriptionFeature[],
    badge: PlanBadge,
    color: string,
    isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._projectPosts = projectPosts;
    this._communityPosts = communityPosts;
    this._features = features;
    this._badge = badge;
    this._color = color;
    this._isActive = isActive;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();

    this.validate();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get projectPosts(): number | null {
    return this._projectPosts;
  }

  get communityPosts(): number | null {
    return this._communityPosts;
  }

  get features(): SubscriptionFeature[] {
    return [...this._features];
  }

  get badge(): PlanBadge {
    return this._badge;
  }

  get color(): string {
    return this._color;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Validate subscription plan business rules
   */
  private validate(): void {
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

    if (this._communityPosts !== null && this._communityPosts < -1) {
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
  public updateDetails(
    name: string,
    price: number,
    projectPosts: number | null,
    communityPosts: number | null,
    badge: PlanBadge,
    color: string
  ): void {
    this._name = name;
    this._price = price;
    this._projectPosts = projectPosts;
    this._communityPosts = communityPosts;
    this._badge = badge;
    this._color = color;
    this._updatedAt = new Date();
    
    this.validate();
  }

  /**
   * Add a new feature to the plan
   */
  public addFeature(id: string, name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Feature name cannot be empty');
    }

    // Check for duplicate feature names
    const exists = this._features.some(f => f.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw new Error('Feature with this name already exists');
    }

    this._features.push({ id, name: name.trim() });
    this._updatedAt = new Date();
  }

  /**
   * Remove a feature from the plan
   */
  public removeFeature(featureId: string): void {
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
  public updateFeature(featureId: string, newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Feature name cannot be empty');
    }

    const feature = this._features.find(f => f.id === featureId);
    if (!feature) {
      throw new Error('Feature not found');
    }

    feature.name = newName.trim();
    this._updatedAt = new Date();
  }

  /**
   * Set all features at once (useful for updates)
   */
  public setFeatures(features: SubscriptionFeature[]): void {
    this._features = features;
    this._updatedAt = new Date();
    this.validate();
  }

  /**
   * Activate the plan
   */
  public activate(): void {
    if (this._isActive) {
      throw new Error('Plan is already active');
    }
    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Deactivate the plan
   */
  public deactivate(): void {
    if (!this._isActive) {
      throw new Error('Plan is already inactive');
    }
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Check if plan allows unlimited project posts
   */
  public hasUnlimitedProjectPosts(): boolean {
    return this._projectPosts === null || this._projectPosts === -1;
  }

  /**
   * Check if plan allows unlimited community posts
   */
  public hasUnlimitedCommunityPosts(): boolean {
    return this._communityPosts === null || this._communityPosts === -1;
  }

  /**
   * Convert to JSON for API responses
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      price: this._price,
      projectPosts: this._projectPosts,
      communityPosts: this._communityPosts,
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
  public static fromJSON(data: any): SubscriptionPlan {
    return new SubscriptionPlan(
      data.id || data._id?.toString(),
      data.name,
      data.price,
      data.projectPosts,
      data.communityPosts,
      data.features || [],
      data.badge,
      data.color,
      data.isActive !== undefined ? data.isActive : true,
      data.createdAt ? new Date(data.createdAt) : undefined,
      data.updatedAt ? new Date(data.updatedAt) : undefined
    );
  }
}
