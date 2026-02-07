import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAcceptRescheduleUseCase, AcceptRescheduleRequestDTO } from './interfaces/IAcceptRescheduleUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class AcceptRescheduleUseCase implements IAcceptRescheduleUseCase {
    private readonly bookingRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(bookingRepository: IBookingRepository, userRepository: IUserRepository, notificationService: INotificationService);
    execute(request: AcceptRescheduleRequestDTO): Promise<void>;
}
//# sourceMappingURL=AcceptRescheduleUseCase.d.ts.map