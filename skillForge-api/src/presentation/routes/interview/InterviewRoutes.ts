import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateBody } from '../../middlewares/validationMiddleware';
import { ScheduleInterviewSchema } from '../../../application/dto/interview/ScheduleInterviewDTO';
import { InterviewController } from '../../controllers/interview/InterviewController';

@injectable()
export class InterviewRoutes {
    public readonly router: Router = Router();

    constructor(
        @inject(TYPES.InterviewController) private readonly controller: InterviewController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(authMiddleware);

        // Schedule new interview
        this.router.post(
            '/schedule',
            validateBody(ScheduleInterviewSchema),
            this.controller.schedule
        );

        // Get interviews by application ID
        this.router.get(
            '/application/:applicationId',
            this.controller.getByApplication
        );
    }
}
