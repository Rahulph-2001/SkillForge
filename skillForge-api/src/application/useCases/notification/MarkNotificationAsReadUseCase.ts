import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { INotificationMapper } from '../../mappers/interfaces/INotificationMapper';
import { NotificationResponseDTO } from '../../dto/notification/NotificationResponseDTO';
import { IMarkNotificationAsReadUseCase } from './interfaces/IMarkNotificationAsReadUseCase';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    constructor(
        @inject(TYPES.INotificationRepository) private readonly notificationRepository : INotificationRepository,
        @inject(TYPES.INotificationMapper) private readonly notificationMapper: INotificationMapper
    ) {}

    async execute( userId: string, notificationId: string): Promise<NotificationResponseDTO>{

        const notification = await this.notificationRepository.findById(notificationId)
        if(!notification){
        throw new NotFoundError(ERROR_MESSAGES.NOTIFICATION.NOT_FOUND);
    }
     if (notification.userId !== userId) {
      throw new ForbiddenError(ERROR_MESSAGES.NOTIFICATION.UNAUTHORIZED);
    }

    const updated = await this.notificationRepository.markAsRead(notificationId)
    return this.notificationMapper.toDTO(updated);

    }
}