import { IBookingRepository } from '../../../../domain/repositories/IBookingRepository';
import { IAdminGetSessionStatsUseCase } from './interfaces/IAdminGetSessionStatsUseCase';
export declare class AdminGetSessionStatsUseCase implements IAdminGetSessionStatsUseCase {
    private bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(): Promise<{
        totalSessions: number;
        completed: number;
        upcoming: number;
        cancelled: number;
    }>;
}
//# sourceMappingURL=AdminGetSessionStatsUseCase.d.ts.map