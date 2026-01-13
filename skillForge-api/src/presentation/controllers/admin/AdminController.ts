import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IListUsersUseCase } from '../../../application/useCases/admin/interfaces/IListUsersUseCase';
import { ISuspendUserUseCase } from '../../../application/useCases/admin/interfaces/ISuspendUserUseCase';
import { IUnsuspendUserUseCase } from '../../../application/useCases/admin/interfaces/IUnsuspendUserUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.IListUsersUseCase) private readonly listUsersUseCase: IListUsersUseCase,
    @inject(TYPES.ISuspendUserUseCase) private readonly suspendUserUseCase: ISuspendUserUseCase,
    @inject(TYPES.IUnsuspendUserUseCase) private readonly unsuspendUserUseCase: IUnsuspendUserUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
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
      const { targetUserId, reason, duration } = req.body;
      const result = await this.suspendUserUseCase.execute({
        adminUserId,
        targetUserId,
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
      const { targetUserId } = req.body;
      const result = await this.unsuspendUserUseCase.execute({
        adminUserId,
        targetUserId,
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
}