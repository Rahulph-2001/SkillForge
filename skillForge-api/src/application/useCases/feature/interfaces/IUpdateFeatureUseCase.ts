import { type UpdateFeatureDTO } from '../../../dto/feature/UpdateFeatureDTO';
import { type FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';

export interface IUpdateFeatureUseCase {
    execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO>;
}

