import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface DeclineRescheduleRequest {
    bookingId: string;
    providerId: string;
    reason: string;
}
export interface DeclineRescheduleResponse {
    success: boolean;
    message: string;
}
export declare class DeclineRescheduleUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: DeclineRescheduleRequest): Promise<DeclineRescheduleResponse>;
}
//# sourceMappingURL=DeclineRescheduleUseCase.d.ts.map