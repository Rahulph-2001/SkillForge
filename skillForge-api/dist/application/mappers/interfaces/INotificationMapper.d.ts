import { Notification } from '../../../domain/entities/Notification';
import { NotificationResponseDTO } from '../../dto/notification/NotificationResponseDTO';
export interface INotificationMapper {
    toDTO(notification: Notification): NotificationResponseDTO;
    toDTOList(notifications: Notification[]): NotificationResponseDTO[];
}
//# sourceMappingURL=INotificationMapper.d.ts.map