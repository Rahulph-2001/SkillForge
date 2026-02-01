import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { CreateBookingRequestDTO } from '../../dto/booking/CreateBookingRequestDTO';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { ICreateBookingUseCase } from './interfaces/ICreateBookingUseCase';
export declare class CreateBookingUseCase implements ICreateBookingUseCase {
    private readonly bookingRepository;
    private readonly skillRepository;
    private readonly userRepository;
    private readonly availabilityRepository;
    private readonly escrowRepository;
    private readonly bookingMapper;
    constructor(bookingRepository: IBookingRepository, skillRepository: ISkillRepository, userRepository: IUserRepository, availabilityRepository: IAvailabilityRepository, escrowRepository: IEscrowRepository, bookingMapper: IBookingMapper);
    execute(request: CreateBookingRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=CreateBookingUseCase.d.ts.map