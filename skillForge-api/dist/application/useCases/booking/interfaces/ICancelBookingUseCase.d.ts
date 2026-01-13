import { CancelBookingRequestDTO } from '../../../dto/booking/CancelBookingRequestDTO';
export interface ICancelBookingUseCase {
    execute(request: CancelBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=ICancelBookingUseCase.d.ts.map