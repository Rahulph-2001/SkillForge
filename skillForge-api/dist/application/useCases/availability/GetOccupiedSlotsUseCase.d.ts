import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export declare class GetOccupiedSlotsUseCase {
    private bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(providerId: string, startDate: string, endDate: string): Promise<{
        start: string;
        end: string;
    }[]>;
}
//# sourceMappingURL=GetOccupiedSlotsUseCase.d.ts.map