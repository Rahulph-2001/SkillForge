import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AdminSkillController } from '../../controllers/admin/AdminSkillController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

@injectable()
export class AdminSkillRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.AdminSkillController) private adminSkillController: AdminSkillController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // All routes require authentication and admin role
    this.router.use(authMiddleware, adminMiddleware);

    
    this.router.get('/pending', this.adminSkillController.listPending);

    
    this.router.post('/:skillId/approve', this.adminSkillController.approve);

    
    this.router.post('/:skillId/reject', this.adminSkillController.reject);

    
    this.router.get('/', this.adminSkillController.getAllSkills);

   
    this.router.post('/:skillId/block', this.adminSkillController.blockSkill);

    
    this.router.post('/:skillId/unblock', this.adminSkillController.unblockSkill);
  }

  public getRouter(): Router {
    return this.router;
  }
}
