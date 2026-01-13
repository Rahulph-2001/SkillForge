import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { IAcceptBookingUseCase, AcceptBookingRequestDTO } from './interfaces/IAcceptBookingUseCase';
export declare class AcceptBookingUseCase implements IAcceptBookingUseCase {
    private readonly bookingRepository;
    private readonly bookingMapper;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper);
    execute(request: AcceptBookingRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=AcceptBookingUseCase.d.ts.map