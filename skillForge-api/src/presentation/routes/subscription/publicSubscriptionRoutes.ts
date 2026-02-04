import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PublicSubscriptionController } from '../../controllers/subscription/PublicSubscriptionController';
import { ENDPOINTS } from '../../../config/routes';


@injectable()
export class PublicSubscriptionRoutes {
  public router = Router();

  constructor(
    @inject(TYPES.PublicSubscriptionController) private readonly publicSubscriptionController: PublicSubscriptionController
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    // GET /api/v1/subscriptions/plans - List all active subscription plans (public)
    this.router.get(
      ENDPOINTS.PUBLIC_SUBSCRIPTION.PLANS,
      this.publicSubscriptionController.listPlans.bind(this.publicSubscriptionController)
    );
  }
}

