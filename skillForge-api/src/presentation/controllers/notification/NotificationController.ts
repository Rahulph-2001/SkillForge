import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { IGetNotificationUseCase } from '../../../application/useCases/notification/interfaces/IGetNotificationsUseCase';
import { IMarkNotificationAsReadUseCase } from '../../../application/useCases/notification/interfaces/IMarkNotificationAsReadUseCase';
import { IMarkAllNotificationsAsReadUseCase } from '../../../application/useCases/notification/interfaces/IMarkAllNotificationsAsReadUseCase';
import { IGetUnreadCountUseCase } from '../../../application/useCases/notification/interfaces/IGetUnreadCountUseCase';
import { IDeleteNotificationUseCase } from '../../../application/useCases/notification/interfaces/IDeleteNotificationUseCase';
import { ListNotificationsQuerySchema } from '../../../application/dto/notification/ListNotificationsDTO';

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.IGetNotificationsUseCase) private readonly getNotificationsUseCase: IGetNotificationUseCase,
    @inject(TYPES.IMarkNotificationAsReadUseCase) private readonly markAsReadUseCase: IMarkNotificationAsReadUseCase,
    @inject(TYPES.IMarkAllNotificationsAsReadUseCase) private readonly markAllAsReadUseCase: IMarkAllNotificationsAsReadUseCase,
    @inject(TYPES.IGetUnreadCountUseCase) private readonly getUnreadCountUseCase: IGetUnreadCountUseCase,
    @inject(TYPES.IDeleteNotificationUseCase) private readonly deleteNotificationUseCase: IDeleteNotificationUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  public getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const query = ListNotificationsQuerySchema.parse(req.query);
      const result = await this.getNotificationsUseCase.execute(userId, query);

      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.NOTIFICATION.FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const result = await this.getUnreadCountUseCase.execute(userId);

      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.NOTIFICATION.COUNT_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const result = await this.markAsReadUseCase.execute(userId, id);

      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.NOTIFICATION.MARKED_READ,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      await this.markAllAsReadUseCase.execute(userId);

      const response = this.responseBuilder.success(
        null,
        SUCCESS_MESSAGES.NOTIFICATION.ALL_MARKED_READ,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      await this.deleteNotificationUseCase.execute(userId, id);

      const response = this.responseBuilder.success(
        null,
        SUCCESS_MESSAGES.NOTIFICATION.DELETED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}