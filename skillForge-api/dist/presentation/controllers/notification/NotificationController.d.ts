import { Request, Response, NextFunction } from 'express';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { IGetNotificationUseCase } from '../../../application/useCases/notification/interfaces/IGetNotificationsUseCase';
import { IMarkNotificationAsReadUseCase } from '../../../application/useCases/notification/interfaces/IMarkNotificationAsReadUseCase';
import { IMarkAllNotificationsAsReadUseCase } from '../../../application/useCases/notification/interfaces/IMarkAllNotificationsAsReadUseCase';
import { IGetUnreadCountUseCase } from '../../../application/useCases/notification/interfaces/IGetUnreadCountUseCase';
import { IDeleteNotificationUseCase } from '../../../application/useCases/notification/interfaces/IDeleteNotificationUseCase';
export declare class NotificationController {
    private readonly getNotificationsUseCase;
    private readonly markAsReadUseCase;
    private readonly markAllAsReadUseCase;
    private readonly getUnreadCountUseCase;
    private readonly deleteNotificationUseCase;
    private readonly responseBuilder;
    constructor(getNotificationsUseCase: IGetNotificationUseCase, markAsReadUseCase: IMarkNotificationAsReadUseCase, markAllAsReadUseCase: IMarkAllNotificationsAsReadUseCase, getUnreadCountUseCase: IGetUnreadCountUseCase, deleteNotificationUseCase: IDeleteNotificationUseCase, responseBuilder: IResponseBuilder);
    getNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUnreadCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=NotificationController.d.ts.map