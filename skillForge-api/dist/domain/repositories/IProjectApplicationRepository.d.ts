import { ProjectApplication, ProjectApplicationStatus } from '../entities/ProjectApplication';
export interface IProjectApplicationRepository {
    create(application: ProjectApplication): Promise<ProjectApplication>;
    findById(id: string): Promise<ProjectApplication | null>;
    findByProjectId(projectId: string): Promise<ProjectApplication[]>;
    findByApplicantId(applicantId: string): Promise<ProjectApplication[]>;
    findByProjectAndApplicant(projectId: string, applicantId: string): Promise<ProjectApplication | null>;
    findReceivedApplications(userId: string): Promise<ProjectApplication[]>;
    update(application: ProjectApplication): Promise<ProjectApplication>;
    updateStatus(id: string, status: ProjectApplicationStatus): Promise<ProjectApplication>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=IProjectApplicationRepository.d.ts.map