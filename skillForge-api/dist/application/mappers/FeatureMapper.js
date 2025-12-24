"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureMapper = void 0;
class FeatureMapper {
    /**
     * Map Feature entity to FeatureResponseDTO
     */
    static toDTO(feature) {
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
    static toDTOArray(features) {
        return features.map((feature) => this.toDTO(feature));
    }
}
exports.FeatureMapper = FeatureMapper;
//# sourceMappingURL=FeatureMapper.js.map