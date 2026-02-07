import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { IDeleteNotificationUseCase } from './interfaces/IDeleteNotificationUseCase';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

@injectable()
export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
    constructor(
        @inject(TYPES.INotificationRepository) private readonly notificationRepository: INotificationRepository
    ) {}

    async execute(userId: string, notificationId: string): Promise< void> {
        const notification = await this.notificationRepository.findById(notificationId)
    if (!notification) {
      throw new NotFoundError(ERROR_MESSAGES.NOTIFICATION.NOT_FOUND);
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError(ERROR_MESSAGES.NOTIFICATION.UNAUTHORIZED);
    }
    await this.notificationRepository.delete(notificationId)
        
    }
}