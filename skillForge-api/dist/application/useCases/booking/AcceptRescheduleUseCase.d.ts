import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IAcceptRescheduleUseCase, AcceptRescheduleRequestDTO } from './interfaces/IAcceptRescheduleUseCase';
export declare class AcceptRescheduleUseCase implements IAcceptRescheduleUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: AcceptRescheduleRequestDTO): Promise<void>;
}
//# sourceMappingURL=AcceptRescheduleUseCase.d.ts.map