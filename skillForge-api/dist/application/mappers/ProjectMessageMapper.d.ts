import { IProjectMessageMapper } from './interfaces/IProjectMessageMapper';
import { ProjectMessage } from '../../domain/entities/ProjectMessage';
import { ProjectMessageResponseDTO } from '../dto/project/ProjectMessageDTO';
export declare class ProjectMessageMapper implements IProjectMessageMapper {
    toResponseDTO(message: ProjectMessage, currentUserId?: string): ProjectMessageResponseDTO;
}
//# sourceMappingURL=ProjectMessageMapper.d.ts.map