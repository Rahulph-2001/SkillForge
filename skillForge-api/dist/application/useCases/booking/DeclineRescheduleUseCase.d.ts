import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface DeclineRescheduleRequest {
    bookingId: string;
    userId: string;
    reason: string;
}
export declare class DeclineRescheduleUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: DeclineRescheduleRequest): Promise<void>;
}
//# sourceMappingURL=DeclineRescheduleUseCase.d.ts.map