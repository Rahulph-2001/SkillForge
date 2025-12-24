import { Request, Response, NextFunction } from 'express';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class MCQTestController {
    private readonly templateQuestionRepository;
    private readonly skillTemplateRepository;
    private readonly responseBuilder;
    constructor(templateQuestionRepository: ITemplateQuestionRepository, skillTemplateRepository: ISkillTemplateRepository, responseBuilder: IResponseBuilder);
    getTest(req: Request, res: Response, next: NextFunction): Promise<void>;
    submitTest(req: Request, res: Response, next: NextFunction): Promise<void>;
    getHistory(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=MCQTestController.d.ts.map