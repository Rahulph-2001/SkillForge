import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { INotificationMapper } from '../../mappers/interfaces/INotificationMapper';
import { NotificationResponseDTO } from '../../dto/notification/NotificationResponseDTO';
import { IMarkNotificationAsReadUseCase } from './interfaces/IMarkNotificationAsReadUseCase';
export declare class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    private readonly notificationRepository;
    private readonly notificationMapper;
    constructor(notificationRepository: INotificationRepository, notificationMapper: INotificationMapper);
    execute(userId: string, notificationId: string): Promise<NotificationResponseDTO>;
}
//# sourceMappingURL=MarkNotificationAsReadUseCase.d.ts.map