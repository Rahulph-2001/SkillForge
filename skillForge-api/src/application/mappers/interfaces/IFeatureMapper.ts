import { type Feature } from '../../../domain/entities/Feature';
import { type FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';

export interface IFeatureMapper {
  toDTO(feature: Feature): FeatureResponseDTO;
  toDTOArray(features: Feature[]): FeatureResponseDTO[];
}

