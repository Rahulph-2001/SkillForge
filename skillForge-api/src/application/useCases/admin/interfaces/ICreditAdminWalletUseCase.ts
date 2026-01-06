import { CreditAdminWalletRequestDTO } from '../../../dto/admin/CreditAdminWalletDTO';
import { WalletCreditResponseDTO } from '../../../dto/admin/WalletCreditResponseDTO';

export interface ICreditAdminWalletUseCase {
    execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO>;
}

