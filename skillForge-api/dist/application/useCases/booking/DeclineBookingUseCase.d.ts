import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IDeclineBookingUseCase, DeclineBookingRequestDTO } from './interfaces/IDeclineBookingUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class DeclineBookingUseCase implements IDeclineBookingUseCase {
    private readonly bookingRepository;
    private readonly escrowRepository;
    private readonly notificationService;
    private readonly userRepository;
    constructor(bookingRepository: IBookingRepository, escrowRepository: IEscrowRepository, notificationService: INotificationService, userRepository: IUserRepository);
    execute(request: DeclineBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=DeclineBookingUseCase.d.ts.map