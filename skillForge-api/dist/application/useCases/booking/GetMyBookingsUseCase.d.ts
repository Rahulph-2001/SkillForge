import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { IGetMyBookingsUseCase } from './interfaces/IGetMyBookingsUseCase';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
export declare class GetMyBookingsUseCase implements IGetMyBookingsUseCase {
    private readonly bookingRepository;
    private readonly bookingMapper;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper);
    execute(userId: string): Promise<BookingResponseDTO[]>;
}
//# sourceMappingURL=GetMyBookingsUseCase.d.ts.map