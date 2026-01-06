import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

export interface AcceptBookingRequestDTO {
  bookingId: string;
  providerId: string;
}

export interface IAcceptBookingUseCase {
  execute(request: AcceptBookingRequestDTO): Promise<BookingResponseDTO>;
}

