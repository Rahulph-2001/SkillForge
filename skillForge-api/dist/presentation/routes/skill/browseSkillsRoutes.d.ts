import { Router } from 'express';
import { BrowseSkillsController } from '../../controllers/BrowseSkillsController';
import { SkillDetailsController } from '../../controllers/skill/SkillDetailsController';
export declare class BrowseSkillsRoutes {
    private browseSkillsController;
    private skillDetailsController;
    private router;
    constructor(browseSkillsController: BrowseSkillsController, skillDetailsController: SkillDetailsController);
    private configureRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=browseSkillsRoutes.d.ts.map