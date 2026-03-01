import { type BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

export interface IGetUpcomingSessionsUseCase {
  execute(userId: string): Promise<BookingResponseDTO[]>;
}