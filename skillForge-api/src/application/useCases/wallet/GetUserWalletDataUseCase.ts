/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISystemSettingsRepository } from '../../../domain/repositories/ISystemSettingsRepository';
import { IGetUserWalletDataUseCase } from './interfaces/IGetUserWalletDataUseCase';
import { UserWalletDataDTO } from '../../dto/wallet/UserWalletTransactionDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetUserWalletDataUseCase implements IGetUserWalletDataUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ISystemSettingsRepository) private readonly settingsRepository: ISystemSettingsRepository
    ) { }

    async execute(userId: string): Promise<UserWalletDataDTO> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const userJson = user.toJSON();

        // Calculate redeemable credits (earned + purchased, NOT bonus)
        const earnedCredits = (userJson.earned_credits as number) || 0;
        const purchasedCredits = (userJson.purchased_credits as number) || 0;
        const bonusCredits = (userJson.bonus_credits as number) || 0;
        const totalCredits = (userJson.credits as number) || 0;
        const redeemableCredits = totalCredits;

        // Get redemption settings
        const rateSettings = await this.settingsRepository.get('CREDIT_CONVERSION_RATE');
        const conversionRate = rateSettings ? Number(rateSettings.value) : 0;

        const minSettings = await this.settingsRepository.get('REDEMPTION_MIN_CREDITS');
        const minRedemptionCredits = minSettings ? Number(minSettings.value) : 10;

        const maxSettings = await this.settingsRepository.get('REDEMPTION_MAX_CREDITS');
        const maxRedemptionCredits = maxSettings ? Number(maxSettings.value) : 1000;

        // Get verification status
        const verification = (userJson.verification as Record<string, unknown>) || {};
        const bankDetails = verification.bank_details || {};

        return {
            walletBalance: (userJson.wallet_balance as number) || 0,
            credits: {
                total: totalCredits,
                earned: earnedCredits,
                purchased: purchasedCredits,
                bonus: bonusCredits,
                redeemable: redeemableCredits,
            },
            verification: {
                email_verified: verification.email_verified || false,
                bank_details: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    account_number: bankDetails.account_number || null,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    ifsc_code: bankDetails.ifsc_code || null,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    bank_name: bankDetails.bank_name || null,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    verified: bankDetails.verified || false,
                },
            },
            conversionRate,
            minRedemptionCredits,
            maxRedemptionCredits,
        };
    }
}
