import { Feature } from '../../../domain/entities/Feature';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';

export interface IFeatureMapper {
  toDTO(feature: Feature): FeatureResponseDTO;
  toDTOArray(features: Feature[]): FeatureResponseDTO[];
}

