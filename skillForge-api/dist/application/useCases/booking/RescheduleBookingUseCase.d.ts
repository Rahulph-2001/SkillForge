import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface RescheduleBookingRequest {
    bookingId: string;
    userId: string;
    newDate: string;
    newTime: string;
    reason: string;
}
export declare class RescheduleBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: RescheduleBookingRequest): Promise<void>;
}
//# sourceMappingURL=RescheduleBookingUseCase.d.ts.map