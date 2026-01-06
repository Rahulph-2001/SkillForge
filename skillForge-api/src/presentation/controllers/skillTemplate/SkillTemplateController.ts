import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/ICreateSkillTemplateUseCase';
import { IListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/interfaces/IListSkillTemplatesUseCase';
import { IUpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/IUpdateSkillTemplateUseCase';
import { IDeleteSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/IDeleteSkillTemplateUseCase';
import { IToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/interfaces/IToggleSkillTemplateStatusUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateSkillTemplateDTO } from '../../../application/dto/skillTemplate/CreateSkillTemplateDTO';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES } from '../../../config/messages';

@injectable()
export class SkillTemplateController {
  constructor(
    @inject(TYPES.ICreateSkillTemplateUseCase) private readonly createSkillTemplateUseCase: ICreateSkillTemplateUseCase,
    @inject(TYPES.IListSkillTemplatesUseCase) private readonly listSkillTemplatesUseCase: IListSkillTemplatesUseCase,
    @inject(TYPES.IUpdateSkillTemplateUseCase) private readonly updateSkillTemplateUseCase: IUpdateSkillTemplateUseCase,
    @inject(TYPES.IDeleteSkillTemplateUseCase) private readonly deleteSkillTemplateUseCase: IDeleteSkillTemplateUseCase,
    @inject(TYPES.IToggleSkillTemplateStatusUseCase) private readonly toggleSkillTemplateStatusUseCase: IToggleSkillTemplateStatusUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  /**
   * POST /api/v1/admin/skill-templates
   * Create a new skill template
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const dto: CreateSkillTemplateDTO = req.body;

      const template = await this.createSkillTemplateUseCase.execute(adminUserId, dto);

      const response = this.responseBuilder.success(
        template.toJSON(),
        'Skill template created successfully',
        HttpStatusCode.CREATED
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/skill-templates
   * List all skill templates
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;

      const templates = await this.listSkillTemplatesUseCase.execute(adminUserId);

      const response = this.responseBuilder.success(
        templates.map(t => t.toJSON()),
        'Skill templates retrieved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/skill-templates/:id
   * Update a skill template
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const templateId = req.params.id;
      const dto = req.body;

      const template = await this.updateSkillTemplateUseCase.execute(adminUserId, templateId, dto);

      const response = this.responseBuilder.success(
        template.toJSON(),
        'Skill template updated successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/skill-templates/:id
   * Delete (soft delete) a skill template
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const templateId = req.params.id;

      await this.deleteSkillTemplateUseCase.execute(adminUserId, templateId);

      const response = this.responseBuilder.success(
        { message: SUCCESS_MESSAGES.TEMPLATE.SKILL_DELETED },
        SUCCESS_MESSAGES.TEMPLATE.SKILL_DELETED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/skill-templates/:id/toggle-status
   * Toggle skill template status (Active/Inactive)
   */
  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user.userId;
      const templateId = req.params.id;

      const template = await this.toggleSkillTemplateStatusUseCase.execute(adminUserId, templateId);

      const response = this.responseBuilder.success(
        template.toJSON(),
        'Skill template status toggled successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/skill-templates/active
   * List all active skill templates (public endpoint for users)
   */
  async listActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const templates = await this.listSkillTemplatesUseCase.executePublic();

      const response = this.responseBuilder.success(
        templates.map((t: any) => t.toJSON()),
        'Active skill templates retrieved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
