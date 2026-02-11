import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { CreditController } from '../../controllers/credit/CreditController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateBody } from '../../middlewares/validationMiddleware';
import { PurchaseCreditPackageRequestSchema } from '../../../application/dto/credit/PurchaseCreditPackageDTO';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class CreditRoutes {
    public readonly router: Router = Router();

    constructor(
        @inject(TYPES.CreditController) private readonly controller: CreditController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(ENDPOINTS.CREDIT.PACKAGES, this.controller.getPackages);

        this.router.use(authMiddleware);

        this.router.post(
            ENDPOINTS.CREDIT.PURCHASE,
            validateBody(PurchaseCreditPackageRequestSchema),
            this.controller.purchasePackage
        );

        this.router.get(ENDPOINTS.CREDIT.TRANSACTIONS, this.controller.getTransactions);
    }
}
