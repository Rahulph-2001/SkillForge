import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IAdminGetSessionStatsUseCase } from './interfaces/IAdminGetSessionStatsUseCase';

@injectable()
export class AdminGetSessionStatsUseCase implements IAdminGetSessionStatsUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository
    ) { }

    async execute(): Promise<{
        totalSessions: number;
        completed: number;
        upcoming: number;
        cancelled: number;
    }> {
        return await this.bookingRepository.getGlobalStats();
    }
}
