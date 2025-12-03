import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/di/types';
import { ListPendingSkillsUseCase } from '../../../application/useCases/admin/ListPendingSkillsUseCase';
import { ApproveSkillUseCase } from '../../../application/useCases/admin/ApproveSkillUseCase';
import { RejectSkillUseCase } from '../../../application/useCases/admin/RejectSkillUseCase';
import { GetAllSkillsUseCase } from '../../../application/useCases/admin/GetAllSkillsUseCase';
import { BlockSkillUseCase } from '../../../application/useCases/admin/BlockSkillUseCase';
import { UnblockSkillUseCase } from '../../../application/useCases/admin/UnblockSkillUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class AdminSkillController {
  constructor(
    @inject(TYPES.ListPendingSkillsUseCase) private listPendingSkillsUseCase: ListPendingSkillsUseCase,
    @inject(TYPES.ApproveSkillUseCase) private approveSkillUseCase: ApproveSkillUseCase,
    @inject(TYPES.RejectSkillUseCase) private rejectSkillUseCase: RejectSkillUseCase,
    @inject(TYPES.GetAllSkillsUseCase) private getAllSkillsUseCase: GetAllSkillsUseCase,
    @inject(TYPES.BlockSkillUseCase) private blockSkillUseCase: BlockSkillUseCase,
    @inject(TYPES.UnblockSkillUseCase) private unblockSkillUseCase: UnblockSkillUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}

  /**
   * List all pending skills (passed MCQ, waiting for admin approval)
   * GET /api/v1/admin/skills/pending
   */
  public listPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('🔵 [AdminSkillController] Fetching pending skills for admin review');

      const skills = await this.listPendingSkillsUseCase.execute();

      const response = this.responseBuilder.success(
        skills,
        `Found ${skills.length} skills pending approval`,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [AdminSkillController] Error fetching pending skills:', error);
      next(error);
    }
  };

  /**
   * Approve a skill
   * POST /api/v1/admin/skills/:skillId/approve
   */
  public approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;
      const adminId = (req as any).user.userId;

      console.log(`🔵 [AdminSkillController] Admin ${adminId} approving skill ${skillId}`);

      await this.approveSkillUseCase.execute(skillId, adminId);

      const response = this.responseBuilder.success(
        { skillId, status: 'approved' },
        'Skill approved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [AdminSkillController] Error approving skill:', error);
      next(error);
    }
  };

  /**
   * Reject a skill
   * POST /api/v1/admin/skills/:skillId/reject
   */
  public reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user.userId;

      console.log(`🔵 [AdminSkillController] Admin ${adminId} rejecting skill ${skillId}`);

      // Validate reason
      if (!reason || reason.trim().length === 0) {
        const errorResponse = this.responseBuilder.error(
          'VALIDATION_ERROR',
          'Rejection reason is required',
          HttpStatusCode.BAD_REQUEST
        );
        res.status(errorResponse.statusCode).json(errorResponse.body);
        return;
      }

      await this.rejectSkillUseCase.execute({
        skillId,
        adminId,
        reason,
      });

      const response = this.responseBuilder.success(
        { skillId, status: 'rejected' },
        'Skill rejected successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [AdminSkillController] Error rejecting skill:', error);
      next(error);
    }
  };

  /**
   * Get all skills (for admin management)
   * GET /api/v1/admin/skills
   */
  public getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('🔵 [AdminSkillController] Fetching all skills');

      const skills = await this.getAllSkillsUseCase.execute();

      const response = this.responseBuilder.success(
        skills,
        `Found ${skills.length} skills`,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [AdminSkillController] Error fetching all skills:', error);
      next(error);
    }
  };

  /**
   * Block a skill
   * POST /api/v1/admin/skills/:skillId/block
   */
  public blockSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user.userId;

      console.log(`🔵 [AdminSkillController] Admin ${adminId} blocking skill ${skillId}`);

      // Validate reason
      if (!reason || reason.trim().length === 0) {
        const errorResponse = this.responseBuilder.error(
          'VALIDATION_ERROR',
          'Block reason is required',
          HttpStatusCode.BAD_REQUEST
        );
        res.status(errorResponse.statusCode).json(errorResponse.body);
        return;
      }

      await this.blockSkillUseCase.execute({
        skillId,
        adminId,
        reason,
      });

      const response = this.responseBuilder.success(
        { skillId, isBlocked: true },
        'Skill blocked successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [AdminSkillController] Error blocking skill:', error);
      next(error);
    }
  };

  /**
   * Unblock a skill
   * POST /api/v1/admin/skills/:skillId/unblock
   */
  public unblockSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;
      const adminId = (req as any).user.userId;

      console.log(`🔵 [AdminSkillController] Admin ${adminId} unblocking skill ${skillId}`);

      await this.unblockSkillUseCase.execute(skillId, adminId);

      const response = this.responseBuilder.success(
        { skillId, isBlocked: false },
        'Skill unblocked successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: any) {
      console.error('❌ [AdminSkillController] Error unblocking skill:', error);
      next(error);
    }
  };
}
