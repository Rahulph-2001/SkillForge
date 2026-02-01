import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IPaginationService } from '../../../../domain/services/IPaginationService';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminListSessionsUseCase } from './interfaces/IAdminListSessionsUseCase';
import { IPaginationResult } from '../../../../domain/types/IPaginationParams';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';
export declare class AdminListSessionsUseCase implements IAdminListSessionsUseCase {
    private bookingRepository;
    private paginationService;
    private bookingMapper;
    constructor(bookingRepository: IBookingRepository, paginationService: IPaginationService, bookingMapper: IBookingMapper);
    execute(page: number, limit: number, search?: string): Promise<IPaginationResult<BookingResponseDTO>>;
}
//# sourceMappingURL=AdminListSessionsUseCase.d.ts.map