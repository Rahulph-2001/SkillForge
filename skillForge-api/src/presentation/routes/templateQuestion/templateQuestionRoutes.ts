import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { TemplateQuestionController } from '../../controllers/templateQuestion/TemplateQuestionController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class TemplateQuestionRoutes {
  public readonly router: Router = Router({ mergeParams: true });

  constructor(
    @inject(TYPES.TemplateQuestionController)
    private readonly templateQuestionController: TemplateQuestionController
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // All routes require admin authentication
    this.router.use(authMiddleware);

    // POST /api/v1/admin/skill-templates/:templateId/questions - Create question
    this.router.post(
      ENDPOINTS.TEMPLATE_QUESTION.ROOT,
      this.templateQuestionController.create.bind(this.templateQuestionController)
    );

    // GET /api/v1/admin/skill-templates/:templateId/questions - List questions
    // Supports ?level=Beginner query parameter
    this.router.get(
      ENDPOINTS.TEMPLATE_QUESTION.ROOT,
      this.templateQuestionController.list.bind(this.templateQuestionController)
    );

    // PUT /api/v1/admin/skill-templates/:templateId/questions/:id - Update question
    this.router.put(
      ENDPOINTS.TEMPLATE_QUESTION.BY_ID,
      this.templateQuestionController.update.bind(this.templateQuestionController)
    );

    // DELETE /api/v1/admin/skill-templates/:templateId/questions/bulk - Bulk delete questions
    this.router.delete(
      ENDPOINTS.TEMPLATE_QUESTION.BULK_DELETE,
      this.templateQuestionController.bulkDelete.bind(this.templateQuestionController)
    );

    // DELETE /api/v1/admin/skill-templates/:templateId/questions/:id - Delete question
    this.router.delete(
      ENDPOINTS.TEMPLATE_QUESTION.BY_ID,
      this.templateQuestionController.delete.bind(this.templateQuestionController)
    );
  }
}

