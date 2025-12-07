import { Router } from 'express';
import { UserProfileController } from '../../controllers/user/UserProfileController';
export declare class UserProfileRoutes {
    private userProfileController;
    private router;
    constructor(userProfileController: UserProfileController);
    private configureRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=userProfileRoutes.d.ts.map