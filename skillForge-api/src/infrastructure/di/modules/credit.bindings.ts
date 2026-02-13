import { Container } from 'inversify';
import { TYPES } from '../types';

import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { CreditPackageRepository } from '../../database/repositories/CreditPackageRepository';

// Admin Credit Package Management
import { CreateCreditPackageUseCase, ICreateCreditPackageUseCase } from '../../../application/useCases/credit/CreateCreditPackageUseCase';
import { GetCreditPackagesUseCase, IGetCreditPackagesUseCase } from '../../../application/useCases/credit/GetCreditPackagesUseCase';
import { UpdateCreditPackageUseCase } from '../../../application/useCases/credit/UpdateCreditPackageUseCase';
import { DeleteCreditPackageUseCase, IDeleteCreditPackageUseCase } from '../../../application/useCases/credit/DeleteCreditPackageUseCase';
import { IUpdateCreditPackageUseCase } from '../../../application/useCases/credit/interfaaces/IUpdateCreditPackageUseCase';

import { ICreditPackageMapper } from '../../../application/mappers/interfaces/ICreditPackageMapper';
import { CreditPackageMapper } from '../../../application/mappers/CreditPackageMapper';

import { CreditPackageController } from '../../../presentation/controllers/credit/CreditPackageController';
import { CreditPackageRoutes } from '../../../presentation/routes/credit/CreditPackageRoutes';

// User Credit Management
import { GetUserCreditPackagesUseCase } from '../../../application/useCases/credit/GetUserCreditPackagesUseCase';
import { PurchaseCreditPackageUseCase } from '../../../application/useCases/credit/PurchaseCreditPackageUseCase';
import { GetCreditTransactionsUseCase } from '../../../application/useCases/credit/GetCreditTransactionsUseCase';
import { IGetUserCreditPackagesUseCase } from '../../../application/useCases/credit/interfaaces/IGetUserCreditPackagesUseCase';
import { IPurchaseCreditPackageUseCase } from '../../../application/useCases/credit/interfaaces/IPurchaseCreditPackageUseCase';
import { IGetCreditTransactionsUseCase } from '../../../application/useCases/credit/interfaaces/IGetCreditTransactionsUseCase';
import { CreditController } from '../../../presentation/controllers/credit/CreditController';
import { CreditRoutes } from '../../../presentation/routes/credit/CreditRoutes';

// Credit Redemption & Withdrawal Imports
import { ISystemSettingsRepository } from '../../../domain/repositories/ISystemSettingsRepository';
import { SystemSettingsRepository } from '../../database/repositories/SystemSettingsRepository';
import { IWithdrawalRequestRepository } from '../../../domain/repositories/IWithdrawalRequestRepository';
import { WithdrawalRequestRepository } from '../../database/repositories/WithdrawalRequestRepository';

import { ISystemSettingsMapper } from '../../../application/mappers/interfaces/ISystemSettingsMapper';
import { SystemSettingsMapper } from '../../../application/mappers/SystemSettingsMapper';
import { IWithdrawalRequestMapper } from '../../../application/mappers/interfaces/IWithdrawalRequestMapper';
import { WithdrawalRequestMapper } from '../../../application/mappers/WithdrawalRequestMapper';

import { IGetWalletInfoUseCase } from '../../../application/useCases/user/wallet/interfaces/IGetWalletInfoUseCase';
import { GetWalletInfoUseCase } from '../../../application/useCases/user/wallet/GetWalletInfoUseCase';
import { IRedeemCreditsUseCase } from '../../../application/useCases/user/wallet/interfaces/IRedeemCreditsUseCase';
import { RedeemCreditsUseCase } from '../../../application/useCases/user/wallet/RedeemCreditsUseCase';
import { IRequestWithdrawalUseCase } from '../../../application/useCases/user/wallet/interfaces/IRequestWithdrawalUseCase';
import { RequestWithdrawalUseCase } from '../../../application/useCases/user/wallet/RequestWithdrawalUseCase';

import { IUpdateRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/interfaces/IUpdateRedemptionSettingsUseCase';
import { UpdateRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/UpdateRedemptionSettingsUseCase';
import { IGetWithdrawalRequestsUseCase } from '../../../application/useCases/admin/credit/interfaces/IGetWithdrawalRequestsUseCase';
import { GetWithdrawalRequestsUseCase } from '../../../application/useCases/admin/credit/GetWithdrawalRequestsUseCase';
import { IProcessWithdrawalUseCase } from '../../../application/useCases/admin/credit/interfaces/IProcessWithdrawalUseCase';
import { ProcessWithdrawalUseCase } from '../../../application/useCases/admin/credit/ProcessWithdrawalUseCase';

import { CreditRedemptionController } from '../../../presentation/controllers/credit/CreditRedemptionController';
import { CreditRedemptionRoutes } from '../../../presentation/routes/credit/CreditRedemptionRoutes';
import { AdminWithdrawalController } from '../../../presentation/controllers/admin/AdminWithdrawalController';
import { AdminWithdrawalRoutes } from '../../../presentation/routes/admin/AdminWithdrawalRoutes';

import { GetRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/GetRedemptionSettingsUseCase';
import { IGetRedemptionSettingsUseCase } from '../../../application/useCases/admin/credit/interfaces/IGetRedemptionSettingsUseCase';

export function registerCreditBindings(container: Container): void {
    // Repository
    container.bind<ICreditPackageRepository>(TYPES.ICreditPackageRepository)
        .to(CreditPackageRepository).inSingletonScope();

    // Admin Credit Package Use Cases
    container.bind<ICreateCreditPackageUseCase>(TYPES.ICreateCreditPackageUseCase)
        .to(CreateCreditPackageUseCase).inSingletonScope();
    container.bind<IGetCreditPackagesUseCase>(TYPES.IGetCreditPackagesUseCase)
        .to(GetCreditPackagesUseCase).inSingletonScope();
    container.bind<IUpdateCreditPackageUseCase>(TYPES.IUpdateCreditPackageUseCase)
        .to(UpdateCreditPackageUseCase).inSingletonScope();
    container.bind<IDeleteCreditPackageUseCase>(TYPES.IDeleteCreditPackageUseCase)
        .to(DeleteCreditPackageUseCase).inSingletonScope();

    // User Credit Management Use Cases
    container.bind<IGetUserCreditPackagesUseCase>(TYPES.IGetUserCreditPackagesUseCase)
        .to(GetUserCreditPackagesUseCase).inSingletonScope();
    container.bind<IPurchaseCreditPackageUseCase>(TYPES.IPurchaseCreditPackageUseCase)
        .to(PurchaseCreditPackageUseCase).inSingletonScope();
    container.bind<IGetCreditTransactionsUseCase>(TYPES.IGetCreditTransactionsUseCase)
        .to(GetCreditTransactionsUseCase).inSingletonScope();

    // Mapper
    container.bind<ICreditPackageMapper>(TYPES.ICreditPackageMapper)
        .to(CreditPackageMapper).inSingletonScope();

    // Admin Controller & Routes
    container.bind<CreditPackageController>(TYPES.CreditPackageController)
        .to(CreditPackageController).inSingletonScope();
    container.bind<CreditPackageRoutes>(TYPES.CreditPackageRoutes)
        .to(CreditPackageRoutes).inSingletonScope();

    // User Controller & Routes
    container.bind<CreditController>(TYPES.CreditController)
        .to(CreditController).inSingletonScope();
    container.bind<CreditRoutes>(TYPES.CreditRoutes)
        .to(CreditRoutes).inSingletonScope();

    // =================================================================
    // Credit Redemption & Withdrawal
    // =================================================================

    // Repositories
    container.bind<ISystemSettingsRepository>(TYPES.ISystemSettingsRepository)
        .to(SystemSettingsRepository).inSingletonScope();
    container.bind<IWithdrawalRequestRepository>(TYPES.IWithdrawalRequestRepository)
        .to(WithdrawalRequestRepository).inSingletonScope();

    // Mappers
    container.bind<ISystemSettingsMapper>(TYPES.ISystemSettingsMapper)
        .to(SystemSettingsMapper).inSingletonScope();
    container.bind<IWithdrawalRequestMapper>(TYPES.IWithdrawalRequestMapper)
        .to(WithdrawalRequestMapper).inSingletonScope();

    // Use Cases (User)
    container.bind<IGetWalletInfoUseCase>(TYPES.IGetWalletInfoUseCase)
        .to(GetWalletInfoUseCase).inSingletonScope();
    container.bind<IRedeemCreditsUseCase>(TYPES.IRedeemCreditsUseCase)
        .to(RedeemCreditsUseCase).inSingletonScope();
    container.bind<IRequestWithdrawalUseCase>(TYPES.IRequestWithdrawalUseCase)
        .to(RequestWithdrawalUseCase).inSingletonScope();

    // Use Cases (Admin)
    container.bind<IUpdateRedemptionSettingsUseCase>(TYPES.IUpdateRedemptionSettingsUseCase)
        .to(UpdateRedemptionSettingsUseCase).inSingletonScope();
    container.bind<IGetRedemptionSettingsUseCase>(TYPES.IGetRedemptionSettingsUseCase)
        .to(GetRedemptionSettingsUseCase).inSingletonScope();
    container.bind<IGetWithdrawalRequestsUseCase>(TYPES.IGetWithdrawalRequestsUseCase)
        .to(GetWithdrawalRequestsUseCase).inSingletonScope();
    container.bind<IProcessWithdrawalUseCase>(TYPES.IProcessWithdrawalUseCase)
        .to(ProcessWithdrawalUseCase).inSingletonScope();

    // Controllers & Routes
    container.bind<CreditRedemptionController>(TYPES.CreditRedemptionController)
        .to(CreditRedemptionController).inSingletonScope();
    container.bind<CreditRedemptionRoutes>(TYPES.CreditRedemptionRoutes)
        .to(CreditRedemptionRoutes).inSingletonScope();

    container.bind<AdminWithdrawalController>(TYPES.AdminWithdrawalController)
        .to(AdminWithdrawalController).inSingletonScope();
    container.bind<AdminWithdrawalRoutes>(TYPES.AdminWithdrawalRoutes)
        .to(AdminWithdrawalRoutes).inSingletonScope();
}
