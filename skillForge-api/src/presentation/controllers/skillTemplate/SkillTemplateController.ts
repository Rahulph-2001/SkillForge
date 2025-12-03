import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { CreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/CreateSkillTemplateUseCase';
import { ListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/ListSkillTemplatesUseCase';
import { UpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase';
import { DeleteSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase';
import { ToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateSkillTemplateDTO } from '../../../application/dto/skillTemplate/CreateSkillTemplateDTO';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class SkillTemplateController {
  constructor(
    @inject(TYPES.CreateSkillTemplateUseCase) private readonly createSkillTemplateUseCase: CreateSkillTemplateUseCase,
    @inject(TYPES.ListSkillTemplatesUseCase) private readonly listSkillTemplatesUseCase: ListSkillTemplatesUseCase,
    @inject(TYPES.UpdateSkillTemplateUseCase) private readonly updateSkillTemplateUseCase: UpdateSkillTemplateUseCase,
    @inject(TYPES.DeleteSkillTemplateUseCase) private readonly deleteSkillTemplateUseCase: DeleteSkillTemplateUseCase,
    @inject(TYPES.ToggleSkillTemplateStatusUseCase) private readonly toggleSkillTemplateStatusUseCase: ToggleSkillTemplateStatusUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

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
      const dto = { ...req.body, templateId };
      
      const template = await this.updateSkillTemplateUseCase.execute(adminUserId, dto);
      
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
        { message: 'Skill template deleted successfully' },
        'Skill template deleted successfully',
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
