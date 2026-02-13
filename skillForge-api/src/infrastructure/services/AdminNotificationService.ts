import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { IAdminNotificationService, SendAdminNotificationParams } from '../../domain/services/IAdminNotificationService';
import { INotificationService } from '../../domain/services/INotificationService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class AdminNotificationService implements IAdminNotificationService {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
    ) { }

    async notifyAllAdmins(params: SendAdminNotificationParams): Promise<void> {
        const admins = await this.userRepository.findAllAdmins();

        if (admins.length === 0) {
            return;
        }

        await this.notificationService.sendToMany(
            admins.map(admin => admin.id),
            {
                type: params.type,
                title: params.title,
                message: params.message,
                data: params.data
            }
        );
    }
}
