import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { SkillTemplateController } from '../../controllers/skillTemplate/SkillTemplateController';
import { authMiddleware } from '../../middlewares/authMiddleware';

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
      '/',
      this.skillTemplateController.create.bind(this.skillTemplateController)
    );

    // GET /api/v1/admin/skill-templates - List all templates
    this.router.get(
      '/',
      this.skillTemplateController.list.bind(this.skillTemplateController)
    );

    // PUT /api/v1/admin/skill-templates/:id - Update template
    this.router.put(
      '/:id',
      this.skillTemplateController.update.bind(this.skillTemplateController)
    );

    // DELETE /api/v1/admin/skill-templates/:id - Delete template
    this.router.delete(
      '/:id',
      this.skillTemplateController.delete.bind(this.skillTemplateController)
    );

    // PATCH /api/v1/admin/skill-templates/:id/toggle-status - Toggle status
    this.router.patch(
      '/:id/toggle-status',
      this.skillTemplateController.toggleStatus.bind(this.skillTemplateController)
    );
  }
}
