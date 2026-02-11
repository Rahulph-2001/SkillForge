import { CreditPackage } from '../../../domain/entities/CreditPackage';
import { CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';
export interface ICreditPackageMapper {
    toResponseDTO(entity: CreditPackage): CreditPackageResponseDTO;
    toResponseDTOs(entities: CreditPackage[]): CreditPackageResponseDTO[];
}
//# sourceMappingURL=ICreditPackageMapper.d.ts.map