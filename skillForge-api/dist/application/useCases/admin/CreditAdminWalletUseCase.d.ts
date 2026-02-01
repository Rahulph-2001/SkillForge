import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { CreditAdminWalletRequestDTO } from '../../dto/admin/CreditAdminWalletDTO';
import { WalletCreditResponseDTO } from '../../dto/admin/WalletCreditResponseDTO';
import { ICreditAdminWalletUseCase } from './interfaces/ICreditAdminWalletUseCase';
export declare class CreditAdminWalletUseCase implements ICreditAdminWalletUseCase {
    private userRepository;
    private walletTransactionRepository;
    constructor(userRepository: IUserRepository, walletTransactionRepository: IWalletTransactionRepository);
    execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO>;
    private generateDescription;
    private findAdminUser;
}
//# sourceMappingURL=CreditAdminWalletUseCase.d.ts.map