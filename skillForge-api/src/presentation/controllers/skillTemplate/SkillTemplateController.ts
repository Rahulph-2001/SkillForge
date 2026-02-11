import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/ICreateSkillTemplateUseCase';
import { IListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/interfaces/IListSkillTemplatesUseCase';
import { IUpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/IUpdateSkillTemplateUseCase';
import { IToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/interfaces/IToggleSkillTemplateStatusUseCase';
import { IGetSkillTemplateByIdUseCase } from '../../../application/useCases/skillTemplate/interfaces/IGetSkillTemplateByIdUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateSkillTemplateDTO } from '../../../application/dto/skillTemplate/CreateSkillTemplateDTO';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES } from '../../../config/messages';

@injectable()
export class SkillTemplateController {
  constructor(
    @inject(TYPES.ICreateSkillTemplateUseCase) private readonly createSkillTemplateUseCase: ICreateSkillTemplateUseCase,
    @inject(TYPES.IListSkillTemplatesUseCase) private readonly listSkillTemplatesUseCase: IListSkillTemplatesUseCase,
    @inject(TYPES.IGetSkillTemplateByIdUseCase) private readonly getSkillTemplateByIdUseCase: IGetSkillTemplateByIdUseCase,
    @inject(TYPES.IUpdateSkillTemplateUseCase) private readonly updateSkillTemplateUseCase: IUpdateSkillTemplateUseCase,
    @inject(TYPES.IToggleSkillTemplateStatusUseCase) private readonly toggleSkillTemplateStatusUseCase: IToggleSkillTemplateStatusUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  /**
   * POST /api/v1/admin/skill-templates
   * Create a new skill template
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
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

      const adminUserId = req.user!.userId;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limits as string) : 10;
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const status = req.query.status as string | undefined;

      const result = await this.listSkillTemplatesUseCase.execute(
        adminUserId,
        page,
        limit,
        search,
        category,
        status
      );

      const resposne = this.responseBuilder.success(
        result,
        'Skill templates retrieves successfully',
        HttpStatusCode.OK
      );
      res.status(resposne.statusCode).json(resposne.body)

    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/admin/skill-templates/:id
   * Get a single skill template by ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      const templateId = req.params.id;

      const template = await this.getSkillTemplateByIdUseCase.execute(adminUserId, templateId);

      const response = this.responseBuilder.success(
        template.toJSON(),
        'Skill template retrieved successfully',
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
      const adminUserId = req.user!.userId;
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
   * PATCH /api/v1/admin/skill-templates/:id/toggle-status
   * Toggle skill template status (Active/Inactive)
   */
  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
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
        templates.map((t) => t.toJSON()),
        'Active skill templates retrieved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }
}
