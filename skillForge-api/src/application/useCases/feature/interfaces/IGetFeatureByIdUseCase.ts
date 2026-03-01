import { type FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';

export interface IGetFeatureByIdUseCase {
    execute(featureId: string): Promise<FeatureResponseDTO>;
}

