import { injectable, inject } from 'inversify'
import { TYPES } from '../../../infrastructure/di/types'
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository'
import { INotificationMapper } from '../../mappers/interfaces/INotificationMapper'
import { ListNotificationsQueryDTO, ListNotificationsResponseDTO } from '../../dto/notification/ListNotificationsDTO'
import { IGetNotificationUseCase } from './interfaces/IGetNotificationsUseCase'

@injectable()
export class GetNotificationsUseCase implements IGetNotificationUseCase {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly notificationRepository: INotificationRepository,
    @inject(TYPES.INotificationMapper) private readonly notificationMapper: INotificationMapper
  ) { }

  async execute(userId: string, query: ListNotificationsQueryDTO): Promise<ListNotificationsResponseDTO> {
    const { page, limit, isRead } = query;

    const result = await this.notificationRepository.findByUserId(userId, {
      page,
      limit,
      isRead,
    });

    const unreadCount = await this.notificationRepository.getUnreadCount(userId);

    return {
      notifications: this.notificationMapper.toDTOList(result.notifications),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      unreadCount,
    };
  }
}