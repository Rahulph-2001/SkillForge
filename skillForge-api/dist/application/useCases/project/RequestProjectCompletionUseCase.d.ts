import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IRequestProjectCompletionUseCase } from './interfaces/IRequestProjectCompletionUseCase';
export declare class RequestProjectCompletionUseCase implements IRequestProjectCompletionUseCase {
    private readonly projectRepository;
    constructor(projectRepository: IProjectRepository);
    execute(projectId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=RequestProjectCompletionUseCase.d.ts.map