
import { ProjectMessageResponseDTO } from '../../../dto/project/ProjectMessageDTO';

export interface IGetProjectMessagesUseCase {
    execute(currentUserId: string, projectId: string): Promise<ProjectMessageResponseDTO[]>;
}
