import { type BookingResponseDTO } from '../../../../dto/booking/BookingResponseDTO';

export interface IAdminCompleteSessionUseCase {
    execute(bookingId: string): Promise<BookingResponseDTO>;
}
