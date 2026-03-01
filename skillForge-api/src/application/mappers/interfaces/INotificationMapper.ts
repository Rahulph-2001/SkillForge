import { type Notification } from '../../../domain/entities/Notification';
import { type NotificationResponseDTO } from '../../dto/notification/NotificationResponseDTO';

export interface INotificationMapper {
  toDTO(notification: Notification): NotificationResponseDTO;
  toDTOList(notifications: Notification[]): NotificationResponseDTO[];
}