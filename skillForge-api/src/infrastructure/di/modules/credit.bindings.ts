import { Container } from 'inversify';
import { TYPES } from '../types';

import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { CreditPackageRepository } from '../../database/repositories/CreditPackageRepository';

import { ICreateCreditPackageUseCase, CreateCreditPackageUseCase } from '../../../application/useCases/credit/CreateCreditPackageUseCase';
import { IGetCreditPackagesUseCase, GetCreditPackagesUseCase } from '../../../application/useCases/credit/GetCreditPackagesUseCase';
import { IUpdateCreditPackageUseCase, UpdateCreditPackageUseCase } from '../../../application/useCases/credit/UpdateCreditPackageUseCase';
import { IDeleteCreditPackageUseCase, DeleteCreditPackageUseCase } from '../../../application/useCases/credit/DeleteCreditPackageUseCase';

import { ICreditPackageMapper } from '../../../application/mappers/interfaces/ICreditPackageMapper';
import { CreditPackageMapper } from '../../../application/mappers/CreditPackageMapper';

import { CreditPackageController } from '../../../presentation/controllers/credit/CreditPackageController';
import { CreditPackageRoutes } from '../../../presentation/routes/credit/CreditPackageRoutes';

export function registerCreditBindings(container: Container): void {
    // Repository
    container.bind<ICreditPackageRepository>(TYPES.ICreditPackageRepository)
        .to(CreditPackageRepository).inSingletonScope();

    // Use Cases
    container.bind<ICreateCreditPackageUseCase>(TYPES.ICreateCreditPackageUseCase)
        .to(CreateCreditPackageUseCase).inSingletonScope();
    container.bind<IGetCreditPackagesUseCase>(TYPES.IGetCreditPackagesUseCase)
        .to(GetCreditPackagesUseCase).inSingletonScope();
    container.bind<IUpdateCreditPackageUseCase>(TYPES.IUpdateCreditPackageUseCase)
        .to(UpdateCreditPackageUseCase).inSingletonScope();
    container.bind<IDeleteCreditPackageUseCase>(TYPES.IDeleteCreditPackageUseCase)
        .to(DeleteCreditPackageUseCase).inSingletonScope();

    // Mapper
    container.bind<ICreditPackageMapper>(TYPES.ICreditPackageMapper)
        .to(CreditPackageMapper).inSingletonScope();

    // Controller
    container.bind<CreditPackageController>(TYPES.CreditPackageController)
        .to(CreditPackageController).inSingletonScope();

    // Routes
    container.bind<CreditPackageRoutes>(TYPES.CreditPackageRoutes)
        .to(CreditPackageRoutes).inSingletonScope();
}
