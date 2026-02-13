import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IUpdateRedemptionSettingsUseCase } from './interfaces/IUpdateRedemptionSettingsUseCase';
import { SetRedemptionSettingsDTO, SetRedemptionSettingsSchema } from '../../../dto/credit/CreditRedemptionDTO';
import { SystemSettingsResponseDTO } from '../../../dto/settings/SystemSettingsResponseDTO';
import { ISystemSettingsRepository } from '../../../../domain/repositories/ISystemSettingsRepository';
import { ISystemSettingsMapper } from '../../../mappers/interfaces/ISystemSettingsMapper';

@injectable()
export class UpdateRedemptionSettingsUseCase implements IUpdateRedemptionSettingsUseCase {
    constructor(
        @inject(TYPES.ISystemSettingsRepository) private readonly settingsRepository: ISystemSettingsRepository,
        @inject(TYPES.ISystemSettingsMapper) private readonly settingsMapper: ISystemSettingsMapper
    ) { }

    async execute(userId: string, data: SetRedemptionSettingsDTO): Promise<SystemSettingsResponseDTO[]> {
        const validatedData = SetRedemptionSettingsSchema.parse(data);
        const results: any[] = [];

        // Update Conversion Rate
        const rateSettings = await this.settingsRepository.set(
            'CREDIT_CONVERSION_RATE',
            validatedData.rate.toString(),
            userId
        );
        results.push(rateSettings);

        // Update Min Credits if provided
        if (validatedData.minCredits !== undefined) {
            const minSettings = await this.settingsRepository.set(
                'REDEMPTION_MIN_CREDITS',
                validatedData.minCredits.toString(),
                userId
            );
            results.push(minSettings);
        }

        // Update Max Credits if provided
        if (validatedData.maxCredits !== undefined) {
            const maxSettings = await this.settingsRepository.set(
                'REDEMPTION_MAX_CREDITS',
                validatedData.maxCredits.toString(),
                userId
            );
            results.push(maxSettings);
        }

        return results.map(s => this.settingsMapper.toResponseDTO(s));
    }
}
