import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ListUsersUseCase } from '../../../application/useCases/admin/ListUsersUseCase';
import { SuspendUserUseCase } from '../../../application/useCases/admin/SuspendUserUseCase';
import { UnsuspendUserUseCase } from '../../../application/useCases/admin/UnsuspendUserUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { handleAsync } from '../../middlewares/responseHandler';
import { SUCCESS_MESSAGES } from '../../../config/messages';

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.ListUsersUseCase) private readonly listUsersUseCase: ListUsersUseCase,
    @inject(TYPES.SuspendUserUseCase) private readonly suspendUserUseCase: SuspendUserUseCase,
    @inject(TYPES.UnsuspendUserUseCase) private readonly unsuspendUserUseCase: UnsuspendUserUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const adminUserId = (req as any).user.userId; // Typed via middleware
      const result = await this.listUsersUseCase.execute(adminUserId);
      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.AUTH.LIST_USERS_SUCCESS
      );
      res.status(response.statusCode).json(response.body);
    }, req, res, next);
  }

  async suspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const adminUserId = (req as any).user.userId;
      const { userId, reason } = req.body;
      const result = await this.suspendUserUseCase.execute(adminUserId, { userId, reason });
      const response = this.responseBuilder.success(
        { message: result.message },
        result.message
      );
      res.status(response.statusCode).json(response.body);
    }, req, res, next);
  }

  async unsuspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const adminUserId = (req as any).user.userId;
      const { userId } = req.body;
      const result = await this.unsuspendUserUseCase.execute(adminUserId, { userId });
      const response = this.responseBuilder.success(
        { message: result.message },
        result.message
      );
      res.status(response.statusCode).json(response.body);
    }, req, res, next);
  }
}