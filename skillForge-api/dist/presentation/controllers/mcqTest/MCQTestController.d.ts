import { Request, Response } from 'express';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
export declare class MCQTestController {
    private readonly templateQuestionRepository;
    private readonly skillTemplateRepository;
    constructor(templateQuestionRepository: ITemplateQuestionRepository, skillTemplateRepository: ISkillTemplateRepository);
    getTest(req: Request, res: Response): Promise<void>;
    submitTest(req: Request, res: Response): Promise<void>;
    getHistory(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MCQTestController.d.ts.map