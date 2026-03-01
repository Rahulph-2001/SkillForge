
import { type ProjectMessage } from '../../../domain/entities/ProjectMessage';
import { type ProjectMessageResponseDTO } from '../../dto/project/ProjectMessageDTO';

export interface IProjectMessageMapper {
    toResponseDTO(message: ProjectMessage, currentUserId?: string): ProjectMessageResponseDTO;
}
