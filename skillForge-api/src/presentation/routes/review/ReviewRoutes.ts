import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ReviewController } from '../../controllers/review/ReviewController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateBody } from '../../middlewares/validationMiddleware';
import { CreateReviewSchema } from '../../../application/dto/review/CreateReviewDTO';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class ReviewRoutes {
    public readonly router: Router = Router();

    constructor(
        @inject(TYPES.ReviewController) private controller: ReviewController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(authMiddleware);
        this.router.post(ENDPOINTS.REVIEW.ROOT, validateBody(CreateReviewSchema), this.controller.create);
    }
}

