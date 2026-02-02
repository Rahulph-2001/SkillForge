import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { WalletController } from '../../controllers/WalletController';
import { authMiddleware } from '../../middlewares/authMiddleware';

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
        this.router.get('/', this.walletController.getWalletData);

        // GET /wallet/transactions - Get paginated transactions
        this.router.get('/transactions', this.walletController.getTransactions);
    }
}
