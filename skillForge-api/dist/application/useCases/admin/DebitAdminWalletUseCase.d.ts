import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { DebitAdminWalletRequestDTO } from '../../dto/admin/DebitAdminWalletDTO';
import { WalletDebitResponseDTO } from '../../dto/admin/WalletDebitResponseDTO';
import { IDebitAdminWalletUseCase } from './interfaces/IDebitAdminWalletUseCase';
export declare class DebitAdminWalletUseCase implements IDebitAdminWalletUseCase {
    private userRepository;
    private walletTransactionRepository;
    constructor(userRepository: IUserRepository, walletTransactionRepository: IWalletTransactionRepository);
    execute(dto: DebitAdminWalletRequestDTO): Promise<WalletDebitResponseDTO>;
    private generateDescription;
    private findAdminUser;
}
//# sourceMappingURL=DebitAdminWalletUseCase.d.ts.map