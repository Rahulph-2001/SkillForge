import { AdminController } from '../../controllers/admin/AdminController';
import { SubscriptionRoutes } from '../subscription/subscriptionRoutes';
import { FeatureRoutes } from '../feature/featureRoutes';
export declare class AdminRoutes {
    private readonly adminController;
    private readonly subscriptionRoutes;
    private readonly featureRoutes;
    router: import("express-serve-static-core").Router;
    constructor(adminController: AdminController, subscriptionRoutes: SubscriptionRoutes, featureRoutes: FeatureRoutes);
    private initializeRoutes;
}
//# sourceMappingURL=adminRoutes.d.ts.map