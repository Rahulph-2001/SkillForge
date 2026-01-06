import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { Feature } from '../../../domain/entities/Feature';
import { CreateFeatureDTO } from '../../dto/feature/CreateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError, NotFoundError } from '../../../domain/errors/AppError';
import { ICreateFeatureUseCase } from './interfaces/ICreateFeatureUseCase';

@injectable()
export class CreateFeatureUseCase implements ICreateFeatureUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository,
        @inject(TYPES.IFeatureMapper) private featureMapper: IFeatureMapper
    ) { }

    async execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO> {
        // Create feature entity
        const feature = new Feature({
            id: uuidv4(),
            planId: dto.planId,
            name: dto.name,
            description: dto.description,
            featureType: dto.featureType,
            limitValue: dto.limitValue,
            isEnabled: dto.isEnabled ?? true,
            displayOrder: dto.displayOrder ?? 0,
            isHighlighted: dto.isHighlighted ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save to database
        const savedFeature = await this.featureRepository.create(feature);

        // Return DTO using mapper
        return this.featureMapper.toDTO(savedFeature);
    }
}
