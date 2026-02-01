import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IScheduleInterviewUseCase } from '../../../application/useCases/interview/interfaces/IScheduleInterviewUseCase';
import { IGetInterviewUseCase } from '../../../application/useCases/interview/interfaces/IGetInterviewUseCase';
export declare class InterviewController {
    private readonly scheduleUseCase;
    private readonly getInterviewUseCase;
    private readonly responseBuilder;
    constructor(scheduleUseCase: IScheduleInterviewUseCase, getInterviewUseCase: IGetInterviewUseCase, responseBuilder: IResponseBuilder);
    schedule: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByApplication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=InterviewController.d.ts.map