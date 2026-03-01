// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type ProjectPaymentRequest, ProjectPaymentRequestStatus, type ProjectPaymentRequestType } from '../entities/ProjectPaymentRequest';

export interface IProjectPaymentRequestRepository {
    create(request: ProjectPaymentRequest): Promise<ProjectPaymentRequest>;
    findById(id: string): Promise<ProjectPaymentRequest | null>;
    findByProjectId(projectId: string): Promise<ProjectPaymentRequest[]>;
    findPending(): Promise<ProjectPaymentRequest[]>;
    findPendingByType(type: ProjectPaymentRequestType): Promise<ProjectPaymentRequest[]>;
    update(request: ProjectPaymentRequest): Promise<ProjectPaymentRequest>;
}
