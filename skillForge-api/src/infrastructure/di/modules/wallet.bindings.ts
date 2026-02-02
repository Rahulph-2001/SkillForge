import { ContainerModule } from 'inversify';
import { TYPES } from '../types';

// Repository
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { UserWalletTransactionRepository } from '../../database/repositories/UserWalletTransactionRepository';

// Use Cases
import { IGetUserWalletDataUseCase } from '../../../application/useCases/wallet/interfaces/IGetUserWalletDataUseCase';
import { GetUserWalletDataUseCase } from '../../../application/useCases/wallet/GetUserWalletDataUseCase';
import { IGetUserWalletTransactionsUseCase } from '../../../application/useCases/wallet/interfaces/IGetUserWalletTransactionsUseCase';
import { GetUserWalletTransactionsUseCase } from '../../../application/useCases/wallet/GetUserWalletTransactionsUseCase';

// Controller
import { WalletController } from '../../../presentation/controllers/WalletController';

// Routes
import { WalletRoutes } from '../../../presentation/routes/wallet/walletRoutes';

export const walletBindings = new ContainerModule((bind) => {
    // Repository
    bind<IUserWalletTransactionRepository>(TYPES.IUserWalletTransactionRepository)
        .to(UserWalletTransactionRepository)
        .inSingletonScope();

    // Use Cases
    bind<IGetUserWalletDataUseCase>(TYPES.IGetUserWalletDataUseCase)
        .to(GetUserWalletDataUseCase)
        .inSingletonScope();

    bind<IGetUserWalletTransactionsUseCase>(TYPES.IGetUserWalletTransactionsUseCase)
        .to(GetUserWalletTransactionsUseCase)
        .inSingletonScope();

    // Controller
    bind<WalletController>(TYPES.WalletController)
        .to(WalletController)
        .inSingletonScope();

    // Routes
    bind<WalletRoutes>(TYPES.WalletRoutes)
        .to(WalletRoutes)
        .inSingletonScope();
});

