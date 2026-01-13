import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { IListFeaturesUseCase } from './interfaces/IListFeaturesUseCase';
export declare class ListFeaturesUseCase implements IListFeaturesUseCase {
    private featureRepository;
    private featureMapper;
    constructor(featureRepository: IFeatureRepository, featureMapper: IFeatureMapper);
    execute(planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[]>;
}
//# sourceMappingURL=ListFeaturesUseCase.d.ts.map