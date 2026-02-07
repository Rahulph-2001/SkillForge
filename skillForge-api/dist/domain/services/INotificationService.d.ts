import { Notification, NotificationType } from '../entities/Notification';
export interface SendNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
}
export interface INotificationService {
    send(params: SendNotificationParams): Promise<Notification>;
    sendToMany(userIds: string[], params: Omit<SendNotificationParams, 'userId'>): Promise<void>;
}
//# sourceMappingURL=INotificationService.d.ts.map