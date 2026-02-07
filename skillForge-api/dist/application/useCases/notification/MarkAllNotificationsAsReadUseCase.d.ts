import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IMarkAllNotificationsAsReadUseCase } from "./interfaces/IMarkAllNotificationsAsReadUseCase";
export declare class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(userId: string): Promise<void>;
}
//# sourceMappingURL=MarkAllNotificationsAsReadUseCase.d.ts.map