import { UpdateFeatureDTO } from '../../../dto/feature/UpdateFeatureDTO';
import { FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';

export interface IUpdateFeatureUseCase {
    execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO>;
}

