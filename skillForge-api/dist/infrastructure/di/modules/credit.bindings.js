"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCreditBindings = registerCreditBindings;
const types_1 = require("../types");
const CreditPackageRepository_1 = require("../../database/repositories/CreditPackageRepository");
// Admin Credit Package Management
const CreateCreditPackageUseCase_1 = require("../../../application/useCases/credit/CreateCreditPackageUseCase");
const GetCreditPackagesUseCase_1 = require("../../../application/useCases/credit/GetCreditPackagesUseCase");
const UpdateCreditPackageUseCase_1 = require("../../../application/useCases/credit/UpdateCreditPackageUseCase");
const DeleteCreditPackageUseCase_1 = require("../../../application/useCases/credit/DeleteCreditPackageUseCase");
const CreditPackageMapper_1 = require("../../../application/mappers/CreditPackageMapper");
const CreditPackageController_1 = require("../../../presentation/controllers/credit/CreditPackageController");
const CreditPackageRoutes_1 = require("../../../presentation/routes/credit/CreditPackageRoutes");
// User Credit Management
const GetUserCreditPackagesUseCase_1 = require("../../../application/useCases/credit/GetUserCreditPackagesUseCase");
const PurchaseCreditPackageUseCase_1 = require("../../../application/useCases/credit/PurchaseCreditPackageUseCase");
const GetCreditTransactionsUseCase_1 = require("../../../application/useCases/credit/GetCreditTransactionsUseCase");
const CreditController_1 = require("../../../presentation/controllers/credit/CreditController");
const CreditRoutes_1 = require("../../../presentation/routes/credit/CreditRoutes");
function registerCreditBindings(container) {
    // Repository
    container.bind(types_1.TYPES.ICreditPackageRepository)
        .to(CreditPackageRepository_1.CreditPackageRepository).inSingletonScope();
    // Admin Credit Package Use Cases
    container.bind(types_1.TYPES.ICreateCreditPackageUseCase)
        .to(CreateCreditPackageUseCase_1.CreateCreditPackageUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IGetCreditPackagesUseCase)
        .to(GetCreditPackagesUseCase_1.GetCreditPackagesUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IUpdateCreditPackageUseCase)
        .to(UpdateCreditPackageUseCase_1.UpdateCreditPackageUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IDeleteCreditPackageUseCase)
        .to(DeleteCreditPackageUseCase_1.DeleteCreditPackageUseCase).inSingletonScope();
    // User Credit Management Use Cases
    container.bind(types_1.TYPES.IGetUserCreditPackagesUseCase)
        .to(GetUserCreditPackagesUseCase_1.GetUserCreditPackagesUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IPurchaseCreditPackageUseCase)
        .to(PurchaseCreditPackageUseCase_1.PurchaseCreditPackageUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IGetCreditTransactionsUseCase)
        .to(GetCreditTransactionsUseCase_1.GetCreditTransactionsUseCase).inSingletonScope();
    // Mapper
    container.bind(types_1.TYPES.ICreditPackageMapper)
        .to(CreditPackageMapper_1.CreditPackageMapper).inSingletonScope();
    // Admin Controller & Routes
    container.bind(types_1.TYPES.CreditPackageController)
        .to(CreditPackageController_1.CreditPackageController).inSingletonScope();
    container.bind(types_1.TYPES.CreditPackageRoutes)
        .to(CreditPackageRoutes_1.CreditPackageRoutes).inSingletonScope();
    // User Controller & Routes
    container.bind(types_1.TYPES.CreditController)
        .to(CreditController_1.CreditController).inSingletonScope();
    container.bind(types_1.TYPES.CreditRoutes)
        .to(CreditRoutes_1.CreditRoutes).inSingletonScope();
}
//# sourceMappingURL=credit.bindings.js.map