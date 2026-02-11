import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/di/types';
import { IListPendingSkillsUseCase } from '../../../application/useCases/admin/interfaces/IListPendingSkillsUseCase';
import { IApproveSkillUseCase } from '../../../application/useCases/admin/interfaces/IApproveSkillUseCase';
import { IRejectSkillUseCase } from '../../../application/useCases/admin/interfaces/IRejectSkillUseCase';
import { IGetAllSkillsUseCase } from '../../../application/useCases/admin/interfaces/IGetAllSkillsUseCase';
import { IBlockSkillUseCase } from '../../../application/useCases/admin/interfaces/IBlockSkillUseCase';
import { IUnblockSkillUseCase } from '../../../application/useCases/admin/interfaces/IUnblockSkillUseCase';
import { IAdminListSkillsUseCase } from '../../../application/useCases/admin/interfaces/IAdminListSkillsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class AdminSkillController {
  constructor(
    @inject(TYPES.IListPendingSkillsUseCase) private listPendingSkillsUseCase: IListPendingSkillsUseCase,
    @inject(TYPES.IApproveSkillUseCase) private approveSkillUseCase: IApproveSkillUseCase,
    @inject(TYPES.IRejectSkillUseCase) private rejectSkillUseCase: IRejectSkillUseCase,
    @inject(TYPES.IGetAllSkillsUseCase) private getAllSkillsUseCase: IGetAllSkillsUseCase,
    @inject(TYPES.IBlockSkillUseCase) private blockSkillUseCase: IBlockSkillUseCase,
    @inject(TYPES.IUnblockSkillUseCase) private unblockSkillUseCase: IUnblockSkillUseCase,
    @inject(TYPES.IAdminListSkillsUseCase) private adminListSkillsUseCase: IAdminListSkillsUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) { }

  /**
   * List all pending skills (passed MCQ, waiting for admin approval)
   * GET /api/v1/admin/skills/pending
   */
  public listPending = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = await this.listPendingSkillsUseCase.execute();

      const response = this.responseBuilder.success(
        skills,
        SUCCESS_MESSAGES.SKILL.PENDING_FETCHED(skills.length),
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
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
      const adminId = req.user!.userId;

      await this.approveSkillUseCase.execute(skillId, adminId);

      const response = this.responseBuilder.success(
        { skillId, status: 'approved' },
        SUCCESS_MESSAGES.SKILL.APPROVED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
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
      const adminId = req.user!.userId;

      // Validate reason
      if (!reason || reason.trim().length === 0) {
        const errorResponse = this.responseBuilder.error(
          'VALIDATION_ERROR',
          ERROR_MESSAGES.SKILL.REJECTION_REASON_REQUIRED,
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
        SUCCESS_MESSAGES.SKILL.REJECTED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  /**
   * Get all skills (for admin management)
   * GET /api/v1/admin/skills
   */
  public getAllSkills = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = await this.getAllSkillsUseCase.execute();

      const response = this.responseBuilder.success(
        skills,
        SUCCESS_MESSAGES.SKILL.ALL_FETCHED(skills.length),
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };

  /**
   * List all skills with pagination and filters (for admin management)
   * GET /api/v1/admin/skills
   */
  public listSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminUserId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const status = req.query.status as 'in-review' | 'approved' | 'rejected' | undefined;
      const isBlocked = req.query.isBlocked === 'true' ? true : req.query.isBlocked === 'false' ? false : undefined;

      const result = await this.adminListSkillsUseCase.execute({
        adminUserId,
        page,
        limit,
        search,
        status,
        isBlocked,
      });

      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.SKILL.ALL_FETCHED(result.total),
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
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
      const adminId = req.user!.userId;

      // Validate reason
      if (!reason || reason.trim().length === 0) {
        const errorResponse = this.responseBuilder.error(
          'VALIDATION_ERROR',
          ERROR_MESSAGES.SKILL.BLOCK_REASON_REQUIRED,
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
        SUCCESS_MESSAGES.SKILL.BLOCKED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
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
      const adminId = req.user!.userId;

      await this.unblockSkillUseCase.execute(skillId, adminId);

      const response = this.responseBuilder.success(
        { skillId, isBlocked: false },
        SUCCESS_MESSAGES.SKILL.UNBLOCKED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error: unknown) {
      next(error);
    }
  };
}
