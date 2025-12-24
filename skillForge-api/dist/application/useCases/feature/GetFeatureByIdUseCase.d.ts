import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
export interface IGetFeatureByIdUseCase {
    execute(featureId: string): Promise<FeatureResponseDTO>;
}
export declare class GetFeatureByIdUseCase implements IGetFeatureByIdUseCase {
    private featureRepository;
    constructor(featureRepository: IFeatureRepository);
    execute(featureId: string): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=GetFeatureByIdUseCase.d.ts.map