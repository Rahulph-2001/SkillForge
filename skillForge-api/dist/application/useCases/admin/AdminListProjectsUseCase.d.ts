import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAdminListProjectsUseCase } from './interfaces/IAdminListProjectsUseCase';
import { AdminListProjectsRequestDTO, AdminListProjectsResponseDTO } from '../../dto/admin/AdminProjectDTO';
export declare class AdminListProjectsUseCase implements IAdminListProjectsUseCase {
    private readonly projectRepository;
    private readonly paymentRequestRepository;
    private readonly userRepository;
    constructor(projectRepository: IProjectRepository, paymentRequestRepository: IProjectPaymentRequestRepository, userRepository: IUserRepository);
    execute(dto: AdminListProjectsRequestDTO): Promise<AdminListProjectsResponseDTO>;
}
//# sourceMappingURL=AdminListProjectsUseCase.d.ts.map