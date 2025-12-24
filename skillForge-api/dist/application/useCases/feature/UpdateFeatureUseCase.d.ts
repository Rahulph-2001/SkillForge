import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { UpdateFeatureDTO } from '../../dto/feature/UpdateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
export interface IUpdateFeatureUseCase {
    execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO>;
}
export declare class UpdateFeatureUseCase implements IUpdateFeatureUseCase {
    private featureRepository;
    constructor(featureRepository: IFeatureRepository);
    execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=UpdateFeatureUseCase.d.ts.map