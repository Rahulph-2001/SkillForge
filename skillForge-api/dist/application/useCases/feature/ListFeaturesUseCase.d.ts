import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { IListFeaturesUseCase, ListFeaturesResult } from './interfaces/IListFeaturesUseCase';
export declare class ListFeaturesUseCase implements IListFeaturesUseCase {
    private featureRepository;
    private featureMapper;
    private paginationService;
    constructor(featureRepository: IFeatureRepository, featureMapper: IFeatureMapper, paginationService: IPaginationService);
    execute(page?: number, limit?: number, search?: string, planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[] | ListFeaturesResult>;
}
//# sourceMappingURL=ListFeaturesUseCase.d.ts.map