import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IPurchaseCreditPackageUseCase } from './interfaaces/IPurchaseCreditPackageUseCase';
import { PurchaseCreditPackageRequestDTO, PurchaseCreditPackageRequestSchema, PurchaseCreditPackageResponseDTO } from '../../dto/credit/PurchaseCreditPackageDTO';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { UserWalletTransaction, UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class PurchaseCreditPackageUseCase implements IPurchaseCreditPackageUseCase {
    constructor(
        @inject(TYPES.ICreditPackageRepository) private readonly creditPackageRepository: ICreditPackageRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IUserWalletTransactionRepository) private readonly transactionRepository: IUserWalletTransactionRepository
    ) { }

    async execute(request: PurchaseCreditPackageRequestDTO): Promise<PurchaseCreditPackageResponseDTO> {
        const validatedRequest = PurchaseCreditPackageRequestSchema.parse(request);

        const user = await this.userRepository.findById(validatedRequest.userId);
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
        }

        const creditPackage = await this.creditPackageRepository.findById(validatedRequest.packageId);
        if (!creditPackage) {
            throw new NotFoundError(ERROR_MESSAGES.CREDITS.PACKAGE_NOT_FOUND);
        }

        if (!creditPackage.isActive) {
            throw new ValidationError('Credit package is not available for purchase');
        }

        const discountMultiplier = (100 - creditPackage.discount) / 100;
        const finalPrice = creditPackage.price * discountMultiplier;

        const userJson = user.toJSON();
        const currentWalletBalance = Number((userJson.walletBalance as any) || 0);
        const currentCredits = (userJson.credits as number) || 0;

        // For credit purchases, amount is NEGATIVE (money spent)
        const newWalletBalance = currentWalletBalance - finalPrice;

        const transaction = UserWalletTransaction.create({
            id: uuidv4(),
            userId: validatedRequest.userId,
            type: UserWalletTransactionType.CREDIT_PURCHASE,
            amount: -finalPrice, // NEGATIVE - money spent on purchasing credits
            currency: 'INR',
            source: 'CREDIT_PACKAGE_PURCHASE',
            referenceId: validatedRequest.packageId,
            description: `Purchased ${creditPackage.credits} credits`,
            metadata: {
                packageId: creditPackage.id,
                creditsAdded: creditPackage.credits, // Store credits in metadata
                originalPrice: creditPackage.price,
                discount: creditPackage.discount,
                paymentIntentId: validatedRequest.paymentIntentId,
            },
            previousBalance: currentWalletBalance,
            newBalance: newWalletBalance,
            status: UserWalletTransactionStatus.COMPLETED,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.transactionRepository.create(transaction);
        await this.userRepository.addPurchasedCredits(validatedRequest.userId, creditPackage.credits);

        return {
            transactionId: transaction.id,
            creditsAdded: creditPackage.credits,
            newCreditBalance: currentCredits + creditPackage.credits,
            amountPaid: finalPrice,
            status: 'COMPLETED',
            createdAt: transaction.createdAt,
        };
    }
}
