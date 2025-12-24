import { FeatureResponseDTO } from '../dto/feature/FeatureResponseDTO';
import { Feature } from '../../domain/entities/Feature';
export declare class FeatureMapper {
    /**
     * Map Feature entity to FeatureResponseDTO
     */
    static toDTO(feature: Feature): FeatureResponseDTO;
    /**
     * Map array of Feature entities to DTOs
     */
    static toDTOArray(features: Feature[]): FeatureResponseDTO[];
}
//# sourceMappingURL=FeatureMapper.d.ts.map