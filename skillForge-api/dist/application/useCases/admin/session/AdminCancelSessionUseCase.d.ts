import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminCancelSessionUseCase } from './interfaces/IAdminCancelSessionUseCase';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';
export declare class AdminCancelSessionUseCase implements IAdminCancelSessionUseCase {
    private bookingRepository;
    private escrowRepository;
    private bookingMapper;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository, bookingMapper: IBookingMapper);
    execute(bookingId: string, reason: string): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=AdminCancelSessionUseCase.d.ts.map