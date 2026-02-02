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
exports.WalletRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const WalletController_1 = require("../../controllers/WalletController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
let WalletRoutes = class WalletRoutes {
    constructor(walletController) {
        this.walletController = walletController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Apply auth middleware to all wallet routes
        this.router.use(authMiddleware_1.authMiddleware);
        // GET /wallet - Get wallet overview (balance, credits breakdown)
        this.router.get('/', this.walletController.getWalletData);
        // GET /wallet/transactions - Get paginated transactions
        this.router.get('/transactions', this.walletController.getTransactions);
    }
};
exports.WalletRoutes = WalletRoutes;
exports.WalletRoutes = WalletRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.WalletController)),
    __metadata("design:paramtypes", [WalletController_1.WalletController])
], WalletRoutes);
//# sourceMappingURL=walletRoutes.js.map