import { Booking } from '../../../domain/entities/Booking';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
export interface IBookingMapper {
    toDTO(booking: Booking): BookingResponseDTO;
    toDTOs(bookings: Booking[]): BookingResponseDTO[];
}
//# sourceMappingURL=IBookingMapper.d.ts.map