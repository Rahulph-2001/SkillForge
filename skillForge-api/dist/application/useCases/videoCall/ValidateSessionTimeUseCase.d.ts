import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IValidateSessionTimeUseCase } from './interfaces/IValidateSessionTimeUseCase';
import { ValidateSessionTimeResponseDTO } from '../../dto/videoCall/ValidateSessionTimeDTO';
export declare class ValidateSessionTimeUseCase implements IValidateSessionTimeUseCase {
    private bookingRepository;
    private static readonly JOIN_WINDOW_MINUTES_BEFORE;
    private static readonly GRACE_PERIOD_MINUTES_AFTER;
    constructor(bookingRepository: IBookingRepository);
    execute(userId: string, bookingId: string): Promise<ValidateSessionTimeResponseDTO>;
    private parseDateTime;
}
//# sourceMappingURL=ValidateSessionTimeUseCase.d.ts.map