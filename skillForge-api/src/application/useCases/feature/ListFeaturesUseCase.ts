import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { IListFeaturesUseCase, ListFeaturesResult } from './interfaces/IListFeaturesUseCase';

@injectable()
export class ListFeaturesUseCase implements IListFeaturesUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository,
        @inject(TYPES.IFeatureMapper) private featureMapper: IFeatureMapper,
        @inject(TYPES.IPaginationService) private paginationService: IPaginationService
    ) { }

    async execute(
        page?: number,
        limit?: number,
        search?: string,
        planId?: string,
        highlightedOnly: boolean = false
    ): Promise<FeatureResponseDTO[] | ListFeaturesResult> {
        // If planId is provided, use old non-paginated approach
        if (planId) {
            let features;
            if (highlightedOnly) {
                features = await this.featureRepository.findHighlightedByPlanId(planId);
            } else {
                features = await this.featureRepository.findByPlanId(planId);
            }
            return this.featureMapper.toDTOArray(features);
        }

        // For library features, use pagination
        const paginationParams = this.paginationService.createParams(page || 1, limit || 10);

        const { features, total } = await this.featureRepository.findLibraryFeatures(
            { search },
            paginationParams
        );

        const featureDTOs = this.featureMapper.toDTOArray(features);
        const paginationResult = this.paginationService.createResult(
            featureDTOs,
            total,
            page || 1,
            limit || 10
        );

        return {
            features: featureDTOs,
            pagination: {
                total: paginationResult.total,
                page: paginationResult.page,
                limit: paginationResult.limit,
                totalPages: paginationResult.totalPages,
                hasNextPage: paginationResult.hasNextPage,
                hasPreviousPage: paginationResult.hasPreviousPage,
            },
        };
    }
}