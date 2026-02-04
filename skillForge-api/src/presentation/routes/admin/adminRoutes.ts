import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AdminController } from '../../controllers/admin/AdminController';
import { SubscriptionRoutes } from '../subscription/subscriptionRoutes';
import { FeatureRoutes } from '../feature/featureRoutes';
import { ProjectPaymentRequestController } from '../../controllers/admin/ProjectPaymentRequestController';
import { AdminProjectController } from '../../controllers/admin/AdminProjectController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class AdminRoutes {
  public router = Router();

  constructor(
    @inject(TYPES.AdminController) private readonly adminController: AdminController,
    @inject(TYPES.SubscriptionRoutes) private readonly subscriptionRoutes: SubscriptionRoutes,
    @inject(TYPES.FeatureRoutes) private readonly featureRoutes: FeatureRoutes,
    @inject(TYPES.ProjectPaymentRequestController) private readonly paymentRequestController: ProjectPaymentRequestController,
    @inject(TYPES.AdminProjectController) private readonly adminProjectController: AdminProjectController
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All admin routes require authentication and admin role
    this.router.use(authMiddleware);
    this.router.use(adminMiddleware);

    // User Management Routes
    // GET /api/v1/admin/users - List all users
    this.router.get(ENDPOINTS.ADMIN.USERS, this.adminController.listUsers.bind(this.adminController));

    // POST /api/v1/admin/users/suspend - Suspend a user
    this.router.post(ENDPOINTS.ADMIN.USERS_SUSPEND, this.adminController.suspendUser.bind(this.adminController));

    // POST /api/v1/admin/users/unsuspend - Unsuspend (reactivate) a user
    this.router.post(ENDPOINTS.ADMIN.USERS_UNSUSPEND, this.adminController.unsuspendUser.bind(this.adminController));

    // Community Management Routes
    // GET /api/v1/admin/communities - List all communities with pagination and search
    this.router.get(ENDPOINTS.ADMIN.COMMUNITIES, this.adminController.listCommunities.bind(this.adminController));

    // PUT /api/v1/admin/communities/:id - Update community
    this.router.put(ENDPOINTS.ADMIN.COMMUNITY_BY_ID, this.adminController.updateCommunity.bind(this.adminController));

    // POST /api/v1/admin/communities/:id/block - Block community
    this.router.post(ENDPOINTS.ADMIN.COMMUNITY_BLOCK, this.adminController.blockCommunity.bind(this.adminController));

    // POST /api/v1/admin/communities/:id/unblock - Unblock community
    this.router.post(ENDPOINTS.ADMIN.COMMUNITY_UNBLOCK, this.adminController.unblockCommunity.bind(this.adminController));

    // Subscription Management Routes
    // Mount subscription routes at /api/v1/admin/subscriptions
    this.router.use(ENDPOINTS.ADMIN.SUBSCRIPTIONS, this.subscriptionRoutes.router);

    // Feature Management Routes
    // Mount feature routes at /api/v1/admin/features
    this.router.use(ENDPOINTS.ADMIN.FEATURES, this.featureRoutes.router);

    // Project Management Routes
    // GET /api/v1/admin/projects - List all projects
    this.router.get(ENDPOINTS.ADMIN.PROJECTS, this.adminProjectController.listProjects.bind(this.adminProjectController));

    // GET /api/v1/admin/projects/stats - Get project statistics
    this.router.get(ENDPOINTS.ADMIN.PROJECTS_STATS, this.adminProjectController.getProjectStats.bind(this.adminProjectController));

    // Project Payment Requests
    // GET /api/v1/admin/payment-requests/pending
    this.router.get(ENDPOINTS.ADMIN.PAYMENT_REQUESTS_PENDING, this.paymentRequestController.getPendingPaymentRequests.bind(this.paymentRequestController));

    // POST /api/v1/admin/payment-requests/:id/process
    this.router.post(ENDPOINTS.ADMIN.PAYMENT_REQUEST_PROCESS, this.paymentRequestController.processPaymentRequest.bind(this.paymentRequestController));
  }
}

