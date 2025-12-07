import { Request, Response, NextFunction } from 'express';
import { IBrowseSkillsUseCase } from '../../application/useCases/skill/interfaces/IBrowseSkillsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
export declare class BrowseSkillsController {
    private browseSkillsUseCase;
    private responseBuilder;
    constructor(browseSkillsUseCase: IBrowseSkillsUseCase, responseBuilder: IResponseBuilder);
    browse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BrowseSkillsController.d.ts.map