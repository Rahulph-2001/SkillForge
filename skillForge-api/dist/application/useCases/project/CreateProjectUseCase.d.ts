import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IValidateProjectPostLimitUseCase } from './interfaces/IValidateProjectPostLimitUseCase';
import { IIncrementProjectPostUsageUseCase } from './interfaces/IIncrementProjectPostUsageUseCase';
import { ICreateProjectUseCase } from './interfaces/ICreateProjectUseCase';
import { CreateProjectRequestDTO } from '../../dto/project/CreateProjectDTO';
import { ProjectResponseDTO } from '../../dto/project/ProjectResponseDTO';
import { IAdminNotificationService } from '../../../domain/services/IAdminNotificationService';
export declare class CreateProjectUseCase implements ICreateProjectUseCase {
    private readonly projectRepository;
    private readonly userRepository;
    private readonly validateLimitUseCase;
    private readonly incrementUsageUseCase;
    private readonly adminNotificationService;
    constructor(projectRepository: IProjectRepository, userRepository: IUserRepository, validateLimitUseCase: IValidateProjectPostLimitUseCase, incrementUsageUseCase: IIncrementProjectPostUsageUseCase, adminNotificationService: IAdminNotificationService);
    execute(userId: string, request: CreateProjectRequestDTO, paymentId?: string): Promise<ProjectResponseDTO>;
}
//# sourceMappingURL=CreateProjectUseCase.d.ts.map