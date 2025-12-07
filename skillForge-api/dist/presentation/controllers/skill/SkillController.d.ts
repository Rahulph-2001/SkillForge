import { Request, Response, NextFunction } from 'express';
import { ICreateSkillUseCase } from '../../../application/useCases/skill/interfaces/ICreateSkillUseCase';
import { IListUserSkillsUseCase } from '../../../application/useCases/skill/interfaces/IListUserSkillsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class SkillController {
    private readonly createSkillUseCase;
    private readonly listUserSkillsUseCase;
    private readonly responseBuilder;
    constructor(createSkillUseCase: ICreateSkillUseCase, listUserSkillsUseCase: IListUserSkillsUseCase, responseBuilder: IResponseBuilder);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listMySkills: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=SkillController.d.ts.map