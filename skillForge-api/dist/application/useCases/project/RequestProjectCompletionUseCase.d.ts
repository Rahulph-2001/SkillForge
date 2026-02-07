import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IRequestProjectCompletionUseCase } from './interfaces/IRequestProjectCompletionUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class RequestProjectCompletionUseCase implements IRequestProjectCompletionUseCase {
    private readonly projectRepository;
    private readonly applicationRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(projectRepository: IProjectRepository, applicationRepository: IProjectApplicationRepository, userRepository: IUserRepository, notificationService: INotificationService);
    execute(projectId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=RequestProjectCompletionUseCase.d.ts.map