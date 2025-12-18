/**
 * Decline Booking Use Case
 * Handles the business logic for declining a booking request
 * Following Single Responsibility Principle and Clean Architecture
 */
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface DeclineBookingRequest {
    bookingId: string;
    providerId: string;
    reason?: string;
}
export declare class DeclineBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: DeclineBookingRequest): Promise<void>;
}
//# sourceMappingURL=DeclineBookingUseCase.d.ts.map