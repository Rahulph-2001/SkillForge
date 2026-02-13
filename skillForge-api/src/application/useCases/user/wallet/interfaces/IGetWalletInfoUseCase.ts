import { WalletInfoResponseDTO } from '../../../../dto/credit/CreditRedemptionDTO';

export interface IGetWalletInfoUseCase {
    execute(userId: string): Promise<WalletInfoResponseDTO>;
}
