import { FeatureResponseDTO } from '../dto/feature/FeatureResponseDTO';
import { Feature } from '../../domain/entities/Feature';
import { IFeatureMapper } from './interfaces/IFeatureMapper';
export declare class FeatureMapper implements IFeatureMapper {
    /**
     * Map Feature entity to FeatureResponseDTO
     */
    toDTO(feature: Feature): FeatureResponseDTO;
    /**
     * Map array of Feature entities to DTOs
     */
    toDTOArray(features: Feature[]): FeatureResponseDTO[];
}
//# sourceMappingURL=FeatureMapper.d.ts.map