import { NotificationType } from '../entities/Notification';
export interface SendAdminNotificationParams {
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
}
export interface IAdminNotificationService {
    notifyAllAdmins(params: SendAdminNotificationParams): Promise<void>;
}
//# sourceMappingURL=IAdminNotificationService.d.ts.map