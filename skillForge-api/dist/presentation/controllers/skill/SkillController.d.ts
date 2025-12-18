import { Request, Response, NextFunction } from 'express';
import { ICreateSkillUseCase } from '../../../application/useCases/skill/interfaces/ICreateSkillUseCase';
import { IListUserSkillsUseCase } from '../../../application/useCases/skill/interfaces/IListUserSkillsUseCase';
import { IUpdateSkillUseCase } from '../../../application/useCases/skill/UpdateSkillUseCase';
import { IToggleSkillBlockUseCase } from '../../../application/useCases/skill/ToggleSkillBlockUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class SkillController {
    private readonly createSkillUseCase;
    private readonly listUserSkillsUseCase;
    private readonly updateSkillUseCase;
    private readonly toggleSkillBlockUseCase;
    private readonly responseBuilder;
    constructor(createSkillUseCase: ICreateSkillUseCase, listUserSkillsUseCase: IListUserSkillsUseCase, updateSkillUseCase: IUpdateSkillUseCase, toggleSkillBlockUseCase: IToggleSkillBlockUseCase, responseBuilder: IResponseBuilder);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listMySkills: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    toggleBlock: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=SkillController.d.ts.map