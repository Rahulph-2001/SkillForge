import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IRejectProjectCompletionUseCase } from './interfaces/IRejectProjectCompletionUseCase';
export declare class RejectProjectCompletionUseCase implements IRejectProjectCompletionUseCase {
    private readonly projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(projectId: string, clientId: string): Promise<void>;
}
//# sourceMappingURL=RejectProjectCompletionUseCase.d.ts.map