import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IGetRedemptionSettingsUseCase } from './interfaces/IGetRedemptionSettingsUseCase';
import { ISystemSettingsRepository } from '../../../../domain/repositories/ISystemSettingsRepository';
import { RedemptionSettingsResponseDTO } from '../../../dto/credit/CreditRedemptionDTO';

@injectable()
export class GetRedemptionSettingsUseCase implements IGetRedemptionSettingsUseCase {
    constructor(
        @inject(TYPES.ISystemSettingsRepository) private readonly settingsRepository: ISystemSettingsRepository
    ) { }

    async execute(): Promise<RedemptionSettingsResponseDTO> {
        const rateSettings = await this.settingsRepository.get('CREDIT_CONVERSION_RATE');
        const minSettings = await this.settingsRepository.get('REDEMPTION_MIN_CREDITS');
        const maxSettings = await this.settingsRepository.get('REDEMPTION_MAX_CREDITS');

        return {
            rate: rateSettings ? Number(rateSettings.value) : 0,
            minCredits: minSettings ? Number(minSettings.value) : 10,
            maxCredits: maxSettings ? Number(maxSettings.value) : 1000,
        };
    }
}
