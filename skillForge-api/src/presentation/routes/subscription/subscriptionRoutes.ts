import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { SubscriptionController } from '../../controllers/subscription/SubscriptionController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';


@injectable()
export class SubscriptionRoutes {
  public router = Router();

  constructor(
    @inject(TYPES.SubscriptionController) private readonly subscriptionController: SubscriptionController
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All subscription routes require authentication and admin role
    this.router.use(authMiddleware);
    this.router.use(adminMiddleware);

    // GET /api/v1/admin/subscriptions/plans - List all subscription plans
    this.router.get(
      '/plans',
      this.subscriptionController.listPlans.bind(this.subscriptionController)
    );

    // GET /api/v1/admin/subscriptions/stats - Get subscription statistics
    this.router.get(
      '/stats',
      this.subscriptionController.getStats.bind(this.subscriptionController)
    );

    // POST /api/v1/admin/subscriptions/plans - Create new subscription plan
    this.router.post(
      '/plans',
      this.subscriptionController.createPlan.bind(this.subscriptionController)
    );

    // PUT /api/v1/admin/subscriptions/plans/:id - Update subscription plan
    this.router.put(
      '/plans/:id',
      this.subscriptionController.updatePlan.bind(this.subscriptionController)
    );

    // DELETE /api/v1/admin/subscriptions/plans/:id - Delete subscription plan
    this.router.delete(
      '/plans/:id',
      this.subscriptionController.deletePlan.bind(this.subscriptionController)
    );
  }
}
