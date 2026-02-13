import { RedemptionSettingsResponseDTO } from '../../../../dto/credit/CreditRedemptionDTO';

export interface IGetRedemptionSettingsUseCase {
    execute(): Promise<RedemptionSettingsResponseDTO>;
}
