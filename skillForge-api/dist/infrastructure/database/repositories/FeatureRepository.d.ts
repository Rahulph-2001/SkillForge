import { PrismaClient } from '@prisma/client';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { Feature } from '../../../domain/entities/Feature';
export declare class PrismaFeatureRepository implements IFeatureRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(feature: Feature): Promise<Feature>;
    findById(id: string): Promise<Feature | null>;
    findByPlanId(planId: string): Promise<Feature[]>;
    update(feature: Feature): Promise<Feature>;
    delete(id: string): Promise<void>;
    reorderFeatures(planId: string, featureIds: string[]): Promise<void>;
    findHighlightedByPlanId(planId: string): Promise<Feature[]>;
    findLibraryFeatures(): Promise<Feature[]>;
}
//# sourceMappingURL=FeatureRepository.d.ts.map