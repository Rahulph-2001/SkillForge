import { Notification } from '../../domain/entities/Notification';
import { NotificationResponseDTO } from '../dto/notification/NotificationResponseDTO';
import { INotificationMapper } from './interfaces/INotificationMapper';
export declare class NotificationMapper implements INotificationMapper {
    toDTO(notification: Notification): NotificationResponseDTO;
    toDTOList(notifications: Notification[]): NotificationResponseDTO[];
}
//# sourceMappingURL=NotificationMapper.d.ts.map