import { DebitAdminWalletRequestDTO } from '../../../dto/admin/DebitAdminWalletDTO';
import { WalletDebitResponseDTO } from '../../../dto/admin/WalletDebitResponseDTO';

export interface IDebitAdminWalletUseCase {
    execute(dto: DebitAdminWalletRequestDTO): Promise<WalletDebitResponseDTO>;
}
