import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IDeclineRescheduleUseCase, DeclineRescheduleRequestDTO } from './interfaces/IDeclineRescheduleUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class DeclineRescheduleUseCase implements IDeclineRescheduleUseCase {
    private readonly bookingRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(bookingRepository: IBookingRepository, userRepository: IUserRepository, notificationService: INotificationService);
    execute(request: DeclineRescheduleRequestDTO): Promise<void>;
}
//# sourceMappingURL=DeclineRescheduleUseCase.d.ts.map