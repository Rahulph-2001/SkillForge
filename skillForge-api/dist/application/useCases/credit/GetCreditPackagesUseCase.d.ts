import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { ICreditPackageMapper } from '../../mappers/interfaces/ICreditPackageMapper';
import { CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IPaginationResult } from '../../../domain/types/IPaginationParams';
export interface IGetCreditPackagesUseCase {
    execute(page: number, limit: number, filters?: {
        isActive?: boolean;
    }): Promise<IPaginationResult<CreditPackageResponseDTO>>;
}
export declare class GetCreditPackagesUseCase implements IGetCreditPackagesUseCase {
    private repository;
    private mapper;
    private paginationService;
    constructor(repository: ICreditPackageRepository, mapper: ICreditPackageMapper, paginationService: IPaginationService);
    execute(page: number, limit: number, filters?: {
        isActive?: boolean;
    }): Promise<IPaginationResult<CreditPackageResponseDTO>>;
}
//# sourceMappingURL=GetCreditPackagesUseCase.d.ts.map