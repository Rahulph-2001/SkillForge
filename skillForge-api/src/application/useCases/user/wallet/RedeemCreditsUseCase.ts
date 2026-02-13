import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IRedeemCreditsUseCase } from './interfaces/IRedeemCreditsUseCase';
import { RedeemCreditsDTO, RedeemCreditsSchema, WalletInfoResponseDTO } from '../../../dto/credit/CreditRedemptionDTO';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { ISystemSettingsRepository } from '../../../../domain/repositories/ISystemSettingsRepository';
import { IUserWalletTransactionRepository } from '../../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../../domain/entities/UserWalletTransaction';
import { NotFoundError, ValidationError } from '../../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../../config/messages';
import { Database } from '../../../../infrastructure/database/Database';
import { IGetWalletInfoUseCase } from './interfaces/IGetWalletInfoUseCase';

@injectable()
export class RedeemCreditsUseCase implements IRedeemCreditsUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ISystemSettingsRepository) private readonly settingsRepository: ISystemSettingsRepository,
        @inject(TYPES.IUserWalletTransactionRepository) private readonly transactionRepository: IUserWalletTransactionRepository,
        @inject(TYPES.IGetWalletInfoUseCase) private readonly getWalletInfoUseCase: IGetWalletInfoUseCase,
        @inject(TYPES.Database) private readonly db: Database
    ) { }

    async execute(userId: string, data: RedeemCreditsDTO): Promise<WalletInfoResponseDTO> {
        const validatedData = RedeemCreditsSchema.parse(data);
        const creditsToRedeem = validatedData.creditsToRedeem;

        // Use Prisma transaction for atomicity
        await this.db.getClient().$transaction(async (tx) => {
            // 1. Fetch User (with locking if possible, but optimistic concurrency is default in Prisma)
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
            }

            // 2. Validate Credits
            if (user.credits < creditsToRedeem) {
                throw new ValidationError('Insufficient credits to redeem');
            }

            // 3. Fetch Conversion Rate & Limits
            const rateSettings = await (tx as any).systemSettings.findUnique({ where: { key: 'CREDIT_CONVERSION_RATE' } });
            if (!rateSettings) {
                throw new Error('Credit conversion rate not set by admin');
            }
            const conversionRate = Number(rateSettings.value);
            if (conversionRate <= 0) {
                throw new Error('Credit conversion rate is invalid');
            }

            const minSettings = await (tx as any).systemSettings.findUnique({ where: { key: 'REDEMPTION_MIN_CREDITS' } });
            const minCredits = minSettings ? Number(minSettings.value) : 10;

            const maxSettings = await (tx as any).systemSettings.findUnique({ where: { key: 'REDEMPTION_MAX_CREDITS' } });
            const maxCredits = maxSettings ? Number(maxSettings.value) : 1000;

            if (creditsToRedeem < minCredits) {
                throw new ValidationError(`Minimum redemption is ${minCredits} credits`);
            }

            if (creditsToRedeem > maxCredits) {
                throw new ValidationError(`Maximum redemption is ${maxCredits} credits`);
            }

            const redemptionValue = creditsToRedeem * conversionRate;

            // 4. Determine Credit Deductions (Priority: Earned -> Purchased)
            // Note: This logic assumes 'credits' is the total.
            // We need to deduct from earned/purchased counters separately if we want to track them accurately.
            // If user.credits is sum of earned + purchased + bonus, we need to balance them.

            let remainingToDeduct = creditsToRedeem;
            let earnedDeduction = 0;
            let purchasedDeduction = 0;
            let bonusDeduction = 0;

            // Deduct from Earned
            if (user.earnedCredits > 0) {
                const deduction = Math.min(user.earnedCredits, remainingToDeduct);
                earnedDeduction = deduction;
                remainingToDeduct -= deduction;
            }

            // Deduct from Purchased (if needed)
            if (remainingToDeduct > 0 && user.purchasedCredits > 0) {
                const deduction = Math.min(user.purchasedCredits, remainingToDeduct);
                purchasedDeduction = deduction;
                remainingToDeduct -= deduction;
            }

            // Deduct from Bonus (if needed and applicable)
            if (remainingToDeduct > 0 && user.bonusCredits > 0) {
                const deduction = Math.min(user.bonusCredits, remainingToDeduct);
                bonusDeduction = deduction;
                remainingToDeduct -= deduction;
            }

            // Update User Balance & Credits
            await tx.user.update({
                where: { id: userId },
                data: {
                    credits: { decrement: creditsToRedeem },
                    earnedCredits: { decrement: earnedDeduction },
                    purchasedCredits: { decrement: purchasedDeduction },
                    bonusCredits: { decrement: bonusDeduction },
                    walletBalance: { increment: redemptionValue },
                },
            });

            // 5. Log Transaction
            await tx.userWalletTransaction.create({
                data: {
                    userId: userId,
                    type: UserWalletTransactionType.CREDIT_REDEMPTION_SUCCESS as any, // Cast to any to avoid potential Prisma enum mismatch
                    amount: redemptionValue, // Positive amount added to wallet
                    currency: 'INR', // Default currency
                    status: UserWalletTransactionStatus.COMPLETED,
                    source: 'SYSTEM',
                    description: `Redeemed ${creditsToRedeem} credits`,
                    previousBalance: Number(user.walletBalance),
                    newBalance: Number(user.walletBalance) + redemptionValue,
                    metadata: {
                        creditsRedeemed: creditsToRedeem,
                        conversionRate: conversionRate,
                        breakdown: {
                            earned: earnedDeduction,
                            purchased: purchasedDeduction,
                            bonus: bonusDeduction
                        }
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        });

        // Return updated wallet info
        return this.getWalletInfoUseCase.execute(userId);
    }
}
