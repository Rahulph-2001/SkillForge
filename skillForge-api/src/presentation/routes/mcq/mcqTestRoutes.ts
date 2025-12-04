import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { MCQTestController } from '../../controllers/mcq/MCQTestController';
import { authMiddleware } from '../../middlewares/authMiddleware';

@injectable()
export class MCQTestRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.MCQTestController) private mcqTestController: MCQTestController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    
    this.router.get('/start/:skillId', authMiddleware, this.mcqTestController.startTest);

    
    this.router.post('/submit', authMiddleware, this.mcqTestController.submitTest);
  }

  public getRouter(): Router {
    return this.router;
  }
}
