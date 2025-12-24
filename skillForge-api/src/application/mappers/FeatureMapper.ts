import { FeatureResponseDTO } from '../dto/feature/FeatureResponseDTO';
import { Feature } from '../../domain/entities/Feature';

export class FeatureMapper {
    /**
     * Map Feature entity to FeatureResponseDTO
     */
    static toDTO(feature: Feature): FeatureResponseDTO {
        return {
            id: feature.id,
            planId: feature.planId,
            name: feature.name,
            description: feature.description,
            featureType: feature.featureType,
            limitValue: feature.limitValue,
            isEnabled: feature.isEnabled,
            displayOrder: feature.displayOrder,
            isHighlighted: feature.isHighlighted,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
        };
    }

    /**
     * Map array of Feature entities to DTOs
     */
    static toDTOArray(features: Feature[]): FeatureResponseDTO[] {
        return features.map((feature) => this.toDTO(feature));
    }
}
