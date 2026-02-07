import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { IAcceptBookingUseCase, AcceptBookingRequestDTO } from './interfaces/IAcceptBookingUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class AcceptBookingUseCase implements IAcceptBookingUseCase {
    private readonly bookingRepository;
    private readonly bookingMapper;
    private readonly notificationService;
    private readonly skillRepository;
    private readonly userRepository;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper, notificationService: INotificationService, skillRepository: ISkillRepository, userRepository: IUserRepository);
    execute(request: AcceptBookingRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=AcceptBookingUseCase.d.ts.map