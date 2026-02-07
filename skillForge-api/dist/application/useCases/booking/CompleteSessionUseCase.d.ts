import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { ICompleteSessionUseCase, CompleteSessionRequestDTO } from './interfaces/ICompleteSessionUseCase';
import { Database } from '../../../infrastructure/database/Database';
import { INotificationService } from '../../../domain/services/INotificationService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
export declare class CompleteSessionUseCase implements ICompleteSessionUseCase {
    private readonly bookingRepository;
    private readonly escrowRepository;
    private readonly bookingMapper;
    private readonly database;
    private readonly notificationService;
    private readonly userRepository;
    private readonly skillRepository;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository, bookingMapper: IBookingMapper, database: Database, notificationService: INotificationService, userRepository: IUserRepository, skillRepository: ISkillRepository);
    execute(request: CompleteSessionRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=CompleteSessionUseCase.d.ts.map