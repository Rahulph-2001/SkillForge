import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface RescheduleBookingRequest {
    bookingId: string;
    userId: string;
    newDate: string;
    newTime: string;
    reason: string;
}
export interface RescheduleBookingResponse {
    success: boolean;
    message: string;
}
export declare class RescheduleBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: RescheduleBookingRequest): Promise<RescheduleBookingResponse>;
}
//# sourceMappingURL=RescheduleBookingUseCase.d.ts.map