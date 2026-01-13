import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { UpdateFeatureDTO } from '../../dto/feature/UpdateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { IUpdateFeatureUseCase } from './interfaces/IUpdateFeatureUseCase';
export declare class UpdateFeatureUseCase implements IUpdateFeatureUseCase {
    private featureRepository;
    private featureMapper;
    constructor(featureRepository: IFeatureRepository, featureMapper: IFeatureMapper);
    execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=UpdateFeatureUseCase.d.ts.map