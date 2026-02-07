import { injectable } from 'inversify';
import { Notification } from '../../domain/entities/Notification';
import { NotificationResponseDTO } from '../dto/notification/NotificationResponseDTO';
import { INotificationMapper } from './interfaces/INotificationMapper';

@injectable()
export class NotificationMapper implements INotificationMapper {
  public toDTO(notification: Notification): NotificationResponseDTO {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }

  public toDTOList(notifications: Notification[]): NotificationResponseDTO[] {
    return notifications.map(n => this.toDTO(n));
  }
}