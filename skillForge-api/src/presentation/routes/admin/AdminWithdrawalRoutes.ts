import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { AdminWithdrawalController } from '../../controllers/admin/AdminWithdrawalController';
import { authorize } from '../../middlewares/authorizeMiddleware';
import { authMiddleware as authenticate } from '../../middlewares/authMiddleware';
import { TYPES } from '../../../infrastructure/di/types';

@injectable()
export class AdminWithdrawalRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.AdminWithdrawalController) private withdrawalController: AdminWithdrawalController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // All routes require Admin authentication
        this.router.use(authenticate);
        this.router.use(authorize(['admin']) as any);

        this.router.get('/', this.withdrawalController.getWithdrawals);
        this.router.post('/:id/process', this.withdrawalController.processWithdrawal);
        this.router.put('/settings/conversion-rate', this.withdrawalController.setConversionRate);
    }
}
