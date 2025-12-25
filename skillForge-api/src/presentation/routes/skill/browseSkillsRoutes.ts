import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { BrowseSkillsController } from '../../controllers/BrowseSkillsController';
import { SkillDetailsController } from '../../controllers/skill/SkillDetailsController';
import { optionalAuthMiddleware } from '../../middlewares/optionalAuthMiddleware';

@injectable()
export class BrowseSkillsRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.BrowseSkillsController) private browseSkillsController: BrowseSkillsController,
    @inject(TYPES.SkillDetailsController) private skillDetailsController: SkillDetailsController
  ) {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // Public routes - optional authentication to filter own skills
    this.router.get('/browse', optionalAuthMiddleware, this.browseSkillsController.browse);
    this.router.get('/:skillId', this.skillDetailsController.getDetails);
  }

  public getRouter(): Router {
    return this.router;
  }
}
