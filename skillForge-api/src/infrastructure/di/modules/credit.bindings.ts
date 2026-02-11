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
}
