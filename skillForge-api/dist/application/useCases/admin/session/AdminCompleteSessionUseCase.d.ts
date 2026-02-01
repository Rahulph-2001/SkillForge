import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminCompleteSessionUseCase } from './interfaces/IAdminCompleteSessionUseCase';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';
export declare class AdminCompleteSessionUseCase implements IAdminCompleteSessionUseCase {
    private bookingRepository;
    private bookingMapper;
    constructor(bookingRepository: IBookingRepository, bookingMapper: IBookingMapper);
    execute(bookingId: string): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=AdminCompleteSessionUseCase.d.ts.map