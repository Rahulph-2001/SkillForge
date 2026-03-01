import { type DebitAdminWalletRequestDTO } from '../../../dto/admin/DebitAdminWalletDTO';
import { type WalletDebitResponseDTO } from '../../../dto/admin/WalletDebitResponseDTO';

export interface IDebitAdminWalletUseCase {
    execute(dto: DebitAdminWalletRequestDTO): Promise<WalletDebitResponseDTO>;
}
