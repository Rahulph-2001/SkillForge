
import { injectable } from 'inversify';
import { IProjectMessageMapper } from './interfaces/IProjectMessageMapper';
import { ProjectMessage } from '../../domain/entities/ProjectMessage';
import { ProjectMessageResponseDTO } from '../dto/project/ProjectMessageDTO';

@injectable()
export class ProjectMessageMapper implements IProjectMessageMapper {
    public toResponseDTO(message: ProjectMessage, currentUserId?: string): ProjectMessageResponseDTO {
        return {
            id: message.id,
            projectId: message.projectId,
            senderId: message.senderId,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            sender: message.sender ? {
                id: message.sender.id,
                name: message.sender.name,
                avatarUrl: message.sender.avatarUrl,
            } : undefined,
            isMine: currentUserId ? message.senderId === currentUserId : undefined,
        };
    }
}
