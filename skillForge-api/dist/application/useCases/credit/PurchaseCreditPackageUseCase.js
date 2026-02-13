"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseCreditPackageUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const PurchaseCreditPackageDTO_1 = require("../../dto/credit/PurchaseCreditPackageDTO");
const AppError_1 = require("../../../domain/errors/AppError");
const messages_1 = require("../../../config/messages");
const UserWalletTransaction_1 = require("../../../domain/entities/UserWalletTransaction");
const uuid_1 = require("uuid");
let PurchaseCreditPackageUseCase = class PurchaseCreditPackageUseCase {
    constructor(creditPackageRepository, userRepository, transactionRepository) {
        this.creditPackageRepository = creditPackageRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }
    async execute(request) {
        const validatedRequest = PurchaseCreditPackageDTO_1.PurchaseCreditPackageRequestSchema.parse(request);
        const user = await this.userRepository.findById(validatedRequest.userId);
        if (!user) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.USER.NOT_FOUND);
        }
        const creditPackage = await this.creditPackageRepository.findById(validatedRequest.packageId);
        if (!creditPackage) {
            throw new AppError_1.NotFoundError(messages_1.ERROR_MESSAGES.CREDITS.PACKAGE_NOT_FOUND);
        }
        if (!creditPackage.isActive) {
            throw new AppError_1.ValidationError('Credit package is not available for purchase');
        }
        const discountMultiplier = (100 - creditPackage.discount) / 100;
        const finalPrice = creditPackage.price * discountMultiplier;
        const userJson = user.toJSON();
        const currentWalletBalance = Number(userJson.walletBalance || 0);
        const currentCredits = userJson.credits || 0;
        // For credit purchases, amount is NEGATIVE (money spent)
        const newWalletBalance = currentWalletBalance - finalPrice;
        const transaction = UserWalletTransaction_1.UserWalletTransaction.create({
            id: (0, uuid_1.v4)(),
            userId: validatedRequest.userId,
            type: UserWalletTransaction_1.UserWalletTransactionType.CREDIT_PURCHASE,
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
            status: UserWalletTransaction_1.UserWalletTransactionStatus.COMPLETED,
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
};
exports.PurchaseCreditPackageUseCase = PurchaseCreditPackageUseCase;
exports.PurchaseCreditPackageUseCase = PurchaseCreditPackageUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreditPackageRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserWalletTransactionRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], PurchaseCreditPackageUseCase);
//# sourceMappingURL=PurchaseCreditPackageUseCase.js.map