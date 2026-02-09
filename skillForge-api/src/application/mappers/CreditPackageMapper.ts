import { injectable } from 'inversify';
import { CreditPackage } from '../../domain/entities/CreditPackage';
import { CreditPackageResponseDTO } from '../dto/credit/CreditPackageDTO';
import { ICreditPackageMapper } from './interfaces/ICreditPackageMapper';

@injectable()
export class CreditPackageMapper implements ICreditPackageMapper {
  public toResponseDTO(entity: CreditPackage): CreditPackageResponseDTO {
    return {
      id: entity.id,
      credits: entity.credits,
      price: entity.price,
      isPopular: entity.isPopular,
      isActive: entity.isActive,
      discount: entity.discount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public toResponseDTOs(entities: CreditPackage[]): CreditPackageResponseDTO[] {
    return entities.map(entity => this.toResponseDTO(entity));
  }
}
