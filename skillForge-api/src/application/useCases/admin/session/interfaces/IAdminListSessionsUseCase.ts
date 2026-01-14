import { IPaginationResult } from '../../../../../domain/types/IPaginationParams';
import { BookingResponseDTO } from '../../../../dto/booking/BookingResponseDTO';

export interface IAdminListSessionsUseCase {
    execute(page: number, limit: number, search?: string): Promise<IPaginationResult<BookingResponseDTO>>;
}
