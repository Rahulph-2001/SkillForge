import { RedeemCreditsDTO, WalletInfoResponseDTO } from '../../../../dto/credit/CreditRedemptionDTO';

export interface IRedeemCreditsUseCase {
    execute(userId: string, data: RedeemCreditsDTO): Promise<WalletInfoResponseDTO>;
}
