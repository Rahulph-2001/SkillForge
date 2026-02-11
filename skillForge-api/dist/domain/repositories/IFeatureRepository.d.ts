import { Feature } from '../entities/Feature';
export interface IFeatureRepository {
    create(feature: Feature): Promise<Feature>;
    findById(id: string): Promise<Feature | null>;
    findByPlanId(planId: string): Promise<Feature[]>;
    update(feature: Feature): Promise<Feature>;
    delete(id: string): Promise<void>;
    reorderFeatures(planId: string, featureIds: string[]): Promise<void>;
    findHighlightedByPlanId(planId: string): Promise<Feature[]>;
    findLibraryFeatures(filters: {
        search?: string;
        isEnabled?: boolean;
    }, pagination: {
        skip: number;
        take: number;
    }): Promise<{
        features: Feature[];
        total: number;
    }>;
}
//# sourceMappingURL=IFeatureRepository.d.ts.map