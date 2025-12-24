import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { Feature } from '../../../domain/entities/Feature';
import { CreateFeatureDTO } from '../../dto/feature/CreateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError, NotFoundError } from '../../../domain/errors/AppError';

export interface ICreateFeatureUseCase {
    execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO>;
}

@injectable()
export class CreateFeatureUseCase implements ICreateFeatureUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository
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

        // Return DTO
        return {
            id: savedFeature.id,
            planId: savedFeature.planId,
            name: savedFeature.name,
            description: savedFeature.description,
            featureType: savedFeature.featureType,
            limitValue: savedFeature.limitValue,
            isEnabled: savedFeature.isEnabled,
            displayOrder: savedFeature.displayOrder,
            isHighlighted: savedFeature.isHighlighted,
            createdAt: savedFeature.createdAt,
            updatedAt: savedFeature.updatedAt,
        };
    }
}
