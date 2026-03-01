import { type CreditAdminWalletRequestDTO } from '../../../dto/admin/CreditAdminWalletDTO';
import { type WalletCreditResponseDTO } from '../../../dto/admin/WalletCreditResponseDTO';

export interface ICreditAdminWalletUseCase {
    execute(dto: CreditAdminWalletRequestDTO): Promise<WalletCreditResponseDTO>;
}

