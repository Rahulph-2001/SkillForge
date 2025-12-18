import { Request, Response, NextFunction } from 'express';
import { IGetSkillDetailsUseCase } from '../../../application/useCases/skill/interfaces/IGetSkillDetailsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class SkillDetailsController {
    private getSkillDetailsUseCase;
    private responseBuilder;
    constructor(getSkillDetailsUseCase: IGetSkillDetailsUseCase, responseBuilder: IResponseBuilder);
    getDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=SkillDetailsController.d.ts.map