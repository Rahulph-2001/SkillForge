import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { CreditAdminWalletRequestDTO } from '../../dto/admin/CreditAdminWalletDTO';
import { WalletCreditResponseDTO } from '../../dto/admin/WalletCreditResponseDTO';
import { ICreditAdminWalletUseCase } from './interfaces/ICreditAdminWalletUseCase';
export declare class CreditAdminWalletUseCase implements ICreditAdminWalletUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO>;
    /**
     * Find the first admin user in the system
     * TODO: In future, implement a dedicated admin wallet system
     */
    private findAdminUser;
}
//# sourceMappingURL=CreditAdminWalletUseCase.d.ts.map