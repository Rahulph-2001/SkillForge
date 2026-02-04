import { ProjectMessage } from '../../../domain/entities/ProjectMessage';
import { ProjectMessageResponseDTO } from '../../dto/project/ProjectMessageDTO';
export interface IProjectMessageMapper {
    toResponseDTO(message: ProjectMessage, currentUserId?: string): ProjectMessageResponseDTO;
}
//# sourceMappingURL=IProjectMessageMapper.d.ts.map