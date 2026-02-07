import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { NotificationController } from '../../controllers/notification/NotificationController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class NotificationRoutes {
  public readonly router: Router;

  constructor(
    @inject(TYPES.NotificationController) private readonly controller: NotificationController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(authMiddleware);

    this.router.get(ENDPOINTS.NOTIFICATION.ROOT, this.controller.getNotifications);
    this.router.get(ENDPOINTS.NOTIFICATION.UNREAD_COUNT, this.controller.getUnreadCount);
    this.router.patch(ENDPOINTS.NOTIFICATION.MARK_READ, this.controller.markAsRead);
    this.router.patch(ENDPOINTS.NOTIFICATION.MARK_ALL_READ, this.controller.markAllAsRead);
    this.router.delete(ENDPOINTS.NOTIFICATION.BY_ID, this.controller.deleteNotification);
  }
}