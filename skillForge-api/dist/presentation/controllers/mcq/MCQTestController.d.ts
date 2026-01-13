import { Request, Response, NextFunction } from 'express';
import { IStartMCQTestUseCase } from '../../../application/useCases/mcq/interfaces/IStartMCQTestUseCase';
import { ISubmitMCQTestUseCase } from '../../../application/useCases/mcq/interfaces/ISubmitMCQTestUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class MCQTestController {
    private startMCQTestUseCase;
    private submitMCQTestUseCase;
    private responseBuilder;
    constructor(startMCQTestUseCase: IStartMCQTestUseCase, submitMCQTestUseCase: ISubmitMCQTestUseCase, responseBuilder: IResponseBuilder);
    startTest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Submit MCQ test answers
     * POST /api/v1/mcq/submit
     */
    submitTest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=MCQTestController.d.ts.map