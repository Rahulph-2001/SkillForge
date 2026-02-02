import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetPendingPaymentRequestsUseCase } from './interfaces/IGetPendingPaymentRequestsUseCase';
import { PendingPaymentRequestDTO } from '../../dto/admin/PendingPaymentRequestDTO';
export declare class GetPendingPaymentRequestsUseCase implements IGetPendingPaymentRequestsUseCase {
    private readonly paymentRequestRepository;
    private readonly projectRepository;
    private readonly userRepository;
    constructor(paymentRequestRepository: IProjectPaymentRequestRepository, projectRepository: IProjectRepository, userRepository: IUserRepository);
    execute(): Promise<PendingPaymentRequestDTO[]>;
}
//# sourceMappingURL=GetPendingPaymentRequestsUseCase.d.ts.map