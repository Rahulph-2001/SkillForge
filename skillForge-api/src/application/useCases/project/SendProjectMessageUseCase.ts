
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISendProjectMessageUseCase } from './interfaces/ISendProjectMessageUseCase';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { IProjectMessageMapper } from '../../mappers/interfaces/IProjectMessageMapper';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { CreateProjectMessageRequestDTO, ProjectMessageResponseDTO } from '../../dto/project/ProjectMessageDTO';
import { ProjectMessage } from '../../../domain/entities/ProjectMessage';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';

@injectable()
export class SendProjectMessageUseCase implements ISendProjectMessageUseCase {
    constructor(
        @inject(TYPES.IProjectMessageRepository) private readonly messageRepository: IProjectMessageRepository,
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IProjectMessageMapper) private readonly messageMapper: IProjectMessageMapper,
        @inject(TYPES.IWebSocketService) private readonly socketService: IWebSocketService
    ) { }

    async execute(currentUserId: string, data: CreateProjectMessageRequestDTO): Promise<ProjectMessageResponseDTO> {
        // 1. Verify Project Exists
        const project = await this.projectRepository.findById(data.projectId);
        if (!project) {
            throw new NotFoundError(ERROR_MESSAGES.PROJECT.NOT_FOUND);
        }

        // 2. Verify User is Participant (Client or Accepted Contributor)
        const isClient = project.clientId === currentUserId;
        const isContributor = project.acceptedContributor?.id === currentUserId;

        if (!isClient && !isContributor) {
            throw new ForbiddenError('You are not a participant in this project');
        }

        // 3. Create Message Entity
        const message = new ProjectMessage({
            projectId: data.projectId,
            senderId: currentUserId,
            content: data.content,
        });

        // 4. Persist
        const savedMessage = await this.messageRepository.create(message);

        // 5. Create Response DTO
        const responseDTO = this.messageMapper.toResponseDTO(savedMessage, currentUserId);

        // 6. Emit Real-time Event
        // Determine recipient
        const recipientId = isClient ? project.acceptedContributor?.id : project.clientId;
        if (recipientId) {
            this.socketService.sendToUser(recipientId, {
                type: 'project_message_received',
                data: {
                    message: this.messageMapper.toResponseDTO(savedMessage, recipientId), // Map for recipient context
                    projectId: data.projectId
                }
            });
        }

        return responseDTO;
    }
}
