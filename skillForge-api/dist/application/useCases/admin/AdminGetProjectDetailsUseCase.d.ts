import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IAdminGetProjectDetailsUseCase } from './interfaces/IAdminGetProjectDetailsUseCase';
import { AdminProjectDetailsDTO } from '../../dto/admin/AdminProjectDetailsDTO';
export declare class AdminGetProjectDetailsUseCase implements IAdminGetProjectDetailsUseCase {
    private readonly projectRepository;
    private readonly userRepository;
    private readonly paymentRepository;
    private readonly paymentRequestRepository;
    constructor(projectRepository: IProjectRepository, userRepository: IUserRepository, paymentRepository: IPaymentRepository, paymentRequestRepository: IProjectPaymentRequestRepository);
    execute(projectId: string): Promise<AdminProjectDetailsDTO>;
}
//# sourceMappingURL=AdminGetProjectDetailsUseCase.d.ts.map