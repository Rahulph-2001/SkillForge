"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletBindings = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const UserWalletTransactionRepository_1 = require("../../database/repositories/UserWalletTransactionRepository");
const GetUserWalletDataUseCase_1 = require("../../../application/useCases/wallet/GetUserWalletDataUseCase");
const GetUserWalletTransactionsUseCase_1 = require("../../../application/useCases/wallet/GetUserWalletTransactionsUseCase");
// Controller
const WalletController_1 = require("../../../presentation/controllers/WalletController");
// Routes
const walletRoutes_1 = require("../../../presentation/routes/wallet/walletRoutes");
exports.walletBindings = new inversify_1.ContainerModule((bind) => {
    // Repository
    bind(types_1.TYPES.IUserWalletTransactionRepository)
        .to(UserWalletTransactionRepository_1.UserWalletTransactionRepository)
        .inSingletonScope();
    // Use Cases
    bind(types_1.TYPES.IGetUserWalletDataUseCase)
        .to(GetUserWalletDataUseCase_1.GetUserWalletDataUseCase)
        .inSingletonScope();
    bind(types_1.TYPES.IGetUserWalletTransactionsUseCase)
        .to(GetUserWalletTransactionsUseCase_1.GetUserWalletTransactionsUseCase)
        .inSingletonScope();
    // Controller
    bind(types_1.TYPES.WalletController)
        .to(WalletController_1.WalletController)
        .inSingletonScope();
    // Routes
    bind(types_1.TYPES.WalletRoutes)
        .to(walletRoutes_1.WalletRoutes)
        .inSingletonScope();
});
//# sourceMappingURL=wallet.bindings.js.map