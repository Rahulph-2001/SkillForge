import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { validateBody } from '../../middlewares/validationMiddleware';
import { CreateCreditPackageSchema, UpdateCreditPackageSchema } from '../../../application/dto/credit/CreditPackageDTO';
import { ENDPOINTS } from '../../../config/routes';
import { CreditPackageController } from '../../controllers/credit/CreditPackageController';

@injectable()
export class CreditPackageRoutes {
    public readonly router: Router = Router();

    constructor(
        @inject(TYPES.CreditPackageController) private readonly controller: CreditPackageController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // All routes require admin authentication
        this.router.use(authMiddleware);


        this.router.post(
            ENDPOINTS.COMMON.ROOT,
            validateBody(CreateCreditPackageSchema),
            this.controller.create
        );

        this.router.get(
            ENDPOINTS.COMMON.ROOT,
            this.controller.list
        );

        this.router.put(
            ENDPOINTS.COMMON.BY_ID,
            validateBody(UpdateCreditPackageSchema),
            this.controller.update
        );

        this.router.delete(
            ENDPOINTS.COMMON.BY_ID,
            this.controller.delete
        );
    }
}
