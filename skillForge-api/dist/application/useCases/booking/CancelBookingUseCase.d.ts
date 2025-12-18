import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ICancelBookingUseCase, CancelBookingRequestDTO } from './interfaces/ICancelBookingUseCase';
export declare class CancelBookingUseCase implements ICancelBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: CancelBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=CancelBookingUseCase.d.ts.map