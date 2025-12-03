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

    /**
     * @route   GET /api/v1/admin/skills/pending
     * @desc    List all skills pending admin approval (passed MCQ)
     * @access  Admin only
     */
    this.router.get('/pending', this.adminSkillController.listPending);

    /**
     * @route   POST /api/v1/admin/skills/:skillId/approve
     * @desc    Approve a skill
     * @access  Admin only
     */
    this.router.post('/:skillId/approve', this.adminSkillController.approve);

    /**
     * @route   POST /api/v1/admin/skills/:skillId/reject
     * @desc    Reject a skill with reason
     * @access  Admin only
     */
    this.router.post('/:skillId/reject', this.adminSkillController.reject);

    /**
     * @route   GET /api/v1/admin/skills
     * @desc    Get all skills (approved, pending, rejected, blocked)
     * @access  Admin only
     */
    this.router.get('/', this.adminSkillController.getAllSkills);

    /**
     * @route   POST /api/v1/admin/skills/:skillId/block
     * @desc    Block an approved skill
     * @access  Admin only
     */
    this.router.post('/:skillId/block', this.adminSkillController.blockSkill);

    /**
     * @route   POST /api/v1/admin/skills/:skillId/unblock
     * @desc    Unblock a blocked skill
     * @access  Admin only
     */
    this.router.post('/:skillId/unblock', this.adminSkillController.unblockSkill);
  }

  public getRouter(): Router {
    return this.router;
  }
}
