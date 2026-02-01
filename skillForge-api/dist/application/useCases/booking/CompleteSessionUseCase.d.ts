import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { ICompleteSessionUseCase, CompleteSessionRequestDTO } from './interfaces/ICompleteSessionUseCase';
import { Database } from '../../../infrastructure/database/Database';
export declare class CompleteSessionUseCase implements ICompleteSessionUseCase {
    private readonly bookingRepository;
    private readonly escrowRepository;
    private readonly bookingMapper;
    private readonly database;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository, bookingMapper: IBookingMapper, database: Database);
    execute(request: CompleteSessionRequestDTO): Promise<BookingResponseDTO>;
}
//# sourceMappingURL=CompleteSessionUseCase.d.ts.map