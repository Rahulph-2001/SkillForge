import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IGetUnreadCountUseCase } from "./interfaces/IGetUnreadCountUseCase";
export declare class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(userId: string): Promise<{
        count: number;
    }>;
}
//# sourceMappingURL=GetUnreadCountUseCase.d.ts.map