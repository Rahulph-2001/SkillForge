import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { AdminSkillController } from '../../controllers/admin/AdminSkillController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { ENDPOINTS } from '../../../config/routes';

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


    this.router.get(ENDPOINTS.ADMIN_SKILL.PENDING, this.adminSkillController.listPending);


    this.router.post(ENDPOINTS.ADMIN_SKILL.APPROVE, this.adminSkillController.approve);


    this.router.post(ENDPOINTS.ADMIN_SKILL.REJECT, this.adminSkillController.reject);


    this.router.get(ENDPOINTS.ADMIN_SKILL.ROOT, this.adminSkillController.getAllSkills);


    this.router.post(ENDPOINTS.ADMIN_SKILL.BLOCK, this.adminSkillController.blockSkill);


    this.router.post(ENDPOINTS.ADMIN_SKILL.UNBLOCK, this.adminSkillController.unblockSkill);
  }

  public getRouter(): Router {
    return this.router;
  }
}

