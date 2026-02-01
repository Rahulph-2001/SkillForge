import { Request, Response, NextFunction } from 'express';
import { ICreateReviewUseCase } from '../../../application/useCases/review/interfaces/ICreateReviewUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class ReviewController {
    private createReviewUseCase;
    private responseBuilder;
    constructor(createReviewUseCase: ICreateReviewUseCase, responseBuilder: IResponseBuilder);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ReviewController.d.ts.map