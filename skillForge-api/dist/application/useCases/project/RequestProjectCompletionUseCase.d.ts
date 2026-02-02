import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IRequestProjectCompletionUseCase } from './interfaces/IRequestProjectCompletionUseCase';
export declare class RequestProjectCompletionUseCase implements IRequestProjectCompletionUseCase {
    private readonly projectRepository;
    private readonly applicationRepository;
    constructor(projectRepository: IProjectRepository, applicationRepository: IProjectApplicationRepository);
    execute(projectId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=RequestProjectCompletionUseCase.d.ts.map