import { BookingResponseDTO } from '../../../../dto/booking/BookingResponseDTO';
export interface IAdminCancelSessionUseCase {
    execute(bookingId: string, reason: string): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=IAdminCancelSessionUseCase.d.ts.map