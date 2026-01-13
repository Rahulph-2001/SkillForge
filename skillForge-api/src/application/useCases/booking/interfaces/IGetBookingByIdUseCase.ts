import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

export interface IGetBookingByIdUseCase {
  execute(bookingId: string, userId: string): Promise<BookingResponseDTO>;
}