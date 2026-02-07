import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { ICancelBookingUseCase } from './interfaces/ICancelBookingUseCase';
import { CancelBookingRequestDTO } from '../../dto/booking/CancelBookingRequestDTO';
import { INotificationService } from '../../../domain/services/INotificationService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
export declare class CancelBookingUseCase implements ICancelBookingUseCase {
    private readonly bookingRepository;
    private readonly escrowRepository;
    private readonly notificationService;
    private readonly userRepository;
    private readonly skillRepository;
    private static readonly CANCEL_CUTOFF_MINUTES;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository, notificationService: INotificationService, userRepository: IUserRepository, skillRepository: ISkillRepository);
    execute(request: CancelBookingRequestDTO): Promise<void>;
    private parseDateTime;
}
//# sourceMappingURL=CancelBookingUseCase.d.ts.map