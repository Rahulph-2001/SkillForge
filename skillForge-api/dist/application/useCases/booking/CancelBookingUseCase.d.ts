import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ICancelBookingUseCase } from './interfaces/ICancelBookingUseCase';
import { CancelBookingRequestDTO } from '../../dto/booking/CancelBookingRequestDTO';
export declare class CancelBookingUseCase implements ICancelBookingUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: CancelBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=CancelBookingUseCase.d.ts.map