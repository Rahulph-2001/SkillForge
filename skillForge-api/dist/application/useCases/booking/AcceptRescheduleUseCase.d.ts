import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface AcceptRescheduleRequest {
    bookingId: string;
    providerId: string;
}
export interface AcceptRescheduleResponse {
    success: boolean;
    message: string;
}
export declare class AcceptRescheduleUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: AcceptRescheduleRequest): Promise<AcceptRescheduleResponse>;
}
//# sourceMappingURL=AcceptRescheduleUseCase.d.ts.map