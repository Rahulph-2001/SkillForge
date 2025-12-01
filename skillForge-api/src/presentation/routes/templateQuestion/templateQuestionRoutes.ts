import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { TemplateQuestionController } from '../../controllers/templateQuestion/TemplateQuestionController';
import { authMiddleware } from '../../middlewares/authMiddleware';

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
      '/',
      this.templateQuestionController.create.bind(this.templateQuestionController)
    );

    // GET /api/v1/admin/skill-templates/:templateId/questions - List questions
    // Supports ?level=Beginner query parameter
    this.router.get(
      '/',
      this.templateQuestionController.list.bind(this.templateQuestionController)
    );

    // PUT /api/v1/admin/skill-templates/:templateId/questions/:id - Update question
    this.router.put(
      '/:id',
      this.templateQuestionController.update.bind(this.templateQuestionController)
    );

    // DELETE /api/v1/admin/skill-templates/:templateId/questions/:id - Delete question
    this.router.delete(
      '/:id',
      this.templateQuestionController.delete.bind(this.templateQuestionController)
    );
  }
}
