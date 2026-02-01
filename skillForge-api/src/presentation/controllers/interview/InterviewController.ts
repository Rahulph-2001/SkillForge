import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IScheduleInterviewUseCase } from '../../../application/useCases/interview/interfaces/IScheduleInterviewUseCase';
import { IGetInterviewUseCase } from '../../../application/useCases/interview/interfaces/IGetInterviewUseCase';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class InterviewController {
    constructor(
        @inject(TYPES.IScheduleInterviewUseCase) private readonly scheduleUseCase: IScheduleInterviewUseCase,
        @inject(TYPES.IGetInterviewUseCase) private readonly getInterviewUseCase: IGetInterviewUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    public schedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const result = await this.scheduleUseCase.execute(userId, req.body);

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.INTERVIEW.SCHEDULED,
                HttpStatusCode.CREATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public getByApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const { applicationId } = req.params;
            const result = await this.getInterviewUseCase.execute(userId, applicationId);

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.INTERVIEW.FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };
}
