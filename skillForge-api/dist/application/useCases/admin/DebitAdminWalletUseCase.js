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
exports.DebitAdminWalletUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const WalletTransaction_1 = require("../../../domain/entities/WalletTransaction");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
const uuid_1 = require("uuid");
let DebitAdminWalletUseCase = class DebitAdminWalletUseCase {
    constructor(userRepository, walletTransactionRepository) {
        this.userRepository = userRepository;
        this.walletTransactionRepository = walletTransactionRepository;
    }
    async execute(dto) {
        const adminUser = await this.findAdminUser();
        if (!adminUser) {
            throw new AppError_1.NotFoundError('No admin user found in the system');
        }
        const previousBalance = adminUser.toJSON().wallet_balance;
        try {
            adminUser.debitWallet(dto.amount);
        }
        catch (error) {
            throw new AppError_1.InternalServerError(`Insufficient funds in admin wallet: ${error.message}`);
        }
        await this.userRepository.update(adminUser);
        const newBalance = previousBalance - dto.amount;
        // Record transaction
        const transaction = WalletTransaction_1.WalletTransaction.create({
            id: (0, uuid_1.v4)(),
            adminId: adminUser.id,
            type: 'DEBIT',
            amount: dto.amount,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            description: this.generateDescription(dto),
            metadata: dto.metadata,
            previousBalance,
            newBalance,
            status: 'COMPLETED',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.walletTransactionRepository.create(transaction);
        console.log(`[DebitAdminWallet] Recorded transaction: ${dto.source} - -₹${dto.amount}`);
        return {
            adminId: adminUser.id,
            previousBalance,
            debitedAmount: dto.amount,
            newBalance,
            currency: dto.currency,
            source: dto.source,
            referenceId: dto.referenceId,
            timestamp: new Date()
        };
    }
    generateDescription(dto) {
        if (dto.source === 'PROJECT_RELEASE') {
            const projectTitle = dto.metadata?.projectTitle || 'Project';
            return `Project payment release: ${projectTitle}`;
        }
        else if (dto.source === 'PROJECT_REFUND') {
            const projectTitle = dto.metadata?.projectTitle || 'Project';
            return `Project refund: ${projectTitle}`;
        }
        return `Wallet debit: ${dto.source}`;
    }
    async findAdminUser() {
        const users = await this.userRepository.findAll();
        return users.find(user => user.role === UserRole_1.UserRole.ADMIN) || null;
    }
};
exports.DebitAdminWalletUseCase = DebitAdminWalletUseCase;
exports.DebitAdminWalletUseCase = DebitAdminWalletUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IWalletTransactionRepository)),
    __metadata("design:paramtypes", [Object, Object])
], DebitAdminWalletUseCase);
//# sourceMappingURL=DebitAdminWalletUseCase.js.map