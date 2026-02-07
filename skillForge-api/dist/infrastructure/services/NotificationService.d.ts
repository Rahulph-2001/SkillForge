import { INotificationService, SendNotificationParams } from '../../domain/services/INotificationService';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IWebSocketService } from '../../domain/services/IWebSocketService';
import { Notification } from '../../domain/entities/Notification';
export declare class NotificationService implements INotificationService {
    private readonly notificationRepository;
    private readonly webSocketService;
    constructor(notificationRepository: INotificationRepository, webSocketService: IWebSocketService);
    send(params: SendNotificationParams): Promise<Notification>;
    sendToMany(userIds: string[], params: Omit<SendNotificationParams, 'userId'>): Promise<void>;
}
//# sourceMappingURL=NotificationService.d.ts.map