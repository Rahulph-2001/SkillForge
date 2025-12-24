import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { FeatureMapper } from '../../mappers/FeatureMapper';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

export interface IGetFeatureByIdUseCase {
    execute(featureId: string): Promise<FeatureResponseDTO>;
}

@injectable()
export class GetFeatureByIdUseCase implements IGetFeatureByIdUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository
    ) { }

    async execute(featureId: string): Promise<FeatureResponseDTO> {
        const feature = await this.featureRepository.findById(featureId);

        if (!feature) {
            throw new NotFoundError('Feature not found');
        }

        return FeatureMapper.toDTO(feature);
    }
}
