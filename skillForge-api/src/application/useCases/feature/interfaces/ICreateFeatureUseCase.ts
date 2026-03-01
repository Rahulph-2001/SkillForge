import { type CreateFeatureDTO } from '../../../dto/feature/CreateFeatureDTO';
import { type FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';

export interface ICreateFeatureUseCase {
    execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO>;
}

