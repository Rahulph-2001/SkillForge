import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { ProjectApplication, ProjectApplicationStatus } from '../../../domain/entities/ProjectApplication';
export declare class ProjectApplicationRepository extends BaseRepository<ProjectApplication> implements IProjectApplicationRepository {
    constructor(db: Database);
    create(application: ProjectApplication): Promise<ProjectApplication>;
    findById(id: string): Promise<ProjectApplication | null>;
    findByProjectId(projectId: string): Promise<ProjectApplication[]>;
    findByApplicantId(applicantId: string): Promise<ProjectApplication[]>;
    findByProjectAndApplicant(projectId: string, applicantId: string): Promise<ProjectApplication | null>;
    findAcceptedByProject(projectId: string): Promise<ProjectApplication | null>;
    findReceivedApplications(userId: string): Promise<ProjectApplication[]>;
    update(application: ProjectApplication): Promise<ProjectApplication>;
    updateStatus(id: string, status: ProjectApplicationStatus): Promise<ProjectApplication>;
    delete(id: string): Promise<void>;
    private toDomain;
}
//# sourceMappingURL=ProjectApplicationRepository.d.ts.map