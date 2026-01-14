import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IPaginationService } from '../../../../domain/services/IPaginationService';
import { IBookingMapper } from '../../../mappers/interfaces/IBookingMapper';
import { IAdminListSessionsUseCase } from './interfaces/IAdminListSessionsUseCase';
import { IPaginationResult } from '../../../../domain/types/IPaginationParams';
import { BookingResponseDTO } from '../../../dto/booking/BookingResponseDTO';

@injectable()
export class AdminListSessionsUseCase implements IAdminListSessionsUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
        @inject(TYPES.IPaginationService) private paginationService: IPaginationService,
        @inject(TYPES.IBookingMapper) private bookingMapper: IBookingMapper
    ) { }

    async execute(page: number, limit: number, search?: string): Promise<IPaginationResult<BookingResponseDTO>> {
        const { page: validatedPage, limit: validatedLimit } = this.paginationService.createParams(page, limit);

        // Repository method returns { data: Booking[], total: number }
        const { data, total } = await this.bookingRepository.listAll(validatedPage, validatedLimit, search);

        // Map Domain Entities to DTOs
        const dtos = this.bookingMapper.toDTOs(data);

        return this.paginationService.createResult(dtos, total, validatedPage, validatedLimit);
    }
}
