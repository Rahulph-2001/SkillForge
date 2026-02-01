import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IRescheduleBookingUseCase, RescheduleBookingRequestDTO } from './interfaces/IRescheduleBookingUseCase';
export declare class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    private readonly bookingRepository;
    private readonly skillRepository;
    constructor(bookingRepository: IBookingRepository, skillRepository: ISkillRepository);
    execute(request: RescheduleBookingRequestDTO): Promise<void>;
    private parseDateTime;
}
//# sourceMappingURL=RescheduleBookingUseCase.d.ts.map