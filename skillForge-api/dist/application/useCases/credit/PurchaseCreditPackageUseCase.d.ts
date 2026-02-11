import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IPurchaseCreditPackageUseCase } from './interfaaces/IPurchaseCreditPackageUseCase';
import { PurchaseCreditPackageRequestDTO, PurchaseCreditPackageResponseDTO } from '../../dto/credit/PurchaseCreditPackageDTO';
export declare class PurchaseCreditPackageUseCase implements IPurchaseCreditPackageUseCase {
    private readonly creditPackageRepository;
    private readonly userRepository;
    private readonly transactionRepository;
    constructor(creditPackageRepository: ICreditPackageRepository, userRepository: IUserRepository, transactionRepository: IUserWalletTransactionRepository);
    execute(request: PurchaseCreditPackageRequestDTO): Promise<PurchaseCreditPackageResponseDTO>;
}
//# sourceMappingURL=PurchaseCreditPackageUseCase.d.ts.map