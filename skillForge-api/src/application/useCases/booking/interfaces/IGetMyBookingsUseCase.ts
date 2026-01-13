import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

export interface IGetMyBookingsUseCase {
  execute(userId: string): Promise<BookingResponseDTO[]>;
}