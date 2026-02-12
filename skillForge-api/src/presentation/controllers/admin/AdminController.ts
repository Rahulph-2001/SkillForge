import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IListUsersUseCase } from '../../../application/useCases/admin/interfaces/IListUsersUseCase';
import { ISuspendUserUseCase } from '../../../application/useCases/admin/interfaces/ISuspendUserUseCase';
import { IUnsuspendUserUseCase } from '../../../application/useCases/admin/interfaces/IUnsuspendUserUseCase';
import { IListCommunitiesUseCase } from '../../../application/useCases/admin/interfaces/IListCommunitiesUseCase';
import { IUpdateCommunityByAdminUseCase } from '../../../application/useCases/admin/interfaces/IUpdateCommunityByAdminUseCase';
import { IBlockCommunityUseCase } from '../../../application/useCases/admin/interfaces/IBlockCommunityUseCase';
import { IUnblockCommunityUseCase } from '../../../application/useCases/admin/interfaces/IUnblockCommunityUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { IGetAdminDashboardStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminDashboardStatsUseCase';

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.IListUsersUseCase) private readonly listUsersUseCase: IListUsersUseCase,
    @inject(TYPES.ISuspendUserUseCase) private readonly suspendUserUseCase: ISuspendUserUseCase,
    @inject(TYPES.IUnsuspendUserUseCase) private readonly unsuspendUserUseCase: IUnsuspendUserUseCase,
    @inject(TYPES.IListCommunitiesUseCase) private readonly listCommunitiesUseCase: IListCommunitiesUseCase,
    @inject(TYPES.IUpdateCommunityByAdminUseCase) private readonly updateCommunityUseCase: IUpdateCommunityByAdminUseCase,
    @inject(TYPES.IBlockCommunityUseCase) private readonly blockCommunityUseCase: IBlockCommunityUseCase,
    @inject(TYPES.IUnblockCommunityUseCase) private readonly unblockCommunityUseCase: IUnblockCommunityUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder,
    @inject(TYPES.IGetAdminDashboardStatsUseCase) private readonly getDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
  ) { }

  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const role = req.query.role as 'user' | 'admin' | undefined;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

      const result = await this.listUsersUseCase.execute({
        adminUserId,
        page,
        limit,
        search,
        role,
        isActive
      });
      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.AUTH.LIST_USERS_SUCCESS
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async suspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      // Support both 'targetUserId' and 'userId' from frontend
      const { targetUserId, userId, reason, duration } = req.body;
      const userToSuspend = targetUserId || userId;
      const result = await this.suspendUserUseCase.execute({
        adminUserId,
        targetUserId: userToSuspend,
        reason,
        duration
      });
      const response = this.responseBuilder.success(
        { message: result.message },
        result.message
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async unsuspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      // Support both 'targetUserId' and 'userId' from frontend
      const { targetUserId, userId } = req.body;
      const userToUnsuspend = targetUserId || userId;
      const result = await this.unsuspendUserUseCase.execute({
        adminUserId,
        targetUserId: userToUnsuspend,
        reason: '' // Required by DTO but not used for unsuspend
      });
      const response = this.responseBuilder.success(
        { message: result.message },
        result.message
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async listCommunities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

      const result = await this.listCommunitiesUseCase.execute({
        adminUserId,
        page,
        limit,
        search,
        category,
        isActive
      });

      const response = this.responseBuilder.success(
        result,
        'Communities retrieved successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async updateCommunity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      const communityId = req.params.id;
      const { name, description, category, creditsCost, creditsPeriod, isActive } = req.body;

      const result = await this.updateCommunityUseCase.execute({
        adminUserId,
        communityId,
        name,
        description,
        category,
        creditsCost,
        creditsPeriod,
        isActive
      });

      const response = this.responseBuilder.success(
        result,
        'Community updated successfully'
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async blockCommunity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      const communityId = req.params.id;
      const { reason } = req.body;

      const result = await this.blockCommunityUseCase.execute({
        adminUserId,
        communityId,
        reason
      });

      const response = this.responseBuilder.success(
        result,
        result.message
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  async unblockCommunity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.userId;
      const communityId = req.params.id;
      const { reason } = req.body;

      const result = await this.unblockCommunityUseCase.execute({
        adminUserId,
        communityId,
        reason
      });

      const response = this.responseBuilder.success(
        result,
        result.message
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  }

  public getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminUserId = req.user!.userId;
      const result = await this.getDashboardStatsUseCase.execute(adminUserId);

      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.ADMIN.DASHBOARD_STATS_FETCHED
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}