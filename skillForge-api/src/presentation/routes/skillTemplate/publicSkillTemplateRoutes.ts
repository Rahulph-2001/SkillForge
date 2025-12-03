import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { SkillTemplateController } from '../../controllers/skillTemplate/SkillTemplateController';

@injectable()
export class PublicSkillTemplateRoutes {
  public readonly router: Router = Router();

  constructor(
    @inject(TYPES.SkillTemplateController) private readonly skillTemplateController: SkillTemplateController
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /api/v1/skill-templates/active - List all active templates (no auth required)
    this.router.get(
      '/active',
      this.skillTemplateController.listActive.bind(this.skillTemplateController)
    );
  }
}
