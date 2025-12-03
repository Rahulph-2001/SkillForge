import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/di/types';
import { StartMCQTestUseCase } from '../../../application/useCases/mcq/StartMCQTestUseCase';
import { SubmitMCQTestUseCase } from '../../../application/useCases/mcq/SubmitMCQTestUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class MCQTestController {
  constructor(
    @inject(TYPES.StartMCQTestUseCase) private startMCQTestUseCase: StartMCQTestUseCase,
    @inject(TYPES.SubmitMCQTestUseCase) private submitMCQTestUseCase: SubmitMCQTestUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}

  /**
   * Start MCQ test for a skill
   * GET /api/v1/mcq/start/:skillId
   */
  public startTest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;
      const userId = (req as any).user.userId;

      console.log(`🔵 [MCQTestController] Starting MCQ test for skill: ${skillId}, user: ${userId}`);

      const testSession = await this.startMCQTestUseCase.execute(skillId, userId);

      const response = this.responseBuilder.success(
        testSession,
        'MCQ test started successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [MCQTestController] Error starting MCQ test:', error);
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

      console.log(`🔵 [MCQTestController] Submitting MCQ test for skill: ${skillId}, user: ${userId}`);

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

      console.log(`✅ [MCQTestController] MCQ test submitted. Score: ${result.score}%, Passed: ${result.passed}`);

      const response = this.responseBuilder.success(
        result,
        'MCQ test submitted successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [MCQTestController] Error submitting MCQ test:', error);
      next(error);
    }
  };
}
