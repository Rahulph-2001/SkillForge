import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IRescheduleBookingUseCase, RescheduleBookingRequestDTO } from './interfaces/IRescheduleBookingUseCase';
export declare class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: RescheduleBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=RescheduleBookingUseCase.d.ts.map