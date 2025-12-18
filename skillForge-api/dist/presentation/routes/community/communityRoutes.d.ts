import { Router } from 'express';
import { CommunityController } from '../../controllers/community/CommunityController';
export declare class CommunityRoutes {
    private readonly communityController;
    private router;
    constructor(communityController: CommunityController);
    private initializeRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=communityRoutes.d.ts.map