import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/di/types';
import { IStartMCQTestUseCase } from '../../../application/useCases/mcq/interfaces/IStartMCQTestUseCase';
import { ISubmitMCQTestUseCase } from '../../../application/useCases/mcq/interfaces/ISubmitMCQTestUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class MCQTestController {
  constructor(
    @inject(TYPES.IStartMCQTestUseCase) private startMCQTestUseCase: IStartMCQTestUseCase,
    @inject(TYPES.ISubmitMCQTestUseCase) private submitMCQTestUseCase: ISubmitMCQTestUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) { }


  public startTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;
      const userId = (req as any).user.userId;

      const testSession = await this.startMCQTestUseCase.execute({ skillId, userId });

      const response = this.responseBuilder.success(
        testSession,
        'MCQ test started successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Submit MCQ test answers
   * POST /api/v1/mcq/submit
   */
  public submitTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { skillId, questionIds, answers, timeTaken } = req.body;

      // Validate input
      if (!skillId || !Array.isArray(questionIds) || !Array.isArray(answers)) {
        const errorResponse = this.responseBuilder.error(
          'VALIDATION_ERROR',
          'Invalid request: skillId, questionIds, and answers are required',
          HttpStatusCode.BAD_REQUEST
        );
        res.status(errorResponse.statusCode).json(errorResponse.body);
        return;
      }

      if (questionIds.length !== answers.length) {
        const errorResponse = this.responseBuilder.error(
          'VALIDATION_ERROR',
          'Number of questionIds must match number of answers',
          HttpStatusCode.BAD_REQUEST
        );
        res.status(errorResponse.statusCode).json(errorResponse.body);
        return;
      }

      const result = await this.submitMCQTestUseCase.execute({
        skillId,
        userId,
        questionIds,
        answers,
        timeTaken,
      });

      const response = this.responseBuilder.success(
        result,
        'MCQ test submitted successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      next(error);
    }
  };
}
