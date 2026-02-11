import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { Feature } from '../../../domain/entities/Feature';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class PrismaFeatureRepository extends BaseRepository<Feature> implements IFeatureRepository {
    constructor(db: Database);
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
//# sourceMappingURL=FeatureRepository.d.ts.map