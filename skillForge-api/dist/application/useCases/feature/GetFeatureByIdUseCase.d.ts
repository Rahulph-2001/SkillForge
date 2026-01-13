import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { IGetFeatureByIdUseCase } from './interfaces/IGetFeatureByIdUseCase';
export declare class GetFeatureByIdUseCase implements IGetFeatureByIdUseCase {
    private featureRepository;
    private featureMapper;
    constructor(featureRepository: IFeatureRepository, featureMapper: IFeatureMapper);
    execute(featureId: string): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=GetFeatureByIdUseCase.d.ts.map