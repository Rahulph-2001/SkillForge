import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetUserWalletDataUseCase } from './interfaces/IGetUserWalletDataUseCase';
import { UserWalletDataDTO } from '../../dto/wallet/UserWalletTransactionDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class GetUserWalletDataUseCase implements IGetUserWalletDataUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
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
        const redeemableCredits = earnedCredits + purchasedCredits;

        // Get verification status
        const verification = userJson.verification as any || {};
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
                bank_verified: bankDetails.verified || false,
            },
        };
    }
}
