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
exports.GetUserWalletDataUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
let GetUserWalletDataUseCase = class GetUserWalletDataUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        const userJson = user.toJSON();
        // Calculate redeemable credits (earned + purchased, NOT bonus)
        const earnedCredits = userJson.earned_credits || 0;
        const purchasedCredits = userJson.purchased_credits || 0;
        const bonusCredits = userJson.bonus_credits || 0;
        const totalCredits = userJson.credits || 0;
        const redeemableCredits = earnedCredits + purchasedCredits;
        // Get verification status
        const verification = userJson.verification || {};
        const bankDetails = verification.bank_details || {};
        return {
            walletBalance: userJson.wallet_balance || 0,
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
};
exports.GetUserWalletDataUseCase = GetUserWalletDataUseCase;
exports.GetUserWalletDataUseCase = GetUserWalletDataUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object])
], GetUserWalletDataUseCase);
//# sourceMappingURL=GetUserWalletDataUseCase.js.map