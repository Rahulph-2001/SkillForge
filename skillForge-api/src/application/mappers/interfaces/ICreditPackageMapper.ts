import { type CreditPackage } from '../../../domain/entities/CreditPackage';
import { type CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';

export interface ICreditPackageMapper {
  toResponseDTO(entity: CreditPackage): CreditPackageResponseDTO;
  toResponseDTOs(entities: CreditPackage[]): CreditPackageResponseDTO[];
}
