import { Request, Response, NextFunction } from 'express';
import { CreateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase';
import { ListTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase';
import { UpdateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase';
import { DeleteTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase';
import { BulkDeleteTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/BulkDeleteTemplateQuestionsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class TemplateQuestionController {
    private readonly createTemplateQuestionUseCase;
    private readonly listTemplateQuestionsUseCase;
    private readonly updateTemplateQuestionUseCase;
    private readonly deleteTemplateQuestionUseCase;
    private readonly bulkDeleteTemplateQuestionsUseCase;
    private readonly responseBuilder;
    constructor(createTemplateQuestionUseCase: CreateTemplateQuestionUseCase, listTemplateQuestionsUseCase: ListTemplateQuestionsUseCase, updateTemplateQuestionUseCase: UpdateTemplateQuestionUseCase, deleteTemplateQuestionUseCase: DeleteTemplateQuestionUseCase, bulkDeleteTemplateQuestionsUseCase: BulkDeleteTemplateQuestionsUseCase, responseBuilder: IResponseBuilder);
    /**
     * POST /api/v1/admin/skill-templates/:templateId/questions
     * Create a new question for a template
     */
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/admin/skill-templates/:templateId/questions
     * List questions for a template (optionally filtered by level)
     */
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/admin/skill-templates/:templateId/questions/:id
     * Update a question
     */
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/admin/skill-templates/:templateId/questions/:id
     * Delete a question
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/admin/skill-templates/:templateId/questions/bulk
     * Bulk delete multiple questions
     */
    bulkDelete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=TemplateQuestionController.d.ts.map