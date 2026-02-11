import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { ICreditPackageMapper } from '../../mappers/interfaces/ICreditPackageMapper';
import { IUpdateCreditPackageUseCase } from './interfaaces/IUpdateCreditPackageUseCase';
import { UpdateCreditPackageDTO, CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';
export declare class UpdateCreditPackageUseCase implements IUpdateCreditPackageUseCase {
    private repository;
    private mapper;
    constructor(repository: ICreditPackageRepository, mapper: ICreditPackageMapper);
    execute(id: string, dto: UpdateCreditPackageDTO): Promise<CreditPackageResponseDTO>;
}
//# sourceMappingURL=UpdateCreditPackageUseCase.d.ts.map