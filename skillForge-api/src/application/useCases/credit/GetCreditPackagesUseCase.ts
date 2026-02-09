import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { ICreditPackageMapper } from '../../mappers/interfaces/ICreditPackageMapper';
import { CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IPaginationResult } from '../../../domain/types/IPaginationParams';

export interface IGetCreditPackagesUseCase {
    execute(page: number, limit: number, filters?: { isActive?: boolean }): Promise<IPaginationResult<CreditPackageResponseDTO>>;
}

@injectable()
export class GetCreditPackagesUseCase implements IGetCreditPackagesUseCase {
    constructor(
        @inject(TYPES.ICreditPackageRepository) private repository: ICreditPackageRepository,
        @inject(TYPES.ICreditPackageMapper) private mapper: ICreditPackageMapper,
        @inject(TYPES.IPaginationService) private paginationService: IPaginationService
    ) { }

    async execute(page: number, limit: number, filters?: { isActive?: boolean }): Promise<IPaginationResult<CreditPackageResponseDTO>> {
        const { skip, take } = this.paginationService.createParams(page, limit);
        
        const { data, total } = await this.repository.findPackages(filters, skip, take);
        
        const dtos = this.mapper.toResponseDTOs(data);
        
        return this.paginationService.createResult(dtos, total, page, limit);
    }
}