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
exports.GetWalletTransactionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserRole_1 = require("../../../domain/enums/UserRole");
const AppError_1 = require("../../../domain/errors/AppError");
let GetWalletTransactionsUseCase = class GetWalletTransactionsUseCase {
    constructor(userRepository, walletTransactionRepository, walletTransactionMapper) {
        this.userRepository = userRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.walletTransactionMapper = walletTransactionMapper;
    }
    async execute(page, limit, search, type, status) {
        const users = await this.userRepository.findAll();
        const adminUser = users.find(user => user.role === UserRole_1.UserRole.ADMIN);
        if (!adminUser) {
            throw new AppError_1.NotFoundError('No admin user found in the system');
        }
        const result = await this.walletTransactionRepository.findByAdminIdWithFilters(adminUser.id, page, limit, { type, status, search });
        // Create user map for efficient lookup
        const userMap = new Map(users.map(u => [u.id, { name: u.name, email: u.email?.value || '' }]));
        // Use mapper to convert entities to DTOs
        const transactions = this.walletTransactionMapper.toDTOList(result.transactions, userMap);
        const totalPages = Math.ceil(result.total / limit);
        return {
            transactions,
            total: result.total,
            page,
            limit,
            totalPages,
        };
    }
};
exports.GetWalletTransactionsUseCase = GetWalletTransactionsUseCase;
exports.GetWalletTransactionsUseCase = GetWalletTransactionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IWalletTransactionRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IWalletTransactionMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetWalletTransactionsUseCase);
//# sourceMappingURL=GetWalletTransactionsUseCase.js.map