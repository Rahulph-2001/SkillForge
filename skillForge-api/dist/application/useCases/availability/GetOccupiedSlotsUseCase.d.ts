import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IGetOccupiedSlotsUseCase } from './interfaces/IGetOccupiedSlotsUseCase';
export declare class GetOccupiedSlotsUseCase implements IGetOccupiedSlotsUseCase {
    private bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(providerId: string, startDate: string, endDate: string): Promise<{
        start: string;
        end: string;
    }[]>;
}
//# sourceMappingURL=GetOccupiedSlotsUseCase.d.ts.map