import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IDeclineBookingUseCase, DeclineBookingRequestDTO } from './interfaces/IDeclineBookingUseCase';
export declare class DeclineBookingUseCase implements IDeclineBookingUseCase {
    private readonly bookingRepository;
    private readonly escrowRepository;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository);
    execute(request: DeclineBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=DeclineBookingUseCase.d.ts.map