import { Notification } from '../entities/Notification';
export interface NotificationFilters {
    isRead?: boolean;
    page?: number;
    limit?: number;
}
export interface PaginatedNotifications {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface INotificationRepository {
    create(notification: Notification): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string, filters?: NotificationFilters): Promise<PaginatedNotifications>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=INotificationRepository.d.ts.map