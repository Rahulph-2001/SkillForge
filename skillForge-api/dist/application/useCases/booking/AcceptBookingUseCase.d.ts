import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
export interface AcceptBookingRequest {
    bookingId: string;
    providerId: string;
}
export declare class AcceptBookingUseCase {
    private readonly bookingRepository;
    private readonly bookingMapper;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper);
    execute(request: AcceptBookingRequest): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=AcceptBookingUseCase.d.ts.map