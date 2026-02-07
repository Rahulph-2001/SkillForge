import { NotificationResponseDTO } from "../../../dto/notification/NotificationResponseDTO";

export interface IMarkNotificationAsReadUseCase {
    execute(userId: string, notificationId: string): Promise<NotificationResponseDTO>;
}