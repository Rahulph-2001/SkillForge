import { type Booking } from '../../../domain/entities/Booking';
import { type BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';

export interface IBookingMapper {
  toDTO(booking: Booking): BookingResponseDTO;
  toDTOs(bookings: Booking[]): BookingResponseDTO[];
}
