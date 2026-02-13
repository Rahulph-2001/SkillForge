import { IAdminNotificationService, SendAdminNotificationParams } from '../../domain/services/IAdminNotificationService';
import { INotificationService } from '../../domain/services/INotificationService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
export declare class AdminNotificationService implements IAdminNotificationService {
    private readonly userRepository;
    private readonly notificationService;
    constructor(userRepository: IUserRepository, notificationService: INotificationService);
    notifyAllAdmins(params: SendAdminNotificationParams): Promise<void>;
}
//# sourceMappingURL=AdminNotificationService.d.ts.map