import { Booking } from '../../domain/entities/Booking';
import { BookingResponseDTO } from '../dto/booking/BookingResponseDTO';
import { IBookingMapper } from './interfaces/IBookingMapper';
export declare class BookingMapper implements IBookingMapper {
    toDTO(booking: Booking): BookingResponseDTO;
    toDTOs(bookings: Booking[]): BookingResponseDTO[];
}
//# sourceMappingURL=BookingMapper.d.ts.map