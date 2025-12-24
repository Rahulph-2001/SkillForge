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
exports.CreditAdminWalletUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
let CreditAdminWalletUseCase = class CreditAdminWalletUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(dto) {
        // Find the first admin user
        // Note: In a production system, you might have a dedicated admin ID or wallet service
        const adminUser = await this.findAdminUser();
        if (!adminUser) {
            throw new AppError_1.NotFoundError('No admin user found in the system');
        }
        // Get current balance before crediting
        const previousBalance = adminUser.toJSON().wallet_balance;
        // Credit the admin wallet
        adminUser.creditWallet(dto.amount);
        // Save updated admin
        await this.userRepository.update(adminUser);
        // Return response
        return {
            adminId: adminUser.id,
            previousBalance,
            creditedAmount: dto.amount,
            newBalance: previousBalance + dto.amount,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            timestamp: new Date()
        };
    }
    /**
     * Find the first admin user in the system
     * TODO: In future, implement a dedicated admin wallet system
     */
    async findAdminUser() {
        // This is a simple implementation
        // In production, you might want to have a dedicated admin wallet or use a specific admin ID
        const users = await this.userRepository.findAll();
        return users.find(user => user.role === UserRole_1.UserRole.ADMIN) || null;
    }
};
exports.CreditAdminWalletUseCase = CreditAdminWalletUseCase;
exports.CreditAdminWalletUseCase = CreditAdminWalletUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object])
], CreditAdminWalletUseCase);
//# sourceMappingURL=CreditAdminWalletUseCase.js.map