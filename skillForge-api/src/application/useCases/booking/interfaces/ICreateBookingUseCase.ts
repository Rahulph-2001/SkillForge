import { CreateBookingRequestDTO } from '../../../dto/booking/CreateBookingRequestDTO';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

export interface ICreateBookingUseCase {
  execute(request: CreateBookingRequestDTO): Promise<BookingResponseDTO>;
}
