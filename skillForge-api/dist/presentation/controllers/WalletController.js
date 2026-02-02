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
exports.WalletController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const UserWalletTransactionDTO_1 = require("../../application/dto/wallet/UserWalletTransactionDTO");
let WalletController = class WalletController {
    constructor(getUserWalletDataUseCase, getUserWalletTransactionsUseCase, responseBuilder) {
        this.getUserWalletDataUseCase = getUserWalletDataUseCase;
        this.getUserWalletTransactionsUseCase = getUserWalletTransactionsUseCase;
        this.responseBuilder = responseBuilder;
        this.getWalletData = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const walletData = await this.getUserWalletDataUseCase.execute(userId);
                const response = this.responseBuilder.success(walletData, 'Wallet data retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getTransactions = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const filters = UserWalletTransactionDTO_1.GetUserWalletTransactionsRequestSchema.parse(req.query);
                const result = await this.getUserWalletTransactionsUseCase.execute(userId, filters);
                const response = this.responseBuilder.success(result, 'Wallet transactions retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.WalletController = WalletController;
exports.WalletController = WalletController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IGetUserWalletDataUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetUserWalletTransactionsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], WalletController);
//# sourceMappingURL=WalletController.js.map