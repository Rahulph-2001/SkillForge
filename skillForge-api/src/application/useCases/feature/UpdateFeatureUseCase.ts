import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { FeatureMapper } from '../../mappers/FeatureMapper';
import { UpdateFeatureDTO } from '../../dto/feature/UpdateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

export interface IUpdateFeatureUseCase {
    execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO>;
}

@injectable()
export class UpdateFeatureUseCase implements IUpdateFeatureUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository
    ) { }

    async execute(featureId: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO> {
        // Find existing feature
        const feature = await this.featureRepository.findById(featureId);

        if (!feature) {
            throw new NotFoundError('Feature not found');
        }

        // Update feature details if name or description changed
        if (dto.name !== undefined || dto.description !== undefined || dto.limitValue !== undefined || dto.isEnabled !== undefined || dto.isHighlighted !== undefined) {
            const newName = dto.name ?? feature.name;
            const newDescription = dto.description ?? feature.description;
            const newLimit = dto.limitValue ?? (feature.hasLimit() ? feature.getLimit() : undefined);
            const newEnabled = dto.isEnabled ?? feature.isEnabled;
            const newHighlighted = dto.isHighlighted ?? feature.isHighlighted;

            feature.updateDetails(newName, newDescription, newLimit, newEnabled, newHighlighted);
        }

        // Update display order
        if (dto.displayOrder !== undefined) {
            feature.updateDisplayOrder(dto.displayOrder);
        }

        // Update enabled status
        if (dto.isEnabled !== undefined) {
            if (dto.isEnabled) {
                feature.enable();
            } else {
                feature.disable();
            }
        }

        // Update highlighted status
        if (dto.isHighlighted !== undefined) {
            if (dto.isHighlighted) {
                feature.highlight();
            } else {
                feature.unhighlight();
            }
        }

        // Save updated feature
        const updated = await this.featureRepository.update(feature);

        // Map to DTO
        return FeatureMapper.toDTO(updated);
    }
}
