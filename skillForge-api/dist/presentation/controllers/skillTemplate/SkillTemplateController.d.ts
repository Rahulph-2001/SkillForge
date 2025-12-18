import { Request, Response, NextFunction } from 'express';
import { CreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/CreateSkillTemplateUseCase';
import { ListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/ListSkillTemplatesUseCase';
import { UpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase';
import { DeleteSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase';
import { ToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class SkillTemplateController {
    private readonly createSkillTemplateUseCase;
    private readonly listSkillTemplatesUseCase;
    private readonly updateSkillTemplateUseCase;
    private readonly deleteSkillTemplateUseCase;
    private readonly toggleSkillTemplateStatusUseCase;
    private readonly responseBuilder;
    constructor(createSkillTemplateUseCase: CreateSkillTemplateUseCase, listSkillTemplatesUseCase: ListSkillTemplatesUseCase, updateSkillTemplateUseCase: UpdateSkillTemplateUseCase, deleteSkillTemplateUseCase: DeleteSkillTemplateUseCase, toggleSkillTemplateStatusUseCase: ToggleSkillTemplateStatusUseCase, responseBuilder: IResponseBuilder);
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
     * PUT /api/v1/admin/skill-templates/:id
     * Update a skill template
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/admin/skill-templates/:id
     * Delete (soft delete) a skill template
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
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