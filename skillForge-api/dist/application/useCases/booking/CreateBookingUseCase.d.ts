import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { ICreateBookingUseCase } from './interfaces/ICreateBookingUseCase';
import { CreateBookingRequestDTO } from '../../dto/booking/CreateBookingRequestDTO';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
export declare class CreateBookingUseCase implements ICreateBookingUseCase {
    private skillRepository;
    private userRepository;
    private bookingRepository;
    private availabilityRepository;
    private bookingMapper;
    constructor(skillRepository: ISkillRepository, userRepository: IUserRepository, bookingRepository: IBookingRepository, availabilityRepository: IAvailabilityRepository, bookingMapper: IBookingMapper);
    execute(request: CreateBookingRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=CreateBookingUseCase.d.ts.map