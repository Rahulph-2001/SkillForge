import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { FeatureMapper } from '../../mappers/FeatureMapper';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';

export interface IListFeaturesUseCase {
    execute(planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[]>;
}

@injectable()
export class ListFeaturesUseCase implements IListFeaturesUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository
    ) { }

    async execute(planId?: string, highlightedOnly: boolean = false): Promise<FeatureResponseDTO[]> {
        let features;

        if (planId) {
            if (highlightedOnly) {
                features = await this.featureRepository.findHighlightedByPlanId(planId);
            } else {
                features = await this.featureRepository.findByPlanId(planId);
            }
        } else {
            // Fetch library features (master features)
            features = await this.featureRepository.findLibraryFeatures();
        }

        return FeatureMapper.toDTOArray(features);
    }
}
