import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IGetWalletInfoUseCase } from './interfaces/IGetWalletInfoUseCase';
import { WalletInfoResponseDTO } from '../../../dto/credit/CreditRedemptionDTO';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { ISystemSettingsRepository } from '../../../../domain/repositories/ISystemSettingsRepository';
import { NotFoundError } from '../../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../../config/messages';

@injectable()
export class GetWalletInfoUseCase implements IGetWalletInfoUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ISystemSettingsRepository) private readonly settingsRepository: ISystemSettingsRepository
    ) { }

    async execute(userId: string): Promise<WalletInfoResponseDTO> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
        }

        const settings = await this.settingsRepository.get('CREDIT_CONVERSION_RATE');
        const conversionRate = settings ? Number(settings.value) : 0;

        const minSettings = await this.settingsRepository.get('REDEMPTION_MIN_CREDITS');
        const minRedemptionCredits = minSettings ? Number(minSettings.value) : 10;

        const maxSettings = await this.settingsRepository.get('REDEMPTION_MAX_CREDITS');
        const maxRedemptionCredits = maxSettings ? Number(maxSettings.value) : 1000;

        // Calculate redeemable value
        const redeemableCredits = user.credits;
        const estimatedValue = redeemableCredits * conversionRate;

        return {
            credits: {
                total: user.credits,
                earned: user.earnedCredits,
                purchased: user.purchasedCredits,
                redeemable: user.credits,
            },
            walletBalance: user.walletBalance,
            conversionRate: conversionRate,
            minRedemptionCredits: minRedemptionCredits,
            maxRedemptionCredits: maxRedemptionCredits,
            estimatedRedemptionValue: estimatedValue,
            verification: {
                email_verified: user.verification.email_verified,
                bank_details: {
                    account_number: user.verification.bank_details.account_number,
                    ifsc_code: user.verification.bank_details.ifsc_code,
                    bank_name: user.verification.bank_details.bank_name,
                    verified: user.verification.bank_details.verified,
                },
            },
        };
    }
}
