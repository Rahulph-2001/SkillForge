import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { IGetUpcomingSessionsUseCase } from './interfaces/IGetUpcomingSessionsUseCase';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
export declare class GetUpcomingSessionsUseCase implements IGetUpcomingSessionsUseCase {
    private readonly bookingRepository;
    private readonly bookingMapper;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper);
    execute(userId: string): Promise<BookingResponseDTO[]>;
}
//# sourceMappingURL=GetUpcomingSessionsUseCase.d.ts.map