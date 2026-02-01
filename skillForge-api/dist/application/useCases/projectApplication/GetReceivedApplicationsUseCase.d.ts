import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { ProjectApplication } from '../../../domain/entities/ProjectApplication';
export declare class GetReceivedApplicationsUseCase {
    private projectApplicationRepository;
    constructor(projectApplicationRepository: IProjectApplicationRepository);
    execute(userId: string): Promise<ProjectApplication[]>;
}
//# sourceMappingURL=GetReceivedApplicationsUseCase.d.ts.map