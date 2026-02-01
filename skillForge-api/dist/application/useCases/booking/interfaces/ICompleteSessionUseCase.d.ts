import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';
export interface CompleteSessionRequestDTO {
    bookingId: string;
    completedBy: string;
}
export interface ICompleteSessionUseCase {
    execute(request: CompleteSessionRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=ICompleteSessionUseCase.d.ts.map