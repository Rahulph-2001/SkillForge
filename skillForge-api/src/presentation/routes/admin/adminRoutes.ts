import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AdminController } from '../../controllers/admin/AdminController';
import { SubscriptionRoutes } from '../subscription/subscriptionRoutes';
import { FeatureRoutes } from '../feature/featureRoutes';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

@injectable()
export class AdminRoutes {
  public router = Router();

  constructor(
    @inject(TYPES.AdminController) private readonly adminController: AdminController,
    @inject(TYPES.SubscriptionRoutes) private readonly subscriptionRoutes: SubscriptionRoutes,
    @inject(TYPES.FeatureRoutes) private readonly featureRoutes: FeatureRoutes
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All admin routes require authentication and admin role
    this.router.use(authMiddleware);
    this.router.use(adminMiddleware);

    // User Management Routes
    // GET /api/v1/admin/users - List all users
    this.router.get('/users', this.adminController.listUsers.bind(this.adminController));

    // POST /api/v1/admin/users/suspend - Suspend a user
    this.router.post('/users/suspend', this.adminController.suspendUser.bind(this.adminController));

    // POST /api/v1/admin/users/unsuspend - Unsuspend (reactivate) a user
    this.router.post('/users/unsuspend', this.adminController.unsuspendUser.bind(this.adminController));

    // Subscription Management Routes
    // Mount subscription routes at /api/v1/admin/subscriptions
    this.router.use('/subscriptions', this.subscriptionRoutes.router);

    // Feature Management Routes
    // Mount feature routes at /api/v1/admin/features
    this.router.use('/features', this.featureRoutes.router);
  }
}