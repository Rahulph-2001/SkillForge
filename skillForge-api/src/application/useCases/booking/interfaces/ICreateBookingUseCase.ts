import { type CreateBookingRequestDTO } from '../../../dto/booking/CreateBookingRequestDTO';
import { type BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

export interface ICreateBookingUseCase {
  execute(request: CreateBookingRequestDTO): Promise<BookingResponseDTO>;
}
