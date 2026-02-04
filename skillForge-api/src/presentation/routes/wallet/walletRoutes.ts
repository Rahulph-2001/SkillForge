import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { WalletController } from '../../controllers/WalletController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class WalletRoutes {
    public readonly router: Router;

    constructor(
        @inject(TYPES.WalletController) private readonly walletController: WalletController
    ) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // Apply auth middleware to all wallet routes
        this.router.use(authMiddleware);

        // GET /wallet - Get wallet overview (balance, credits breakdown)
        this.router.get(ENDPOINTS.WALLET.ROOT, this.walletController.getWalletData);

        // GET /wallet/transactions - Get paginated transactions
        this.router.get(ENDPOINTS.WALLET.TRANSACTIONS, this.walletController.getTransactions);
    }
}

