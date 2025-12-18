import { AdminController } from '../../controllers/admin/AdminController';
import { SubscriptionRoutes } from '../subscription/subscriptionRoutes';
export declare class AdminRoutes {
    private readonly adminController;
    private readonly subscriptionRoutes;
    router: import("express-serve-static-core").Router;
    constructor(adminController: AdminController, subscriptionRoutes: SubscriptionRoutes);
    private initializeRoutes;
}
//# sourceMappingURL=adminRoutes.d.ts.map