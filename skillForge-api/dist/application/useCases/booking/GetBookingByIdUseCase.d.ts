import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { IGetBookingByIdUseCase } from './interfaces/IGetBookingByIdUseCase';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
export declare class GetBookingByIdUseCase implements IGetBookingByIdUseCase {
    private readonly bookingRepository;
    private readonly bookingMapper;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper);
    execute(bookingId: string, userId: string): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=GetBookingByIdUseCase.d.ts.map