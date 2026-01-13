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
exports.AdminWalletController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const messages_1 = require("../../../config/messages");
let AdminWalletController = class AdminWalletController {
    constructor(responseBuilder, getAdminWalletStatsUseCase, getWalletTransactionsUseCase) {
        this.responseBuilder = responseBuilder;
        this.getAdminWalletStatsUseCase = getAdminWalletStatsUseCase;
        this.getWalletTransactionsUseCase = getWalletTransactionsUseCase;
    }
    async getWalletStats(_req, res, next) {
        try {
            const stats = await this.getAdminWalletStatsUseCase.execute();
            const response = this.responseBuilder.success(stats, messages_1.SUCCESS_MESSAGES.WALLET.STATS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getWalletTransactions(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const search = req.query.search;
            const type = req.query.type;
            const status = req.query.status;
            const result = await this.getWalletTransactionsUseCase.execute(page, limit, search, type, status);
            const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.WALLET.TRANSACTIONS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AdminWalletController = AdminWalletController;
exports.AdminWalletController = AdminWalletController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetAdminWalletStatsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IGetWalletTransactionsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminWalletController);
//# sourceMappingURL=AdminWalletController.js.map