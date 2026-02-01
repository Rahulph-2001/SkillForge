import { Request, Response, NextFunction } from 'express';
// Controller for Review operations
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateReviewUseCase } from '../../../application/useCases/review/interfaces/ICreateReviewUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class ReviewController {
    constructor(
        @inject(TYPES.ICreateReviewUseCase) private createReviewUseCase: ICreateReviewUseCase,
        @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
    ) { }

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.createReviewUseCase.execute(userId, req.body);

            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.REVIEW.CREATED,
                HttpStatusCode.CREATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };
}
