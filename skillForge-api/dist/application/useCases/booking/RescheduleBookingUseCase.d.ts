import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IRescheduleBookingUseCase, RescheduleBookingRequestDTO } from './interfaces/IRescheduleBookingUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    private readonly bookingRepository;
    private readonly skillRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(bookingRepository: IBookingRepository, skillRepository: ISkillRepository, userRepository: IUserRepository, notificationService: INotificationService);
    execute(request: RescheduleBookingRequestDTO): Promise<void>;
    private parseDateTime;
}
//# sourceMappingURL=RescheduleBookingUseCase.d.ts.map