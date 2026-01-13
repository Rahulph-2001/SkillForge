import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';
export interface IGetUpcomingSessionsUseCase {
    execute(userId: string): Promise<BookingResponseDTO[]>;
}
//# sourceMappingURL=IGetUpcomingSessionsUseCase.d.ts.map