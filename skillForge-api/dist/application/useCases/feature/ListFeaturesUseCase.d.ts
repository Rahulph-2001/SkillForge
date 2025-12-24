import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
export interface IListFeaturesUseCase {
    execute(planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[]>;
}
export declare class ListFeaturesUseCase implements IListFeaturesUseCase {
    private featureRepository;
    constructor(featureRepository: IFeatureRepository);
    execute(planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[]>;
}
//# sourceMappingURL=ListFeaturesUseCase.d.ts.map