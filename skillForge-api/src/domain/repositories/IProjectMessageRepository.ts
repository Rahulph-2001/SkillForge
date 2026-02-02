
import { ProjectMessage } from '../entities/ProjectMessage';

export interface IProjectMessageRepository {
    create(message: ProjectMessage): Promise<ProjectMessage>;
    findByProjectId(projectId: string): Promise<ProjectMessage[]>;
    findById(id: string): Promise<ProjectMessage | null>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(projectId: string, userId: string): Promise<void>;
}
