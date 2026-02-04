import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { UserSubscriptionController } from '../../controllers/subscription/UserSubscriptionController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class UserSubscriptionRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.UserSubscriptionController) private controller: UserSubscriptionController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // All routes require authentication
        this.router.use(authMiddleware);

        // GET /api/v1/subscriptions/me - Get current user's subscription
        this.router.get(ENDPOINTS.USER_SUBSCRIPTION.ME, this.controller.getCurrentSubscription.bind(this.controller));

        // POST /api/v1/subscriptions/cancel - Cancel subscription
        this.router.post(ENDPOINTS.USER_SUBSCRIPTION.CANCEL, this.controller.cancelSubscription.bind(this.controller));

        // POST /api/v1/subscriptions/reactivate - Reactivate subscription
        this.router.post(ENDPOINTS.USER_SUBSCRIPTION.REACTIVATE, this.controller.reactivateSubscription.bind(this.controller));
    }
}

