import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { CreateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase';
import { ListTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase';
import { UpdateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase';
import { DeleteTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase';
import { BulkDeleteTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/BulkDeleteTemplateQuestionsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class TemplateQuestionController {
  constructor(
    @inject(TYPES.CreateTemplateQuestionUseCase)
    private readonly createTemplateQuestionUseCase: CreateTemplateQuestionUseCase,
    @inject(TYPES.ListTemplateQuestionsUseCase)
    private readonly listTemplateQuestionsUseCase: ListTemplateQuestionsUseCase,
    @inject(TYPES.UpdateTemplateQuestionUseCase)
    private readonly updateTemplateQuestionUseCase: UpdateTemplateQuestionUseCase,
    @inject(TYPES.DeleteTemplateQuestionUseCase)
    private readonly deleteTemplateQuestionUseCase: DeleteTemplateQuestionUseCase,
    @inject(TYPES.BulkDeleteTemplateQuestionsUseCase)
    private readonly bulkDeleteTemplateQuestionsUseCase: BulkDeleteTemplateQuestionsUseCase,
    @inject(TYPES.IResponseBuilder)
    private readonly responseBuilder: IResponseBuilder
  ) { }

  /**
   * POST /api/v1/admin/skill-templates/:templateId/questions
   * Create a new question for a template
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const { templateId } = req.params;
      const dto = { ...req.body, templateId };

      const question = await this.createTemplateQuestionUseCase.execute(adminUserId, dto);

      const response = this.responseBuilder.success(
        question.toJSON(),
        'Question created successfully',
        HttpStatusCode.CREATED
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/skill-templates/:templateId/questions
   * List questions for a template (optionally filtered by level)
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const { templateId } = req.params;
      const { level } = req.query;

      const questions = await this.listTemplateQuestionsUseCase.execute(
        adminUserId,
        templateId,
        level as string | undefined
      );

      const response = this.responseBuilder.success(
        questions.map((q) => q.toJSON()),
        'Questions retrieved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/skill-templates/:templateId/questions/:id
   * Update a question
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const { id } = req.params;
      const dto = { ...req.body, questionId: id };

      const question = await this.updateTemplateQuestionUseCase.execute(adminUserId, dto);

      const response = this.responseBuilder.success(
        question.toJSON(),
        'Question updated successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/skill-templates/:templateId/questions/:id
   * Delete a question
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const { id } = req.params;

      await this.deleteTemplateQuestionUseCase.execute(adminUserId, id);

      const response = this.responseBuilder.success(
        { message: 'Question deleted successfully' },
        'Question deleted successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/skill-templates/:templateId/questions/bulk
   * Bulk delete multiple questions
   */
  async bulkDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId } = req.params;
      const { questionIds } = req.body;

      if (!Array.isArray(questionIds)) {
        const response = this.responseBuilder.error(
          'questionIds must be an array',
          HttpStatusCode.BAD_REQUEST
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const result = await this.bulkDeleteTemplateQuestionsUseCase.execute(templateId, questionIds);

      const response = this.responseBuilder.success(
        result,
        `Successfully deleted ${result.deletedCount} question(s)`,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
