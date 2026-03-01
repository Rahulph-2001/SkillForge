import { type SetRedemptionSettingsDTO } from '../../../../dto/credit/CreditRedemptionDTO';
import { type SystemSettingsResponseDTO } from '../../../../dto/settings/SystemSettingsResponseDTO';

export interface IUpdateRedemptionSettingsUseCase {
    execute(userId: string, data: SetRedemptionSettingsDTO): Promise<SystemSettingsResponseDTO[]>;
}
