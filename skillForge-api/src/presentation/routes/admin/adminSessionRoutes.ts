import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AdminSessionController } from '../../../presentation/controllers/admin/AdminSessionController';
import { authMiddleware } from '../../../presentation/middlewares/authMiddleware';
import { adminMiddleware } from '../../../presentation/middlewares/adminMiddleware';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

@injectable()
export class AdminSessionRoutes {
    public router = Router();

    constructor(
        @inject(TYPES.AdminSessionController) private adminSessionController: AdminSessionController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Apply auth and admin role check to all routes
        this.router.use(authMiddleware);
        this.router.use(adminMiddleware);

        this.router.get(
            '/',
            asyncHandler(this.adminSessionController.listSessions.bind(this.adminSessionController))
        );

        this.router.get(
            '/stats',
            asyncHandler(this.adminSessionController.getStats.bind(this.adminSessionController))
        );

        this.router.patch(
            '/:id/cancel',
            asyncHandler(this.adminSessionController.cancelSession.bind(this.adminSessionController))
        );

        this.router.patch(
            '/:id/complete',
            asyncHandler(this.adminSessionController.completeSession.bind(this.adminSessionController))
        );
    }
}
