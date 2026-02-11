import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { ICreditPackageMapper } from '../../mappers/interfaces/ICreditPackageMapper';
import { CreateCreditPackageDTO, CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';
export interface ICreateCreditPackageUseCase {
    execute(dto: CreateCreditPackageDTO): Promise<CreditPackageResponseDTO>;
}
export declare class CreateCreditPackageUseCase implements ICreateCreditPackageUseCase {
    private repository;
    private mapper;
    constructor(repository: ICreditPackageRepository, mapper: ICreditPackageMapper);
    execute(dto: CreateCreditPackageDTO): Promise<CreditPackageResponseDTO>;
}
//# sourceMappingURL=CreateCreditPackageUseCase.d.ts.map