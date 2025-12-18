import { Request, Response, NextFunction } from 'express';
import { StartMCQTestUseCase } from '../../../application/useCases/mcq/StartMCQTestUseCase';
import { SubmitMCQTestUseCase } from '../../../application/useCases/mcq/SubmitMCQTestUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class MCQTestController {
    private startMCQTestUseCase;
    private submitMCQTestUseCase;
    private responseBuilder;
    constructor(startMCQTestUseCase: StartMCQTestUseCase, submitMCQTestUseCase: SubmitMCQTestUseCase, responseBuilder: IResponseBuilder);
    startTest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Submit MCQ test answers
     * POST /api/v1/mcq/submit
     */
    submitTest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=MCQTestController.d.ts.map