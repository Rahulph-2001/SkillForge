import { Database } from '../Database';
import { Notification } from '../../../domain/entities/Notification';
import { INotificationRepository, NotificationFilters, PaginatedNotifications } from '../../../domain/repositories/INotificationRepository';
export declare class NotificationRepository implements INotificationRepository {
    private readonly db;
    constructor(db: Database);
    private get prisma();
    create(notification: Notification): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string, filters?: NotificationFilters): Promise<PaginatedNotifications>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=NotificationRepository.d.ts.map