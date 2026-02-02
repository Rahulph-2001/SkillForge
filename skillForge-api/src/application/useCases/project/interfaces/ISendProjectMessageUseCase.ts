
import { CreateProjectMessageRequestDTO, ProjectMessageResponseDTO } from '../../../dto/project/ProjectMessageDTO';

export interface ISendProjectMessageUseCase {
    execute(currentUserId: string, data: CreateProjectMessageRequestDTO): Promise<ProjectMessageResponseDTO>;
}
