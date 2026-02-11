import { CreditPackage } from '../../domain/entities/CreditPackage';
import { CreditPackageResponseDTO } from '../dto/credit/CreditPackageDTO';
import { ICreditPackageMapper } from './interfaces/ICreditPackageMapper';
export declare class CreditPackageMapper implements ICreditPackageMapper {
    toResponseDTO(entity: CreditPackage): CreditPackageResponseDTO;
    toResponseDTOs(entities: CreditPackage[]): CreditPackageResponseDTO[];
}
//# sourceMappingURL=CreditPackageMapper.d.ts.map