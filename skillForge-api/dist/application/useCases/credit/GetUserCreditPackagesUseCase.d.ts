import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { IGetUserCreditPackagesUseCase } from './interfaaces/IGetUserCreditPackagesUseCase';
import { GetUserCreditPackagesResponseDTO } from '../../dto/credit/GetUserCreditPackagesDTO';
export declare class GetUserCreditPackagesUseCase implements IGetUserCreditPackagesUseCase {
    private readonly creditPackageRepository;
    constructor(creditPackageRepository: ICreditPackageRepository);
    execute(): Promise<GetUserCreditPackagesResponseDTO>;
}
//# sourceMappingURL=GetUserCreditPackagesUseCase.d.ts.map