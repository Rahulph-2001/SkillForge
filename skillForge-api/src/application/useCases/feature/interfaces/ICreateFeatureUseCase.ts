import { CreateFeatureDTO } from '../../../dto/feature/CreateFeatureDTO';
import { FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';

export interface ICreateFeatureUseCase {
    execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO>;
}

