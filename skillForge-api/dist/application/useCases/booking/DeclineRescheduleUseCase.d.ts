import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IDeclineRescheduleUseCase, DeclineRescheduleRequestDTO } from './interfaces/IDeclineRescheduleUseCase';
export declare class DeclineRescheduleUseCase implements IDeclineRescheduleUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: DeclineRescheduleRequestDTO): Promise<void>;
}
//# sourceMappingURL=DeclineRescheduleUseCase.d.ts.map