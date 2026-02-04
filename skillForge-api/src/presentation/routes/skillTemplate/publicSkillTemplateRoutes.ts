import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { SkillTemplateController } from '../../controllers/skillTemplate/SkillTemplateController';
import { ENDPOINTS } from '../../../config/routes';

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
      ENDPOINTS.PUBLIC_SKILL_TEMPLATE.ACTIVE,
      this.skillTemplateController.listActive.bind(this.skillTemplateController)
    );
  }
}

