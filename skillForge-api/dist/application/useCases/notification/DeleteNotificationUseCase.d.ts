import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { IDeleteNotificationUseCase } from './interfaces/IDeleteNotificationUseCase';
export declare class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(userId: string, notificationId: string): Promise<void>;
}
//# sourceMappingURL=DeleteNotificationUseCase.d.ts.map