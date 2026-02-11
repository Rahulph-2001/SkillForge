import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { SkillTemplateController } from '../../controllers/skillTemplate/SkillTemplateController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class SkillTemplateRoutes {
  public readonly router: Router = Router();

  constructor(
    @inject(TYPES.SkillTemplateController) private readonly skillTemplateController: SkillTemplateController
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // All routes require admin authentication
    this.router.use(authMiddleware);

    // POST /api/v1/admin/skill-templates - Create new template
    this.router.post(
      ENDPOINTS.SKILL_TEMPLATE.ROOT,
      this.skillTemplateController.create.bind(this.skillTemplateController)
    );

    // GET /api/v1/admin/skill-templates - List all templates
    this.router.get(
      ENDPOINTS.SKILL_TEMPLATE.ROOT,
      this.skillTemplateController.list.bind(this.skillTemplateController)
    );

    // GET /api/v1/admin/skill-templates/:id - Get template by ID
    this.router.get(
      ENDPOINTS.SKILL_TEMPLATE.BY_ID,
      this.skillTemplateController.getById.bind(this.skillTemplateController)
    );

    // PUT /api/v1/admin/skill-templates/:id - Update template
    this.router.put(
      ENDPOINTS.SKILL_TEMPLATE.BY_ID,
      this.skillTemplateController.update.bind(this.skillTemplateController)
    );

    // PATCH /api/v1/admin/skill-templates/:id/toggle-status - Toggle status (Block/Unblock)
    this.router.patch(
      ENDPOINTS.SKILL_TEMPLATE.TOGGLE_STATUS,
      this.skillTemplateController.toggleStatus.bind(this.skillTemplateController)
    );
  }
}

