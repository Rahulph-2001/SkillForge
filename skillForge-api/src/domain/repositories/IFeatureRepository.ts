import { Feature } from '../entities/Feature';

export interface IFeatureRepository {
    /**
     * Create a new feature
     */
    create(feature: Feature): Promise<Feature>;

    /**
     * Find feature by ID
     */
    findById(id: string): Promise<Feature | null>;

    /**
     * Find all features for a plan
     */
    findByPlanId(planId: string): Promise<Feature[]>;

    /**
     * Update feature
     */
    update(feature: Feature): Promise<Feature>;

    /**
     * Delete feature
     */
    delete(id: string): Promise<void>;

    /**
     * Reorder features for a plan
     */
    reorderFeatures(planId: string, featureIds: string[]): Promise<void>;

    /**
     * Find highlighted features for a plan
     */
    findHighlightedByPlanId(planId: string): Promise<Feature[]>;

    /**
     * Find all features that are not assigned to any plan (Master Library)
     */
    findLibraryFeatures(): Promise<Feature[]>;
}
