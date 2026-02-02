import { AdminController } from '../../controllers/admin/AdminController';
import { SubscriptionRoutes } from '../subscription/subscriptionRoutes';
import { FeatureRoutes } from '../feature/featureRoutes';
import { ProjectPaymentRequestController } from '../../controllers/admin/ProjectPaymentRequestController';
import { AdminProjectController } from '../../controllers/admin/AdminProjectController';
export declare class AdminRoutes {
    private readonly adminController;
    private readonly subscriptionRoutes;
    private readonly featureRoutes;
    private readonly paymentRequestController;
    private readonly adminProjectController;
    router: import("express-serve-static-core").Router;
    constructor(adminController: AdminController, subscriptionRoutes: SubscriptionRoutes, featureRoutes: FeatureRoutes, paymentRequestController: ProjectPaymentRequestController, adminProjectController: AdminProjectController);
    private initializeRoutes;
}
//# sourceMappingURL=adminRoutes.d.ts.map