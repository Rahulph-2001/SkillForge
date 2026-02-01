import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { ICancelBookingUseCase } from './interfaces/ICancelBookingUseCase';
import { CancelBookingRequestDTO } from '../../dto/booking/CancelBookingRequestDTO';
export declare class CancelBookingUseCase implements ICancelBookingUseCase {
    private readonly bookingRepository;
    private readonly escrowRepository;
    private static readonly CANCEL_CUTOFF_MINUTES;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository);
    execute(request: CancelBookingRequestDTO): Promise<void>;
    private parseDateTime;
}
//# sourceMappingURL=CancelBookingUseCase.d.ts.map