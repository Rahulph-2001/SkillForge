/**
 * Decline Booking Use Case
 * Handles the business logic for declining a booking request
 * Following Single Responsibility Principle
 */
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface DeclineBookingRequest {
    bookingId: string;
    providerId: string;
    reason?: string;
}
export interface DeclineBookingResponse {
    success: boolean;
    message: string;
}
export declare class DeclineBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: DeclineBookingRequest): Promise<DeclineBookingResponse>;
}
//# sourceMappingURL=DeclineBookingUseCase.d.ts.map