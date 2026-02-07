import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { INotificationMapper } from '../../mappers/interfaces/INotificationMapper';
import { ListNotificationsQueryDTO, ListNotificationsResponseDTO } from '../../dto/notification/ListNotificationsDTO';
import { IGetNotificationUseCase } from './interfaces/IGetNotificationsUseCase';
export declare class GetNotificationsUseCase implements IGetNotificationUseCase {
    private readonly notificationRepository;
    private readonly notificationMapper;
    constructor(notificationRepository: INotificationRepository, notificationMapper: INotificationMapper);
    execute(userId: string, query: ListNotificationsQueryDTO): Promise<ListNotificationsResponseDTO>;
}
//# sourceMappingURL=GetNotificationsUseCase.d.ts.map