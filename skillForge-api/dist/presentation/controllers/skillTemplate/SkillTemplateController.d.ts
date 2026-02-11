import { Request, Response, NextFunction } from 'express';
import { ICreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/ICreateSkillTemplateUseCase';
import { IListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/interfaces/IListSkillTemplatesUseCase';
import { IUpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/IUpdateSkillTemplateUseCase';
import { IToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/interfaces/IToggleSkillTemplateStatusUseCase';
import { IGetSkillTemplateByIdUseCase } from '../../../application/useCases/skillTemplate/interfaces/IGetSkillTemplateByIdUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class SkillTemplateController {
    private readonly createSkillTemplateUseCase;
    private readonly listSkillTemplatesUseCase;
    private readonly getSkillTemplateByIdUseCase;
    private readonly updateSkillTemplateUseCase;
    private readonly toggleSkillTemplateStatusUseCase;
    private readonly responseBuilder;
    constructor(createSkillTemplateUseCase: ICreateSkillTemplateUseCase, listSkillTemplatesUseCase: IListSkillTemplatesUseCase, getSkillTemplateByIdUseCase: IGetSkillTemplateByIdUseCase, updateSkillTemplateUseCase: IUpdateSkillTemplateUseCase, toggleSkillTemplateStatusUseCase: IToggleSkillTemplateStatusUseCase, responseBuilder: IResponseBuilder);
    /**
     * POST /api/v1/admin/skill-templates
     * Create a new skill template
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/admin/skill-templates
     * List all skill templates
     */
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/admin/skill-templates/:id
     * Get a single skill template by ID
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/admin/skill-templates/:id
     * Update a skill template
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/v1/admin/skill-templates/:id/toggle-status
     * Toggle skill template status (Active/Inactive)
     */
    toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/skill-templates/active
     * List all active skill templates (public endpoint for users)
     */
    listActive(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=SkillTemplateController.d.ts.map