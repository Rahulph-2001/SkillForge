import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AdminWalletController } from '../../controllers/admin/AdminWalletController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class AdminWalletRoutes {
    public router = Router();

    constructor(
        @inject(TYPES.AdminWalletController) private readonly adminWalletController: AdminWalletController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(authMiddleware);
        this.router.use(adminMiddleware);

        this.router.get(ENDPOINTS.ADMIN_WALLET.STATS, this.adminWalletController.getWalletStats.bind(this.adminWalletController));
        this.router.get(ENDPOINTS.ADMIN_WALLET.TRANSACTIONS, this.adminWalletController.getWalletTransactions.bind(this.adminWalletController));
        this.router.get(ENDPOINTS.ADMIN_WALLET.CREDITS, this.adminWalletController.getCreditTransactions.bind(this.adminWalletController));
        this.router.get(ENDPOINTS.ADMIN_WALLET.CREDIT_STATS, this.adminWalletController.getCreditStats.bind(this.adminWalletController));
    }
}

