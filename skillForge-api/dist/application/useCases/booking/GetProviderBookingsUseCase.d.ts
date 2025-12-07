import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export interface GetProviderBookingsRequest {
    providerId: string;
    status?: string;
}
export interface GetProviderBookingsResponse {
    success: boolean;
    message: string;
    bookings?: any[];
    stats?: {
        pending: number;
        confirmed: number;
        reschedule: number;
        completed: number;
        cancelled: number;
    };
}
export declare class GetProviderBookingsUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: GetProviderBookingsRequest): Promise<GetProviderBookingsResponse>;
}
//# sourceMappingURL=GetProviderBookingsUseCase.d.ts.map