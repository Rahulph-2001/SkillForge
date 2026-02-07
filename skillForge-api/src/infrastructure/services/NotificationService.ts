import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { INotificationService, SendNotificationParams } from '../../domain/services/INotificationService';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IWebSocketService } from '../../domain/services/IWebSocketService';
import { Notification } from '../../domain/entities/Notification';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly notificationRepository: INotificationRepository,
    @inject(TYPES.IWebSocketService) private readonly webSocketService: IWebSocketService
  ) {}

  async send(params: SendNotificationParams): Promise<Notification> {
    const notification = new Notification({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data,
    });

    const saved = await this.notificationRepository.create(notification);

    this.webSocketService.sendToUser(params.userId, {
      type: 'notification_received',
      data: {
        id: saved.id,
        type: saved.type,
        title: saved.title,
        message: saved.message,
        data: saved.data,
        createdAt: saved.createdAt,
      },
    });

    return saved;
  }

  async sendToMany(userIds: string[], params: Omit<SendNotificationParams, 'userId'>): Promise<void> {
    await Promise.all(
      userIds.map(userId =>
        this.send({
          userId,
          ...params,
        })
      )
    );
  }
}