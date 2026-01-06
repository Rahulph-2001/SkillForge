import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetFeatureByIdUseCase } from './interfaces/IGetFeatureByIdUseCase';

@injectable()
export class GetFeatureByIdUseCase implements IGetFeatureByIdUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository,
        @inject(TYPES.IFeatureMapper) private featureMapper: IFeatureMapper
    ) { }

    async execute(featureId: string): Promise<FeatureResponseDTO> {
        const feature = await this.featureRepository.findById(featureId);

        if (!feature) {
            throw new NotFoundError('Feature not found');
        }

        return this.featureMapper.toDTO(feature);
    }
}
