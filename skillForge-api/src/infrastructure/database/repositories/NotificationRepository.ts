import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { Notification } from '../../../domain/entities/Notification';
import { INotificationRepository, NotificationFilters, PaginatedNotifications } from '../../../domain/repositories/INotificationRepository';

@injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(@inject(TYPES.Database) private readonly db: Database) { }

  private get prisma() {
    return this.db.getClient();
  }

  async create(notification: Notification): Promise<Notification> {
    const data = notification.toJSON();
    const created = await this.prisma.notification.create({
      data: {
        id: data.id as string,
        userId: data.userId as string,
        type: data.type as any,
        title: data.title as string,
        message: data.message as string,
        data: data.data as any,
        isRead: data.isRead as boolean,
        readAt: data.readAt as Date | null,
        createdAt: data.createdAt as Date,
      },
    });
    return Notification.fromDatabaseRow(created as unknown as Record<string, unknown>);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return notification ? Notification.fromDatabaseRow(notification as unknown as Record<string, unknown>) : null;
  }

  async findByUserId(userId: string, filters?: NotificationFilters): Promise<PaginatedNotifications> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications: notifications.map((n: any) => Notification.fromDatabaseRow(n as unknown as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(id: string): Promise<Notification> {
    const updated = await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return Notification.fromDatabaseRow(updated as unknown as Record<string, unknown>);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }
}