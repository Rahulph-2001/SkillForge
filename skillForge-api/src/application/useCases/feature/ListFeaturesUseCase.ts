import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { IListFeaturesUseCase } from './interfaces/IListFeaturesUseCase';

@injectable()
export class ListFeaturesUseCase implements IListFeaturesUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository,
        @inject(TYPES.IFeatureMapper) private featureMapper: IFeatureMapper
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

        return this.featureMapper.toDTOArray(features);
    }
}
