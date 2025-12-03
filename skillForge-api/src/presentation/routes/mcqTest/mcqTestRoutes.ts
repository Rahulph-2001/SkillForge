import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { MCQTestController } from '../../controllers/mcqTest/MCQTestController';
import { authMiddleware } from '../../middlewares/authMiddleware';

@injectable()
export class MCQTestRoutes {
  public readonly router: Router = Router();

  constructor(
    @inject(TYPES.MCQTestController)
    private readonly mcqTestController: MCQTestController
  ) {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // All routes require user authentication
    this.router.use(authMiddleware);

    // GET /api/v1/mcq-tests/:templateId/:level - Get test questions
    this.router.get(
      '/:templateId/:level',
      this.mcqTestController.getTest.bind(this.mcqTestController)
    );

    // POST /api/v1/mcq-tests/submit - Submit test answers
    this.router.post(
      '/submit',
      this.mcqTestController.submitTest.bind(this.mcqTestController)
    );

    // GET /api/v1/mcq-tests/history - Get user's test history
    this.router.get(
      '/history',
      this.mcqTestController.getHistory.bind(this.mcqTestController)
    );
  }
}
