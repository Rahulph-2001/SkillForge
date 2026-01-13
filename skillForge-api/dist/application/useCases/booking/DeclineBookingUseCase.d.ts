/**
 * Decline Booking Use Case
 * Handles the business logic for declining a booking request
 * Following Single Responsibility Principle and Clean Architecture
 */
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IDeclineBookingUseCase, DeclineBookingRequestDTO } from './interfaces/IDeclineBookingUseCase';
export declare class DeclineBookingUseCase implements IDeclineBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: DeclineBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=DeclineBookingUseCase.d.ts.map